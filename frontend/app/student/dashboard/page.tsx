"use client";

import Link from 'next/link';
import { GraduationCap, CheckCircle2, Clock, FileCheck } from 'lucide-react';

export default function StudentDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <div className="bg-gradient-to-r from-amber-900 to-slate-900 text-white p-8 rounded-3xl space-y-2">
        <h1 className="text-2xl font-bold">Student Capstone R&D Dashboard</h1>
        <p className="text-xs text-slate-300">Active societal R&D projects assigned to student research teams.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900">My Assigned R&D Project: JH-001 Fluoride Filter Prototype</h3>
        <p className="text-xs text-slate-600">Task: Test activated alumina chemical absorption levels in water samples.</p>
        <div className="flex gap-2 text-xs">
          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Status: In Progress</span>
        </div>
      </div>
    </div>
  );
}
