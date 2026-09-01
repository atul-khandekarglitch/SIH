"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  CheckCircle2, 
  PlusCircle, 
  Clock, 
  MapPin,
  ChevronRight,
  FileCheck
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function GovtDashboardPage() {
  const [assigned, setAssigned] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Milestone State
  const [newMilestoneTitle, setNewMilestoneTitle] = useState<Record<string, string>>({});
  const [newMilestoneTarget, setNewMilestoneTarget] = useState<Record<string, string>>({});

  useEffect(() => {
    loadAssigned();
  }, []);

  const loadAssigned = async () => {
    setLoading(true);
    try {
      let token = localStorage.getItem('samadhan_token');
      if (!token) {
        const loginRes = await fetchApi('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: 'govt@jharkhand.gov.in', password: 'password123' })
        });
        localStorage.setItem('samadhan_token', loginRes.access_token);
        localStorage.setItem('samadhan_user', JSON.stringify(loginRes.user));
      }

      const data = await fetchApi('/solutions/organization-assigned');
      setAssigned(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (problemId: string) => {
    try {
      await fetchApi(`/solutions/problems/${problemId}/accept`, { method: 'POST' });
      alert('Problem accepted for Government Implementation');
      loadAssigned();
    } catch (e: any) {
      alert(e.message || 'Accept failed');
    }
  };

  const handleAddMilestone = async (problemId: string) => {
    const title = newMilestoneTitle[problemId];
    if (!title) return alert('Enter milestone title');

    try {
      await fetchApi(`/milestones/problems/${problemId}`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          target_date: newMilestoneTarget[problemId] || '2026-10-15'
        })
      });
      alert('Milestone created!');
      setNewMilestoneTitle({ ...newMilestoneTitle, [problemId]: '' });
      loadAssigned();
    } catch (e: any) {
      alert(e.message || 'Milestone creation failed');
    }
  };

  const handleMarkMilestoneComplete = async (milestoneId: string) => {
    try {
      await fetchApi(`/milestones/${milestoneId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'COMPLETED' })
      });
      alert('Milestone marked complete!');
      loadAssigned();
    } catch (e: any) {
      alert(e.message || 'Failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <Building2 className="w-4 h-4" />
            Jharkhand Drinking Water & Sanitation Dept (DWSD)
          </div>
          <h1 className="text-3xl font-extrabold">Government Department Execution Portal</h1>
          <p className="text-sm text-slate-300 mt-1">Manage assigned societal issues, create ground implementation milestones, track execution, and update public progress.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading assigned problems...</div>
      ) : assigned.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 font-medium">
          No problems currently assigned to your government department.
        </div>
      ) : (
        <div className="space-y-6">
          {assigned.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-1 rounded-md border border-blue-200">
                    {p.category}
                  </span>
                  <span className="text-xs text-slate-500 ml-3">District: <strong>{p.district}</strong></span>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="bg-slate-900 text-white px-3 py-1 rounded-full uppercase">Status: {p.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  <Link href={`/problems/${p.id}`} className="font-bold text-lg text-slate-900 hover:text-blue-700 transition">
                    {p.title}
                  </Link>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                  
                  {p.status === 'ASSIGNED' && (
                    <button
                      onClick={() => handleAccept(p.id)}
                      className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow"
                    >
                      ✓ Accept Assignment & Begin Implementation
                    </button>
                  )}

                  {/* Milestones list */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-blue-700" /> Ground Milestones
                    </h4>

                    {p.milestones && p.milestones.length > 0 ? (
                      <div className="space-y-2">
                        {p.milestones.map((m: any) => (
                          <div key={m.id} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                            <div>
                              <div className="font-bold text-slate-900">{m.title}</div>
                              <div className="text-[11px] text-slate-500">Target: {m.target_date || 'N/A'}</div>
                            </div>
                            {m.status !== 'COMPLETED' ? (
                              <button
                                onClick={() => handleMarkMilestoneComplete(m.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[11px] font-bold"
                              >
                                Mark Completed
                              </button>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                                Completed ✓
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 italic">No milestones defined yet.</div>
                    )}
                  </div>
                </div>

                {/* Add Milestone Form */}
                <div className="bg-blue-50/60 p-5 rounded-xl border border-blue-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase text-blue-950">Add Implementation Milestone</h4>
                  
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Milestone Title</label>
                    <input
                      type="text"
                      value={newMilestoneTitle[p.id] || ''}
                      onChange={(e) => setNewMilestoneTitle({ ...newMilestoneTitle, [p.id]: e.target.value })}
                      placeholder="e.g. Pipeline Trench Excavation"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Date</label>
                    <input
                      type="date"
                      value={newMilestoneTarget[p.id] || ''}
                      onChange={(e) => setNewMilestoneTarget({ ...newMilestoneTarget, [p.id]: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                  </div>

                  <button
                    onClick={() => handleAddMilestone(p.id)}
                    className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 rounded-lg text-xs transition"
                  >
                    + Add Milestone
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
