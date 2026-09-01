"use client";

import { Users, ShieldCheck } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
        <Users className="w-6 h-6 text-purple-700" />
        <h1 className="text-2xl font-bold text-slate-900">User & Stakeholder Organization Management</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-xs font-bold text-slate-700 uppercase mb-2">Registered Stakeholders</div>
        <ul className="space-y-2 text-xs">
          <li className="p-3 bg-slate-50 rounded-lg flex justify-between">
            <span>Ramesh Munda (Citizen)</span>
            <span className="text-emerald-700 font-bold">Ranchi</span>
          </li>
          <li className="p-3 bg-slate-50 rounded-lg flex justify-between">
            <span>BIT Mesra Water Lab (University R&D)</span>
            <span className="text-amber-700 font-bold">Ranchi</span>
          </li>
          <li className="p-3 bg-slate-50 rounded-lg flex justify-between">
            <span>Tata Cleantech (Industry)</span>
            <span className="text-blue-700 font-bold">East Singhbhum</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
