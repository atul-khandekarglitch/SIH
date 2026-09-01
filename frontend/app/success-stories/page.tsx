"use client";

import Link from 'next/link';
import { Award, CheckCircle2, Star, Sparkles } from 'lucide-react';

export default function SuccessStoriesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
          <Award className="w-4 h-4 text-emerald-600" /> Ground Impact Success Stories
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Transforming Jharkhand Communities</h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Real examples of citizen-reported problems solved through university engineering & government implementation.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-md">JH-001 • Water & Sanitation</span>
            <span className="text-amber-500 font-bold">★★★★★ 5.0 Citizen Rating</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900">Fluoride Defluoridation Plant in Harmu, Ranchi</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            450 households were suffering from 3.8 ppm fluoride contamination in tube-well water. BIT Mesra Water R&D Lab developed a 3-stage activated alumina filter prototype, co-funded by Tata Cleantech, providing 8,000L/day safe drinking water.
          </p>
        </div>
      </div>
    </div>
  );
}
