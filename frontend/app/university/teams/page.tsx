"use client";

import { Users, GraduationCap, Award } from 'lucide-react';

export default function UniversityTeamsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
        <GraduationCap className="w-6 h-6 text-amber-600" />
        <h1 className="text-2xl font-bold text-slate-900">University Faculty & Student Capstone R&D Teams</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded inline-block">BIT Mesra Environmental Lab</div>
          <h3 className="font-bold text-slate-900 text-lg">Fluoride Defluoridation R&D Team</h3>
          <p className="text-xs text-slate-600">Faculty Mentor: Prof. Ananya Roy • 6 Student Researchers</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded inline-block">Birsa Agricultural University</div>
          <h3 className="font-bold text-slate-900 text-lg">Solar Micro-Irrigation Research Group</h3>
          <p className="text-xs text-slate-600">Faculty Mentor: Dr. Rajesh Kumar • 4 Agronomy Postgrads</p>
        </div>
      </div>
    </div>
  );
}
