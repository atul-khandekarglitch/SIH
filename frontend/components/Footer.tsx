import Link from 'next/link';
import { ShieldCheck, MapPin, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-sm">JH</div>
              Solve Bridge
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              AI-powered Societal Problem-to-Solution Collaboration Platform linking citizens, universities, industry R&D, and government departments for measurable grassroots impact across Jharkhand.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Award className="w-4 h-4" />
              SIH Prototype Platform
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Core Portals</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/submit" className="hover:text-white transition">Citizen Problem Report</Link></li>
              <li><Link href="/problems" className="hover:text-white transition">Public Problem Feed</Link></li>
              <li><Link href="/map" className="hover:text-white transition">Interactive Impact Map</Link></li>
              <li><Link href="/my-problems" className="hover:text-white transition">Citizen Progress Tracker</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Stakeholders</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/admin/validations" className="hover:text-white transition">State Innovation Board (Admin)</Link></li>
              <li><Link href="/government/dashboard" className="hover:text-white transition">Government Departments</Link></li>
              <li><Link href="/university/dashboard" className="hover:text-white transition">University R&D Labs</Link></li>
              <li><Link href="/industry/dashboard" className="hover:text-white transition">Industry & Startup Partners</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Key Districts Covered</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {['Ranchi', 'Palamu', 'Dhanbad', 'East Singhbhum', 'Hazaribagh', 'Khunti', 'Bokaro', 'Dumka', 'Deoghar', 'Giridih'].map((d) => (
                <span key={d} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Solve Bridge AI Platform. Built for Smart India Hackathon.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Government Transparency</span>
            <span>AI Governance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
