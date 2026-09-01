"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Factory, CheckCircle2, ChevronRight } from 'lucide-react';
import { getDemoProblems } from '@/lib/demoData';

export default function SolutionsDirectoryPage() {
  const problems = getDemoProblems();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">R&D Solutions & Prototype Directory</h1>
        <p className="text-sm text-slate-500 mt-1">Catalog of university R&D prototypes, industry feasibility assessments, and ground solutions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {problems.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono bg-slate-900 text-white px-2 py-0.5 rounded">{p.id}</span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">{p.category}</span>
            </div>

            <h3 className="font-bold text-slate-900 text-lg">{p.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{p.ai_summary}</p>

            {p.solutions && p.solutions.length > 0 ? (
              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 text-xs space-y-1">
                <span className="font-bold text-amber-900 block">Proposed R&D Prototype: {p.solutions[0].title}</span>
                <p className="text-[11px] text-slate-600">{p.solutions[0].description}</p>
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold pt-1">
                  <span>Est Cost: {p.solutions[0].cost_estimate}</span>
                  <span>Timeline: {p.solutions[0].implementation_time}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">R&D proposal in progress.</div>
            )}

            <Link href={`/problems/${p.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline pt-2">
              View Detailed R&D Project →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
