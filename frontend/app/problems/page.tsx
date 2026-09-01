"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  MapPin, 
  Search, 
  ChevronRight
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function PublicProblemsPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    loadProblems();
  }, [selectedCategory, selectedDistrict, selectedStatus]);

  const loadProblems = async () => {
    setLoading(true);
    try {
      let query = '/problems?';
      if (selectedCategory) query += `category=${encodeURIComponent(selectedCategory)}&`;
      if (selectedDistrict) query += `district=${encodeURIComponent(selectedDistrict)}&`;
      if (selectedStatus) query += `status=${encodeURIComponent(selectedStatus)}&`;
      
      const data = await fetchApi(query);
      setProblems(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = problems.filter(p => {
    const s = searchTerm.toLowerCase();
    return (
      p.id.toLowerCase().includes(s) ||
      p.title.toLowerCase().includes(s) ||
      p.description.toLowerCase().includes(s) ||
      p.district.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s) ||
      (p.address && p.address.toLowerCase().includes(s))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Jharkhand Societal Problems Feed</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time public database of reported community challenges and their R&D resolution pipeline across Jharkhand.</p>
        </div>
        <Link 
          href="/submit" 
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition shadow flex items-center gap-2 self-start md:self-auto"
        >
          + Report New Problem
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search title, district, ID (e.g. JH-003)..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none bg-white text-slate-700 font-medium"
          >
            <option value="">All Categories</option>
            <option value="Water">Water & Sanitation</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Environment">Environment</option>
            <option value="Urban Infrastructure">Urban Infrastructure</option>
            <option value="Education">Education</option>
            <option value="Energy">Energy</option>
            <option value="Public Administration">Public Administration</option>
          </select>
        </div>

        <div>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none bg-white text-slate-700 font-medium"
          >
            <option value="">All Districts</option>
            <option value="Ranchi">Ranchi</option>
            <option value="East Singhbhum">East Singhbhum (Jamshedpur)</option>
            <option value="Dhanbad">Dhanbad</option>
            <option value="Latehar">Latehar</option>
            <option value="Gumla">Gumla</option>
            <option value="Hazaribagh">Hazaribagh</option>
            <option value="Deoghar">Deoghar</option>
            <option value="Bokaro">Bokaro</option>
            <option value="Simdega">Simdega</option>
            <option value="West Singhbhum">West Singhbhum</option>
            <option value="Palamu">Palamu</option>
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none bg-white text-slate-700 font-medium"
          >
            <option value="">All Statuses</option>
            <option value="REPORTED">Reported</option>
            <option value="ROUTING_RECOMMENDED">Routing Recommended</option>
            <option value="ACCEPTED">Accepted / Active R&D</option>
            <option value="RESEARCH">University Research</option>
            <option value="IMPLEMENTATION">Implementation</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Problem Cards Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading public problem feed...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600">
          No problems found matching your search and filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((p) => (
            <Link 
              key={p.id} 
              href={`/problems/${p.id}`}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition overflow-hidden flex flex-col justify-between group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-900 text-white font-mono text-[11px] px-2 py-0.5 rounded">
                      {p.id}
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-200">
                      {p.category}
                    </span>
                  </div>
                  
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    p.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    p.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    p.status === 'RESEARCH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    p.status === 'IMPLEMENTATION' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {p.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {p.district}
                  </span>
                  
                  <span className={`font-semibold ${p.severity >= 8 ? 'text-rose-600' : 'text-amber-600'}`}>
                    Severity {p.severity}/10
                  </span>

                  {p.recommended_route && (
                    <span className="text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                      Route: {p.recommended_route}
                    </span>
                  )}
                </div>

                {p.ai_summary && (
                  <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-900">
                    <span className="font-bold block text-[11px] text-emerald-800 uppercase tracking-wider mb-0.5">AI Summary</span>
                    {p.ai_summary}
                  </div>
                )}
              </div>

              <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
                <span>View Full Details & Status Timeline ({p.id})</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
