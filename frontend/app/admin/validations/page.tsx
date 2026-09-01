"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  GraduationCap, 
  Factory, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function AdminValidationQueuePage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    try {
      let token = localStorage.getItem('samadhan_token');
      if (!token) {
        const loginRes = await fetchApi('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: 'admin@jharkhand.gov.in', password: 'password123' })
        });
        localStorage.setItem('samadhan_token', loginRes.access_token);
        localStorage.setItem('samadhan_user', JSON.stringify(loginRes.user));
      }

      const data = await fetchApi('/admin/validations');
      setQueue(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (problemId: string, defaultRoute: string) => {
    const route = selectedRoute[problemId] || defaultRoute || 'COLLABORATION';
    const noteText = notes[problemId] || 'Admin approved AI route and assigned target R&D teams.';

    try {
      await fetchApi(`/admin/problems/${problemId}/validate`, {
        method: 'POST',
        body: JSON.stringify({
          route,
          assigned_org_ids: [],
          notes: noteText
        })
      });
      alert(`Problem validated successfully under route: ${route}`);
      loadQueue();
    } catch (err: any) {
      alert(err.message || 'Validation failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-slate-900 text-white rounded-2xl p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <ShieldCheck className="w-4 h-4" />
            Jharkhand State Innovation Board Portal
          </div>
          <h1 className="text-3xl font-extrabold">Admin Route Validation Queue</h1>
          <p className="text-sm text-slate-300 mt-1">Review AI classifications, verify severity, examine vector duplicate searches, and approve organizational routing.</p>
        </div>

        <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/50 text-right">
          <div className="text-2xl font-black text-purple-300">{queue.length}</div>
          <div className="text-xs uppercase font-bold text-slate-400">Pending Validation</div>
        </div>
      </div>

      {/* Validation Queue List */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading validation queue...</div>
      ) : queue.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 font-medium">
          🎉 Validation queue is empty! All submitted problems have been reviewed & assigned.
        </div>
      ) : (
        <div className="space-y-6">
          {queue.map((p) => {
            const currentRoute = selectedRoute[p.id] || p.recommended_route || 'COLLABORATION';

            return (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-md border border-slate-200">
                      {p.category}
                    </span>
                    <span className="text-xs text-slate-500 ml-3">District: <strong>{p.district}</strong></span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-bold">
                    <span className="text-rose-600">Severity: {p.severity}/10</span>
                    <span className="text-amber-600">Urgency: {p.urgency}/10</span>
                    <span className="text-emerald-600">Impact: {p.public_impact}/10</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Citizen Report */}
                  <div className="lg:col-span-2 space-y-3">
                    <Link href={`/problems/${p.id}`} className="font-bold text-lg text-slate-900 hover:text-purple-700 transition">
                      {p.title}
                    </Link>
                    <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                    
                    {/* AI Reasoning Box */}
                    <div className="bg-purple-50/80 border border-purple-100 p-4 rounded-xl space-y-1.5 text-xs text-purple-950">
                      <div className="font-bold flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-purple-800">
                          <Sparkles className="w-3.5 h-3.5" /> AI Recommended Route: <strong>{p.recommended_route}</strong>
                        </span>
                        <span>Confidence: {((p.confidence_score || 0.92) * 100).toFixed(0)}%</span>
                      </div>
                      <p className="text-[11px] text-purple-900 leading-normal">{p.reasoning}</p>
                    </div>
                  </div>

                  {/* Right: Admin Action Controls */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                    <label className="block text-xs font-bold uppercase text-slate-700">Approve or Modify Route</label>
                    
                    <select
                      value={currentRoute}
                      onChange={(e) => setSelectedRoute({ ...selectedRoute, [p.id]: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold bg-white text-slate-900"
                    >
                      <option value="GOVERNMENT">Government Department</option>
                      <option value="UNIVERSITY">University R&D Lab</option>
                      <option value="INDUSTRY">Industry / Startup</option>
                      <option value="COLLABORATION">Multi-Stakeholder Collaboration</option>
                    </select>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Admin Validation Notes</label>
                      <input
                        type="text"
                        value={notes[p.id] || ''}
                        onChange={(e) => setNotes({ ...notes, [p.id]: e.target.value })}
                        placeholder="Instructions for assigned team..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleValidate(p.id, p.recommended_route)}
                        className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-bold py-2.5 rounded-lg text-xs transition shadow"
                      >
                        ✓ Approve & Assign
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
