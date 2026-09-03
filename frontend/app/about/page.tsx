"use client";

import Link from 'next/link';
import { Building2, GraduationCap, Factory, ShieldCheck, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-10 rounded-3xl shadow-xl space-y-4">
        <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
          State Innovation Framework
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold">About Solve Bridge</h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Jharkhand Societal Innovation Collaboration Portal connects grassroots citizen complaints directly with university R&D laboratories, industry CSR foundations, and state government departments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <Building2 className="w-8 h-8 text-blue-700" />
          <h3 className="font-bold text-slate-900">Government Bodies</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Directly receive verified citizen reports with exact spatial GPS coordinates, severe impact scores, and automated domain routing.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <GraduationCap className="w-8 h-8 text-amber-600" />
          <h3 className="font-bold text-slate-900">University R&D</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Adopt local challenges as academic R&D capstones (BIT Mesra, Birsa Agricultural University, IIT ISM Dhanbad).
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <Factory className="w-8 h-8 text-emerald-700" />
          <h3 className="font-bold text-slate-900">Industry & CSR</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Co-fund pilot R&D projects, perform technical and economic feasibility assessments, and manufacture scalable solutions.
          </p>
        </div>
      </div>
    </div>
  );
}
