"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  GraduationCap, 
  Factory, 
  ShieldCheck, 
  User as UserIcon, 
  Lock, 
  Mail, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('CITIZEN');
  const [orgName, setOrgName] = useState('');
  const [district, setDistrict] = useState('Ranchi');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await fetchApi('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
            role,
            organization_name: orgName || undefined,
            district,
            phone: phone || undefined
          })
        });
        localStorage.setItem('samadhan_token', res.access_token);
        localStorage.setItem('samadhan_user', JSON.stringify(res.user));
        redirectRole(res.user.role);
      } else {
        const res = await fetchApi('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
        localStorage.setItem('samadhan_token', res.access_token);
        localStorage.setItem('samadhan_user', JSON.stringify(res.user));
        redirectRole(res.user.role);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const redirectRole = (userRole: string) => {
    if (userRole === 'ADMIN') router.push('/admin/validations');
    else if (userRole === 'GOVERNMENT') router.push('/government/dashboard');
    else if (userRole === 'UNIVERSITY') router.push('/university/dashboard');
    else if (userRole === 'INDUSTRY') router.push('/industry/dashboard');
    else router.push('/my-problems');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
            JH
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {isRegister ? 'Create Stakeholder Account' : 'Sign In to Samadhan'}
          </h1>
          <p className="text-xs text-slate-500">
            {isRegister ? 'Select your role to access specialized state dashboards' : 'Enter your credentials to continue'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ramesh Munda"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@jharkhand.gov.in"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-500"
            />
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Select Stakeholder Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white font-bold"
                >
                  <option value="CITIZEN">🧑 Citizen</option>
                  <option value="GOVERNMENT">🏛️ Government Department</option>
                  <option value="UNIVERSITY">🎓 University R&D</option>
                  <option value="INDUSTRY">🏭 Industry / Startup</option>
                  <option value="ADMIN">🛡️ Admin Board</option>
                </select>
              </div>

              {['GOVERNMENT', 'UNIVERSITY', 'INDUSTRY'].includes(role) && (
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. BIT Mesra Water R&D Lab"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-sm transition shadow flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isRegister ? 'Register Account' : 'Sign In')}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
