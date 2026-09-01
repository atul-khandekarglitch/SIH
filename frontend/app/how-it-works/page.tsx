"use client";

import Link from 'next/link';
import { Sparkles, MapPin, Cpu, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900">How the Innovation Engine Works</h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          A seamless 4-step pipeline bridging citizen problems with university R&D research and ground execution.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">1</div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base">Citizen Problem Reporting & Audio Transcribe</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens submit issue details, photos, GPS location, or use low-literacy voice recording (WebM speech-to-text pipeline).
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">2</div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base">AI Classification & Spatial Duplicate Detection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Internal AI models calculate severity (1-10), urgency, public impact, extract required domain expertise, and flag candidate duplicates using pgvector cosine similarity.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">3</div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base">Admin State Board Validation & Route Approval</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              State Board officials validate AI routing recommendations and assign issues to Government Departments, University R&D Labs, or Industry CSR foundations.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">4</div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base">Prototype R&D, Milestone Tracking & Resolution</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assigned teams log milestone progress, deploy physical prototypes, and receive verified citizen ratings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
