"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  PlusCircle, 
  Sparkles, 
  FileText, 
  CheckCircle2,
  Users
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function UniversityDashboardPage() {
  const [assigned, setAssigned] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Proposal state
  const [solTitle, setSolTitle] = useState<Record<string, string>>({});
  const [solDesc, setSolDesc] = useState<Record<string, string>>({});
  const [solCost, setSolCost] = useState<Record<string, string>>({});
  const [solTime, setSolTime] = useState<Record<string, string>>({});

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
          body: JSON.stringify({ email: 'university@jharkhand.gov.in', password: 'password123' })
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

  const handleProposeSolution = async (problemId: string) => {
    const title = solTitle[problemId];
    const desc = solDesc[problemId];
    if (!title || !desc) return alert('Fill title and description');

    try {
      await fetchApi(`/solutions/problems/${problemId}/propose-solution`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          description: desc,
          cost_estimate: solCost[problemId] || '₹ 2,50,000',
          implementation_time: solTime[problemId] || '30 Days'
        })
      });
      alert('University R&D Solution Proposal submitted!');
      setSolTitle({ ...solTitle, [problemId]: '' });
      setSolDesc({ ...solDesc, [problemId]: '' });
      loadAssigned();
    } catch (e: any) {
      alert(e.message || 'Proposal failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="bg-gradient-to-r from-amber-900 to-slate-900 text-white rounded-2xl p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <GraduationCap className="w-4 h-4" />
            BIT Mesra & BAU R&D Consortium
          </div>
          <h1 className="text-3xl font-extrabold">University R&D Research Portal</h1>
          <p className="text-sm text-slate-300 mt-1">Adopt societal challenges for academic R&D, deploy faculty-guided student capstone teams, build prototypes, and submit solution proposals.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading research-relevant problems...</div>
      ) : assigned.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 font-medium">
          No active research problems assigned.
        </div>
      ) : (
        <div className="space-y-6">
          {assigned.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-200">
                    {p.category}
                  </span>
                  <span className="text-xs text-slate-500 ml-3">District: <strong>{p.district}</strong></span>
                </div>

                <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs uppercase font-bold">
                  Status: {p.status}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <Link href={`/problems/${p.id}`} className="font-bold text-lg text-slate-900 hover:text-amber-700 transition">
                    {p.title}
                  </Link>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>

                  <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 space-y-2">
                    <h4 className="text-xs font-bold uppercase text-amber-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Required R&D Expertise
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(p.required_expertise || ["Water Engineering", "Chemistry"]).map((exp: string, idx: number) => (
                        <span key={idx} className="bg-white text-amber-900 px-2.5 py-1 rounded border border-amber-300 text-xs font-semibold">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Solution Proposal Form */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-800">Propose R&D Solution / Prototype</h4>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Solution Title</label>
                    <input
                      type="text"
                      value={solTitle[p.id] || ''}
                      onChange={(e) => setSolTitle({ ...solTitle, [p.id]: e.target.value })}
                      placeholder="e.g. Solar Activated Alumina Defluoridation Unit"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Technical Description</label>
                    <textarea
                      rows={3}
                      value={solDesc[p.id] || ''}
                      onChange={(e) => setSolDesc({ ...solDesc, [p.id]: e.target.value })}
                      placeholder="Detail technical specifications & prototype mechanism..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500">Est. Cost</label>
                      <input
                        type="text"
                        value={solCost[p.id] || ''}
                        onChange={(e) => setSolCost({ ...solCost, [p.id]: e.target.value })}
                        placeholder="₹ 3.5 Lakhs"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500">Est. Timeline</label>
                      <input
                        type="text"
                        value={solTime[p.id] || ''}
                        onChange={(e) => setSolTime({ ...solTime, [p.id]: e.target.value })}
                        placeholder="21 Days"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleProposeSolution(p.id)}
                    className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 rounded-lg text-xs transition"
                  >
                    🚀 Submit R&D Solution Proposal
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
