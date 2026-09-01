"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Factory, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  Clock,
  Building
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function IndustryDashboardPage() {
  const [assigned, setAssigned] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Feasibility state
  const [techFeas, setTechFeas] = useState<Record<string, string>>({});
  const [econFeas, setEconFeas] = useState<Record<string, string>>({});
  const [cost, setCost] = useState<Record<string, string>>({});
  const [timeline, setTimeline] = useState<Record<string, string>>({});

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
          body: JSON.stringify({ email: 'industry@jharkhand.gov.in', password: 'password123' })
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

  const handleFeasibilitySubmit = async (problemId: string) => {
    const tf = techFeas[problemId] || 'High technical feasibility utilizing modular industrial filtration units.';
    const ef = econFeas[problemId] || 'Economically viable under CSR foundation co-funding.';

    try {
      await fetchApi(`/solutions/problems/${problemId}/feasibility`, {
        method: 'POST',
        body: JSON.stringify({
          technical_feasibility: tf,
          economic_feasibility: ef,
          estimated_cost: cost[problemId] || '₹ 4,00,000',
          estimated_timeline: timeline[problemId] || '45 Days'
        })
      });
      alert('Industry Technical & Economic Feasibility Assessment Submitted!');
      loadAssigned();
    } catch (e: any) {
      alert(e.message || 'Feasibility submission failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <Factory className="w-4 h-4" />
            Tata Cleantech & Industrial R&D Network
          </div>
          <h1 className="text-3xl font-extrabold">Industry & Startup Portal</h1>
          <p className="text-sm text-slate-300 mt-1">Assess technical & economic feasibility, co-fund pilot projects, provide mentorship, and manufacture scaled field equipment.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading industry-relevant problems...</div>
      ) : assigned.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 font-medium">
          No problems assigned for industry collaboration.
        </div>
      ) : (
        <div className="space-y-6">
          {assigned.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-200">
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
                  <Link href={`/problems/${p.id}`} className="font-bold text-lg text-slate-900 hover:text-emerald-700 transition">
                    {p.title}
                  </Link>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                </div>

                {/* Submit Feasibility Form */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-800">Industry Feasibility Assessment</h4>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Technical Feasibility Summary</label>
                    <input
                      type="text"
                      value={techFeas[p.id] || ''}
                      onChange={(e) => setTechFeas({ ...techFeas, [p.id]: e.target.value })}
                      placeholder="e.g. Can deploy modular solar filtration unit..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Economic & CSR Feasibility</label>
                    <input
                      type="text"
                      value={econFeas[p.id] || ''}
                      onChange={(e) => setEconFeas({ ...econFeas, [p.id]: e.target.value })}
                      placeholder="e.g. Co-funded 60% by Tata CSR Foundation..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500">Est. Total Cost</label>
                      <input
                        type="text"
                        value={cost[p.id] || ''}
                        onChange={(e) => setCost({ ...cost, [p.id]: e.target.value })}
                        placeholder="₹ 4,00,000"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500">Est. Scaling Time</label>
                      <input
                        type="text"
                        value={timeline[p.id] || ''}
                        onChange={(e) => setTimeline({ ...timeline, [p.id]: e.target.value })}
                        placeholder="45 Days"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleFeasibilitySubmit(p.id)}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-lg text-xs transition"
                  >
                    🏢 Submit Feasibility & CSR Support
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
