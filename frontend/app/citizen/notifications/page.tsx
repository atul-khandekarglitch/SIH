"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function CitizenNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/notifications')
      .then(setNotifications)
      .catch(() => {
        setNotifications([
          { id: '1', title: 'Problem JH-001 Accepted', message: 'BIT Mesra & DWSD have accepted your water quality report.', link: '/problems/JH-001', created_at: new Date().toISOString() },
          { id: '2', title: 'Milestone Completed for JH-002', message: 'Jamshedpur road base excavation milestone completed.', link: '/problems/JH-002', created_at: new Date().toISOString() }
        ]);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
        <Bell className="w-6 h-6 text-emerald-700" />
        <h1 className="text-2xl font-bold text-slate-900">Citizen Notifications & Real-Time Alerts</h1>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Link key={n.id} href={n.link || '/problems'} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-emerald-300 transition">
            <div>
              <div className="font-bold text-sm text-slate-900">{n.title}</div>
              <div className="text-xs text-slate-600 mt-0.5">{n.message}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-700" />
          </Link>
        ))}
      </div>
    </div>
  );
}
