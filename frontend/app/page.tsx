"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  PlusCircle, 
  Sparkles, 
  Building2, 
  GraduationCap, 
  Factory, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Cpu, 
  Users, 
  Activity,
  Layers,
  Zap
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function LandingPage() {
  const [stats, setStats] = useState<any>({
    total_problems: 4,
    pending_validation: 1,
    high_priority: 3,
    resolved_problems: 1,
    university_involvement: 2,
    industry_involvement: 1,
    government_involvement: 2
  });

  useEffect(() => {
    fetchApi('/analytics/dashboard-stats')
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-emerald-950 text-white pt-20 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Smart India Hackathon 2026 — State Civic AI Portal</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Report a real-world problem. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300">
                Connect with the people capable of solving it.
              </span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed">
              Samadhan Jharkhand bridges citizens with Government Departments, University R&D Labs, and Industry Innovators using AI classification, pgvector similarity detection, and intelligent routing.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link 
                href="/submit" 
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition flex items-center gap-2 text-base"
              >
                <PlusCircle className="w-5 h-5" />
                Report a Problem
              </Link>
              <Link 
                href="/problems" 
                className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold px-6 py-3.5 rounded-xl border border-slate-700 hover:border-slate-600 transition flex items-center gap-2 text-base"
              >
                Explore Public Feed
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.total_problems || 4}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Societal Issues</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.government_involvement || 2}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Govt Depts Active</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.university_involvement || 2}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">University Labs</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.industry_involvement || 1}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Industry Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS END-TO-END PIPELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-bold text-slate-900">How Samadhan Jharkhand Works</h2>
          <p className="text-slate-600">From citizen reporting to AI analysis, multi-stakeholder R&D, and ground verification.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative">
            <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center mb-4">1</div>
            <h3 className="font-bold text-slate-900 mb-2">1. Citizen Submission</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens log issues with photos, Mapbox geolocation, category details, and description.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative">
            <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center mb-4">2</div>
            <h3 className="font-bold text-slate-900 mb-2">2. AI Analysis & Routing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              LLMs extract severity, required domain expertise, similarity scores & recommend target R&D destination.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative">
            <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center mb-4">3</div>
            <h3 className="font-bold text-slate-900 mb-2">3. Admin Validation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              State Board approves AI route recommendations and assigns specific Government, University, or Industry teams.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative">
            <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center mb-4">4</div>
            <h3 className="font-bold text-slate-900 mb-2">4. Solution & Resolution</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Teams build prototypes, track milestones, execute implementations, and receive citizen ratings.
            </p>
          </div>
        </div>
      </section>

      {/* STAKEHOLDER COLLABORATION SHOWCASE */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Government Bodies</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Drinking Water & Sanitation (DWSD), Public Works, Rural Development, Health Department receive verified citizen complaints with exact coordinates and severity rankings.
              </p>
              <Link href="/government/dashboard" className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-semibold hover:text-blue-300">
                View Govt Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Universities & Research</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                BIT Mesra, Birsa Agricultural University, and IIT ISM R&D labs turn complex local problems into real faculty & student capstone research projects and hardware prototypes.
              </p>
              <Link href="/university/dashboard" className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold hover:text-amber-300">
                View University Portal <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Industry & Startups</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tata Cleantech, local startups, and CSR foundations evaluate technical & economic feasibility, offer mentorship, fund pilot projects, and scale field implementations.
              </p>
              <Link href="/industry/dashboard" className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold hover:text-emerald-300">
                View Industry Portal <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <h2 className="text-3xl font-extrabold">Have a societal problem in your area?</h2>
            <p className="text-emerald-100 text-sm">
              Submit your report now. AI will analyze the issue instantly and assign it to the right R&D or government team.
            </p>
          </div>
          <Link 
            href="/submit" 
            className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-8 py-4 rounded-xl shadow-lg transition whitespace-nowrap flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5 text-emerald-700" />
            Report a Problem Now
          </Link>
        </div>
      </section>
    </div>
  );
}
