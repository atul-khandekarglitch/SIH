"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, 
  MapPin, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Image as ImageIcon,
  X,
  Loader2
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

const CATEGORIES = [
  "Water",
  "Healthcare",
  "Agriculture",
  "Sanitation",
  "Environment",
  "Energy",
  "Rural Livelihood",
  "Accessibility",
  "Urban Infrastructure",
  "Education",
  "Public Administration",
  "Other"
];

const DISTRICTS = [
  "Ranchi", "Palamu", "Dhanbad", "East Singhbhum", "Hazaribagh", 
  "Khunti", "Bokaro", "Dumka", "Deoghar", "Giridih", "West Singhbhum",
  "Garhwa", "Chatra", "Koderma", "Ramgarh", "Seraikela Kharsawan", "Lohardaga"
];

export default function ProblemSubmitPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Water');
  const [subcategory, setSubcategory] = useState('');
  const [district, setDistrict] = useState('Ranchi');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number | ''>(23.3441);
  const [lng, setLng] = useState<number | ''>(85.3096);
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  // Image Upload State
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(parseFloat(pos.coords.latitude.toFixed(4)));
          setLng(parseFloat(pos.coords.longitude.toFixed(4)));
        },
        (err) => {
          alert('Could not retrieve browser geolocation. Coordinates set to Ranchi default.');
        }
      );
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('samadhan_token');
      const res = await fetch('http://localhost:8000/api/v1/problems/upload-image', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload image');
      const data = await res.json();
      setImages([...images, data.image_url]);
    } catch (err: any) {
      // Fallback preview URL
      const fakeUrl = "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80";
      setImages([...images, fakeUrl]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Ensure user is logged in or login as demo citizen
      let token: string | null = localStorage.getItem('samadhan_token');
      if (!token) {
        const loginRes = await fetchApi('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: 'citizen@jharkhand.gov.in', password: 'password123' })
        });
        token = loginRes.access_token;
        if (token) {
          localStorage.setItem('samadhan_token', token);
          localStorage.setItem('samadhan_user', JSON.stringify(loginRes.user));
        }
      }

      const res = await fetchApi('/problems', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          category,
          subcategory: subcategory || undefined,
          district,
          address: address || undefined,
          location_lat: lat !== '' ? Number(lat) : undefined,
          location_lng: lng !== '' ? Number(lng) : undefined,
          additional_info: additionalInfo || undefined,
          images
        })
      });

      router.push(`/problems/${res.id}`);
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Citizen Problem Submission
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Report a Societal Problem in Jharkhand</h1>
          <p className="text-sm text-slate-300 mt-2">
            Provide details of the issue. AI will categorize, estimate severity, search duplicates, and route to target R&D teams.
          </p>
          
          {/* Multi-step indicator */}
          <div className="flex items-center gap-4 mt-6 text-xs font-semibold">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 1 ? 'border-emerald-400 bg-emerald-950' : 'border-slate-600'}`}>1</div>
              Issue Details
            </div>
            <div className="h-px bg-slate-700 flex-grow"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 2 ? 'border-emerald-400 bg-emerald-950' : 'border-slate-600'}`}>2</div>
              Location & Media
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border-b border-rose-200 text-rose-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Problem Title *</label>
                <input
                  type="text"
                  required
                  minLength={5}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Drinking Water Contamination and Arsenic in Tube-wells"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Subcategory (Optional)</label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="e.g. Groundwater Fluoride"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Detailed Description *</label>
                <textarea
                  required
                  rows={5}
                  minLength={20}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the issue thoroughly. Mention affected households, duration, symptoms, or affected crops..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (!title || description.length < 20) {
                      setError('Please enter a valid title and detailed description (at least 20 characters).');
                      return;
                    }
                    setError('');
                    setStep(2);
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl transition text-sm"
                >
                  Continue to Location & Media →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">District *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Address / Land Mark</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Village Chainpur, Daltonganj Block"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Coordinates & Mapbox fallback */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    Geolocation Coordinates
                  </span>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="text-xs bg-white hover:bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-300 font-semibold transition"
                  >
                    🎯 Detect Browser Location
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={lat}
                      onChange={(e) => setLat(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={lng}
                      onChange={(e) => setLng(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Upload Problem Photos</label>
                
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100/80 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer space-y-2 inline-block">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                    </div>
                    <div className="text-xs font-semibold text-slate-700">Click to upload photo or drag file here</div>
                    <div className="text-[11px] text-slate-400">PNG, JPG, WEBP up to 10MB</div>
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group">
                        <img src={img} alt="Upload preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Additional Information (Optional)</label>
                <input
                  type="text"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="e.g. Previous testing reports or contact details of local ward member"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  ← Back to Details
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      AI Analyzing & Saving...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      Submit Problem & Run AI Analysis
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
