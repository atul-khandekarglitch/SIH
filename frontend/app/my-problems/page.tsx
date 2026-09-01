"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function MyProblemsPage() {
  const [myProblems, setMyProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyProblems();
  }, []);

  const loadMyProblems = async () => {
    setLoading(true);
    try {
      let token = localStorage.getItem('samadhan_token');
      if (!token) {
        // Default login as citizen demo user
        const loginRes = await fetchApi('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: 'citizen@jharkhand.gov.in', password: 'password123' })
        });
        localStorage.setItem('samadhan_token', loginRes.access_token);
        localStorage.setItem('samadhan_user', JSON.stringify(loginRes.user));
      }

      const data = await fetchApi('/problems/my');
      setMyProblems(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };
const problems = Array.isArray(myProblems) ? myProblems : (myProblems as any)?.problems ?? [];  
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Submitted Problems & Live Tracking</h1>
          <p className="text-sm text-slate-500 mt-1">Track the exact status, assigned teams, milestones, and expected completion of your reported issues.</p>
        </div>
        <Link 
          href="/submit" 
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition shadow flex items-center gap-2"
        >
          + Report Another Problem
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading your tracked issues...</div>
      ) : problems.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 font-medium space-y-3">
          <p>You haven't submitted any problems yet.</p>
          <Link href="/submit" className="inline-block bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs">
            Report First Problem
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Problems.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-md border border-slate-200">
                  {p.category}
                </span>

                <span className="bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Status: {p.status}
                </span>
              </div>

              <div className="space-y-2">
                <Link href={`/problems/${p.id}`} className="text-xl font-bold text-slate-900 hover:text-emerald-700 transition">
                  {p.title}
                </Link>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{p.description}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Recommended Route:</span>
                  <span className="font-bold text-slate-900">{p.recommended_route || 'COLLABORATION'}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Severity / Urgency:</span>
                  <span className="font-bold text-rose-600">{p.severity}/10 Severity</span>
                </div>

                <Link href={`/problems/${p.id}`} className="bg-white hover:bg-slate-100 text-emerald-700 font-bold px-4 py-2 rounded-lg border border-slate-300 transition flex items-center gap-1.5">
                  Track Live Progress <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
