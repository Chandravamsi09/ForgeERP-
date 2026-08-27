import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, Building, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [companyCode, setCompanyCode] = useState('ELEVATEIQ');
  const [email, setEmail] = useState('admin@elevateiq.com');
  const [password, setPassword] = useState('Admin@123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ companyCode, email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (roleEmail: string) => {
    setError('');
    setLoading(true);
    try {
      await login({
        companyCode: 'ELEVATEIQ',
        email: roleEmail,
        password: 'Admin@123456',
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center font-black text-slate-950 text-2xl shadow-xl shadow-sky-500/20">
            F
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-white tracking-tight">
          Sign in to ForgeERP
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Tier-1 Enterprise Manufacturing & ERP Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-4 shadow-2xl border border-slate-800 sm:rounded-2xl sm:px-10 space-y-6">
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Organization / Company Code
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 uppercase font-mono"
                  placeholder="ELEVATEIQ"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Corporate Email Address
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  placeholder="admin@elevateiq.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-lg shadow-sky-600/20 text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 focus:outline-none transition-all cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Quick Demo Sign-in */}
          <div className="pt-4 border-t border-slate-800">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
              1-Click Demo Profiles
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@elevateiq.com')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-500/50 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 group-hover:text-sky-300">
                  <Shield className="w-3.5 h-3.5" /> Enterprise Admin
                </div>
                <div className="text-[10px] text-slate-400">Full platform access</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('plant.manager@elevateiq.com')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Plant Manager
                </div>
                <div className="text-[10px] text-slate-400">Manufacturing & QM</div>
              </button>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/signup"
              className="text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium"
            >
              Need to register a new organization? Create Enterprise Tenant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
