import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiMail,
  FiLock,
  FiSun,
  FiMoon,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiShield,
  FiKey,
  FiArrowLeft,
  FiAlertCircle,
  FiActivity
} from 'react-icons/fi';

const AdminLogin: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname || '/admin/overview';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 400));

    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid credentials. Please verify your administrator email and password.');
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@resulta.com.gh');
    setPassword('admin123');
    setError('');
  };

  const isLight = theme === 'light';

  return (
    <div
      className={`h-screen w-screen overflow-y-auto lg:overflow-hidden font-primary transition-colors duration-300 flex items-center justify-center p-4 sm:p-6 relative ${
        isLight
          ? 'bg-warm text-text-primary selection:bg-secondary selection:text-surface'
          : 'bg-slate-950 text-slate-100 selection:bg-secondary selection:text-white'
      }`}
    >
      {/* Decorative background ambient glows matching public website architecture */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className={`absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl transition-opacity ${
            isLight ? 'bg-primary/10 opacity-70' : 'bg-teal-500/10 opacity-30'
          }`}
        />
        <div
          className={`absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full blur-3xl transition-opacity ${
            isLight ? 'bg-secondary/10 opacity-80' : 'bg-blue-600/10 opacity-30'
          }`}
        />
        <div
          className={`absolute -bottom-20 left-1/3 w-80 h-80 rounded-full blur-3xl transition-opacity ${
            isLight ? 'bg-accent/15 opacity-60' : 'bg-emerald-500/10 opacity-20'
          }`}
        />
      </div>

      {/* Main Responsive Card – locked max height to guarantee zero scrollbars on laptop/desktop */}
      <div className="relative z-10 w-full max-w-5xl lg:max-h-[90vh] my-auto">
        <div
          className={`rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 border grid grid-cols-1 lg:grid-cols-12 ${
            isLight
              ? 'bg-surface border-border shadow-primary/15'
              : 'bg-slate-900/90 border-slate-800 shadow-black/60 backdrop-blur-xl'
          }`}
        >
          {/* Left Side: Brand & Value Proposition Panel (6 cols on LG) */}
          <div
            className={`lg:col-span-6 relative p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-hidden ${
              isLight
                ? 'bg-gradient-to-br from-primary via-primary/95 to-secondary/85 text-white'
                : 'bg-gradient-to-br from-slate-950 via-primary/80 to-slate-900 text-slate-100 lg:border-r border-slate-800'
            }`}
          >
            {/* Ambient Lighting & Pattern */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-12 right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

            {/* Top Brand Emblem */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center font-black text-xl shadow-sm backdrop-blur-md">
                  R
                </div>
                <div>
                  <span className="text-base font-extrabold tracking-tight text-white block leading-tight">RESULTA</span>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-white/70 block">
                    Executive Portal
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-[10px] font-bold text-white/90">
                <FiShield className="w-3 h-3 text-accent" />
                <span>Secure TLS 1.3</span>
              </span>
            </div>

            {/* Middle Section: Clean, compact descriptions */}
            <div className="relative z-10 my-6 lg:my-auto py-4 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Centralized Control Center
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal max-w-sm">
                Access examination result-checker PIN pools, reconcile MoMo callbacks, and regulate partner commission payouts.
              </p>

              <div className="pt-1 space-y-2.5">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs text-white shadow-sm">
                  <FiCheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span><strong>Zero-Trust Architecture:</strong> AES-256 PIN vault</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs text-white shadow-sm">
                  <FiActivity className="w-4 h-4 text-accent shrink-0" />
                  <span><strong>Idempotent Engine:</strong> Real-time MoMo gateways</span>
                </div>
              </div>
            </div>

            {/* Footer Compliance text */}
            <div className="relative z-10 text-[10px] text-white/60 font-medium border-t border-white/10 pt-3 flex items-center justify-between">
              <span>OWELYN Holdings Ltd &bull; Sections 20–22 Compliance</span>
              <span>v2.6.0</span>
            </div>
          </div>

          {/* Right Side: Compact Authentication Form (6 cols on LG) */}
          <div
            className={`lg:col-span-6 p-6 sm:p-8 lg:p-10 relative flex flex-col justify-between ${
              isLight ? 'bg-surface' : 'bg-slate-900'
            }`}
          >
            {/* Top Bar: Back Link and Theme Switcher */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <Link
                to="/"
                className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                  isLight ? 'text-text-secondary hover:text-text-primary' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Website</span>
              </Link>

              <button
                type="button"
                onClick={() => setTheme(isLight ? 'dark' : 'light')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all border shadow-sm ${
                  isLight
                    ? 'bg-warm border-border text-text-primary hover:bg-slate-200/60'
                    : 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
                }`}
              >
                {isLight ? (
                  <>
                    <FiMoon className="w-3.5 h-3.5 text-primary" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <FiSun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Center Form Section */}
            <div className="max-w-sm w-full mx-auto my-auto py-1">
              <div className="mb-4">
                <h1 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                  isLight ? 'text-text-primary' : 'text-white'
                }`}>
                  Executive Sign In
                </h1>
                <p className={`mt-1 text-xs ${
                  isLight ? 'text-text-secondary' : 'text-slate-400'
                }`}>
                  Enter your credentials to access the administrative portal.
                </p>
              </div>

              {/* Quick Fill Banner – Compact */}
              <div
                className={`mb-4 p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                  isLight
                    ? 'bg-warm border-border text-text-primary shadow-2sm'
                    : 'bg-slate-800/80 border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-md ${isLight ? 'bg-accent/20 text-warning' : 'bg-amber-500/20 text-amber-400'}`}>
                    <FiKey className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-[11px]">Demo Credentials</p>
                    <p className={`text-[10px] font-mono ${isLight ? 'text-text-secondary' : 'text-slate-400'}`}>
                      admin@resulta.com.gh / admin123
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors shadow-sm ${
                    isLight
                      ? 'bg-secondary text-white hover:bg-[#0d7577]'
                      : 'bg-teal-500 text-slate-950 hover:bg-teal-400'
                  }`}
                >
                  Quick Fill
                </button>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-error text-[11px] font-semibold flex items-center gap-2 shadow-sm">
                  <FiAlertCircle className="w-4 h-4 shrink-0 text-error" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label
                    htmlFor="email"
                    className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${
                      isLight ? 'text-text-primary' : 'text-slate-300'
                    }`}
                  >
                    Administrator Email
                  </label>
                  <div
                    className={`relative rounded-xl border transition-all ${
                      isLight
                        ? 'bg-warm border-border focus-within:bg-white focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20'
                        : 'bg-slate-950 border-slate-800 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20'
                    }`}
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className={`w-3.5 h-3.5 ${isLight ? 'text-text-secondary' : 'text-slate-500'}`} />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@resulta.com.gh"
                      required
                      className={`w-full bg-transparent pl-9 pr-3.5 py-2 text-xs sm:text-sm font-semibold focus:outline-none ${
                        isLight ? 'text-text-primary placeholder-text-secondary/60' : 'text-white placeholder-slate-600'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${
                      isLight ? 'text-text-primary' : 'text-slate-300'
                    }`}
                  >
                    Security Password
                  </label>
                  <div
                    className={`relative rounded-xl border transition-all ${
                      isLight
                        ? 'bg-warm border-border focus-within:bg-white focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20'
                        : 'bg-slate-950 border-slate-800 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20'
                    }`}
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className={`w-3.5 h-3.5 ${isLight ? 'text-text-secondary' : 'text-slate-500'}`} />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      className={`w-full bg-transparent pl-9 pr-10 py-2 text-xs sm:text-sm font-semibold focus:outline-none ${
                        isLight ? 'text-text-primary placeholder-text-secondary/60' : 'text-white placeholder-slate-600'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                    >
                      {showPassword ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className={`w-3.5 h-3.5 rounded border-border text-secondary focus:ring-secondary cursor-pointer ${
                        !isLight ? 'border-slate-700 bg-slate-900 text-teal-500 focus:ring-teal-500' : ''
                      }`}
                    />
                    <span className={`font-medium ${isLight ? 'text-text-secondary' : 'text-slate-400'}`}>
                      Remember device
                    </span>
                  </label>
                  <a
                    href="#forgot-password"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('For administrative security resets, please contact support@owelynholdings.com.');
                    }}
                    className={`font-bold transition-colors ${
                      isLight ? 'text-secondary hover:underline' : 'text-teal-400 hover:underline'
                    }`}
                  >
                    Forgot password?
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                      isLoading ? 'opacity-75 cursor-wait' : 'hover:-translate-y-0.5 active:translate-y-0'
                    } ${
                      isLight
                        ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                        : 'bg-teal-500 text-slate-950 font-black hover:bg-teal-400 shadow-teal-500/20'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <span>Sign In &rarr;</span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer copyright */}
            <div className="mt-4 pt-3 border-t border-border/60 dark:border-slate-800 text-center text-[10px] font-medium text-text-secondary dark:text-slate-500">
              &copy; {new Date().getFullYear()} OWELYN Holdings Ltd. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;