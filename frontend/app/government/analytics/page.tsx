"use client";

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

export default function GovtAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchApi('/analytics/dashboard-stats').then(setStats).catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900">State Analytics & Heatmap Summary</h1>
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-2xl font-black">{stats.total_problems}</div>
            <div className="text-xs text-slate-500 uppercase">Total Problems</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-2xl font-black text-rose-600">{stats.high_priority}</div>
            <div className="text-xs text-slate-500 uppercase">High Priority</div>
          </div>
        </div>
      )}
    </div>
  );
}
