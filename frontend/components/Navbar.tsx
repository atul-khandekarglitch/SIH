"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  GraduationCap, 
  Factory, 
  LogOut, 
  PlusCircle, 
  Menu, 
  X,
  Sparkles,
  Volume2,
  Globe
} from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { LANGUAGES, TRANSLATIONS, Language, speakText } from '@/lib/translations';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<Language>('hi');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const u = await fetchApi('/auth/me');
      setUser(u);
    } catch (err) {
      const stored = localStorage.getItem('samadhan_user');
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch (e) {}
      }
    }
  };

  const demoLoginAs = async (role: string, email: string) => {
    try {
      const res = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: 'password123' })
      });
      localStorage.setItem('samadhan_token', res.access_token);
      localStorage.setItem('samadhan_user', JSON.stringify(res.user));
      setUser(res.user);
      
      if (role === 'ADMIN') router.push('/admin/validations');
      else if (role === 'GOVERNMENT') router.push('/government/dashboard');
      else if (role === 'UNIVERSITY') router.push('/university/dashboard');
      else if (role === 'INDUSTRY') router.push('/industry/dashboard');
      else router.push('/my-problems');
    } catch (e) {
      alert(`Demo login error.`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('samadhan_token');
    localStorage.removeItem('samadhan_user');
    setUser(null);
    router.push('/');
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      {/* SIH Demo Role Quick Switcher & Multilingual Selector Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SIH 2026:</span>
          </div>

          {/* VISIBLE MULTILINGUAL SYSTEM SELECTOR */}
          <div className="relative inline-block">
            <select
              value={lang}
              aria-label="Select Language / भाषा चुनें"
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-slate-800 text-emerald-300 font-bold border border-slate-700 px-3 py-1.5 rounded-lg text-xs outline-none cursor-pointer hover:bg-slate-700 transition"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => speakText(t.title + ". " + t.tagline, lang)}
            className="bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 px-2.5 py-1 rounded-md text-xs flex items-center gap-1 min-h-[32px] font-semibold"
            title="Read title aloud"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            {t.ttsListen}
          </button>
        </div>

        {/* Persona Switchers */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button 
            onClick={() => demoLoginAs('CITIZEN', 'citizen@jharkhand.gov.in')} 
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded border border-slate-700 transition font-medium min-h-[32px]"
          >
            🧑 {t.citizen}
          </button>
          <button 
            onClick={() => demoLoginAs('ADMIN', 'admin@jharkhand.gov.in')} 
            className="bg-purple-900/60 hover:bg-purple-900 text-purple-200 px-2.5 py-1 rounded border border-purple-700 transition font-medium min-h-[32px]"
          >
            🛡️ {t.admin}
          </button>
          <button 
            onClick={() => demoLoginAs('GOVERNMENT', 'govt@jharkhand.gov.in')} 
            className="bg-blue-900/60 hover:bg-blue-900 text-blue-200 px-2.5 py-1 rounded border border-blue-700 transition font-medium min-h-[32px]"
          >
            🏛️ {t.government}
          </button>
          <button 
            onClick={() => demoLoginAs('UNIVERSITY', 'university@jharkhand.gov.in')} 
            className="bg-amber-900/60 hover:bg-amber-900 text-amber-200 px-2.5 py-1 rounded border border-amber-700 transition font-medium min-h-[32px]"
          >
            🎓 {t.university}
          </button>
          <button 
            onClick={() => demoLoginAs('INDUSTRY', 'industry@jharkhand.gov.in')} 
            className="bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 px-2.5 py-1 rounded border border-emerald-700 transition font-medium min-h-[32px]"
          >
            🏭 {t.industry}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-md">
              JH
            </div>
            <div>
              <div className="font-bold text-slate-900 text-lg leading-tight flex items-center gap-2">
                Solve Bridge
                <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  AI Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">From Community Problems to Real-World Impact</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
            <Link href="/problems" className="hover:text-emerald-700 flex items-center gap-1.5 transition">
              <FileText className="w-4 h-4" />
              {t.publicFeed}
            </Link>
            <Link href="/map" className="hover:text-emerald-700 flex items-center gap-1.5 transition">
              <MapPin className="w-4 h-4" />
              {t.impactMap}
            </Link>
            <Link href="/how-it-works" className="hover:text-emerald-700 text-xs font-semibold text-slate-600">
              How It Works
            </Link>
            <Link href="/solutions" className="hover:text-emerald-700 text-xs font-semibold text-slate-600">
              R&D Solutions
            </Link>

            {user?.role === 'ADMIN' && (
              <Link href="/admin/validations" className="text-purple-700 font-semibold flex items-center gap-1.5 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                <ShieldCheck className="w-4 h-4" />
                Admin Queue
              </Link>
            )}
            {user?.role === 'GOVERNMENT' && (
              <Link href="/government/dashboard" className="text-blue-700 font-semibold flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                <Building2 className="w-4 h-4" />
                Govt Portal
              </Link>
            )}
            {user?.role === 'UNIVERSITY' && (
              <Link href="/university/dashboard" className="text-amber-700 font-semibold flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <GraduationCap className="w-4 h-4" />
                University R&D
              </Link>
            )}
            {user?.role === 'INDUSTRY' && (
              <Link href="/industry/dashboard" className="text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <Factory className="w-4 h-4" />
                Industry Portal
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <Link href="/my-problems" className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg font-medium transition">
                  My Tracked Issues
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 transition font-semibold"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-emerald-700 transition">
                {t.login}
              </Link>
            )}

            <Link 
              href="/submit" 
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl font-bold shadow-sm hover:shadow transition flex items-center gap-2 min-h-[44px]"
            >
              <PlusCircle className="w-4 h-4" />
              {t.reportProblem}
            </Link>
          </nav>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Link 
              href="/submit" 
              className="bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 min-h-[40px]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3">
          <Link href="/problems" className="block py-2 text-sm font-medium text-slate-800">{t.publicFeed}</Link>
          <Link href="/map" className="block py-2 text-sm font-medium text-slate-800">{t.impactMap}</Link>
          <Link href="/how-it-works" className="block py-2 text-sm font-medium text-slate-800">How It Works</Link>
          <Link href="/solutions" className="block py-2 text-sm font-medium text-slate-800">R&D Solutions</Link>
          <Link href="/success-stories" className="block py-2 text-sm font-medium text-slate-800">Success Stories</Link>
          {user ? (
            <>
              <Link href="/my-problems" className="block py-2 text-sm font-bold text-emerald-700">My Tracked Issues</Link>
              <button onClick={handleLogout} className="block py-2 text-sm font-medium text-rose-600">Logout ({user.full_name})</button>
            </>
          ) : (
            <Link href="/login" className="block py-2 text-sm font-bold text-slate-800">{t.login} / {t.register}</Link>
          )}
        </div>
      )}
    </header>
  );
}
