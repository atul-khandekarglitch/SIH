"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Filter, AlertTriangle, Sparkles, ChevronRight } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function PublicMapPage() {
  const [markers, setMarkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  useEffect(() => {
    loadMarkers();
  }, [selectedCategory, selectedDistrict]);

  const loadMarkers = async () => {
    setLoading(true);
    try {
      let query = '/map/markers?';
      if (selectedCategory) query += `category=${encodeURIComponent(selectedCategory)}&`;
      if (selectedDistrict) query += `district=${encodeURIComponent(selectedDistrict)}&`;

      const data = await fetchApi(query);
      setMarkers(data);
      if (data.length > 0) setSelectedMarker(data[0]);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <MapPin className="w-7 h-7 text-emerald-700" />
            Jharkhand State Interactive Societal Problem Map
          </h1>
          <p className="text-sm text-slate-500 mt-1">Geospatial visualization of community challenges, severity clusters, and active R&D interventions across Jharkhand districts.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-emerald-700" />
          Map Filters:
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 font-semibold"
        >
          <option value="">All Categories</option>
          <option value="Water">Water</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Environment">Environment</option>
          <option value="Urban Infrastructure">Urban Infrastructure</option>
        </select>

        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 font-semibold"
        >
          <option value="">All Districts</option>
          <option value="Ranchi">Ranchi</option>
          <option value="Palamu">Palamu</option>
          <option value="Dhanbad">Dhanbad</option>
          <option value="East Singhbhum">East Singhbhum</option>
          <option value="Khunti">Khunti</option>
        </select>
      </div>

      {/* Map Layout: Interactive Visualization + Marker List Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Geographic Map View */}
        <div className="lg:col-span-2 bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative min-h-[480px] flex flex-col justify-between overflow-hidden border border-slate-800">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10 flex justify-between items-center bg-slate-800/90 backdrop-blur p-4 rounded-xl border border-slate-700">
            <div>
              <div className="text-xs font-bold text-emerald-400">Jharkhand State Spatial Coordinates Grid</div>
              <div className="text-xs text-slate-400">Showing {markers.length} mapped markers</div>
            </div>
            <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded font-mono">Mapbox Integrated</span>
          </div>

          {/* District Pins Plot Grid */}
          <div className="relative z-10 my-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {markers.map((m) => {
              const isSelected = selectedMarker?.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMarker(m)}
                  className={`p-4 rounded-xl border text-left transition ${
                    isSelected ? 'bg-emerald-900/90 border-emerald-400 ring-2 ring-emerald-500/50 shadow-lg' : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white line-clamp-1">{m.district}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${m.severity >= 8 ? 'bg-rose-900/80 text-rose-300' : 'bg-amber-900/80 text-amber-300'}`}>
                      Sev {m.severity}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium line-clamp-1">{m.title}</div>
                  <div className="text-[10px] text-emerald-400 mt-1">{m.category}</div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="relative z-10 bg-slate-800/90 backdrop-blur p-3 rounded-xl border border-slate-700 flex flex-wrap gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-rose-400"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High Severity (&gt;=8)</span>
            <span className="flex items-center gap-1 text-amber-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Medium Severity (5-7)</span>
            <span className="flex items-center gap-1 text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Active Intervention</span>
          </div>
        </div>

        {/* Selected Marker Detail Card */}
        <div>
          {selectedMarker ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-md border border-slate-200">
                  {selectedMarker.category}
                </span>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  Severity {selectedMarker.severity}/10
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-lg">{selectedMarker.title}</h3>

              <div className="text-xs text-slate-600 space-y-1">
                <div><strong>District:</strong> {selectedMarker.district}</div>
                <div><strong>Address:</strong> {selectedMarker.address || selectedMarker.district}</div>
                <div><strong>Status:</strong> <span className="font-semibold text-emerald-700">{selectedMarker.status}</span></div>
              </div>

              {selectedMarker.ai_summary && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500 block mb-1">AI Summary</span>
                  {selectedMarker.ai_summary}
                </div>
              )}

              <Link
                href={`/problems/${selectedMarker.id}`}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow"
              >
                View Full Problem & Timeline <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              Select a marker on the map to view problem summary.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
