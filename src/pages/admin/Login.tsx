import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthStore } from '../../store/authStore';

import { loginRequestSchema } from '../../schemas/auth';
import { ForgotPasswordModal } from '../../components/auth/ForgotPasswordModal';
import {
  FiMail,
  FiLock,
  FiSun,
  FiMoon,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiShield,
  FiArrowLeft,
  FiAlertCircle,
  FiActivity,
  FiZap
} from 'react-icons/fi';

const AdminLogin: React.FC = () => {
  // ── Theme: read from localStorage so it matches AdminThemeContext ──────────
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('resulta_admin_theme');
    return stored === 'dark' ? 'dark' : 'light';
  });

  const handleToggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('resulta_admin_theme', next);
  };

  // ── Form state ─────────────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('resulta_remember_admin') === 'true';
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname || '/admin/overview';

  // ── Submit handler ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setFieldErrors({});

    // 1. Client-side Zod validation
    const parsed = loginRequestSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errs = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        email: errs.email?.[0],
        password: errs.password?.[0],
      });
      return;
    }

    setIsLoading(true);
    const result = await login(email, password, 'admin');
    setIsLoading(false);

    if (!result.success) {
      setSubmitError(result.error || 'Invalid administrator credentials. Please verify your email and password.');
      return;
    }

    // 2. Role guard — read fresh user from store immediately after login
    const freshUser = useAuthStore.getState().user;
    if (freshUser?.role !== 'ADMIN' && freshUser?.role !== 'SUPER_ADMIN') {
      setSubmitError('Access denied. This portal is restricted to administrators only.');
      return;
    }

    // 3. Remember me — persist email preference
    if (rememberMe) {
      localStorage.setItem('resulta_remember_admin', 'true');
      localStorage.setItem('resulta_admin_email', email);
    } else {
      localStorage.removeItem('resulta_remember_admin');
      localStorage.removeItem('resulta_admin_email');
    }

    navigate(from, { replace: true });
  };

  // ── Fill Demo Admin Credentials ────────────────────────────────────────────
  const handleFillDemoAdmin = () => {
    setEmail('superadmin@example.com');
    setPassword('password123');
    setFieldErrors({});
    setSubmitError('');
  };

  // ── Forgot password ────────────────────────────────────────────────────────
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsForgotPasswordOpen(true);
  };

  const isLight = theme === 'light';

  // Prefill email if "remember me" was set on a previous visit
  const rememberedEmail = localStorage.getItem('resulta_admin_email') ?? '';

  return (
    <div
      className={`min-h-screen w-screen overflow-y-auto font-primary transition-colors duration-300 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative ${
        isLight
          ? 'bg-slate-100 text-slate-950 selection:bg-[#0F8B8D] selection:text-white'
          : 'bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950'
      }`}
    >
      {/* Decorative ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className={`absolute -top-24 -left-24 w-[450px] h-[450px] rounded-full blur-3xl transition-opacity ${
            isLight ? 'bg-[#0F8B8D]/15 opacity-80' : 'bg-teal-500/10 opacity-30'
          }`}
        />
        <div
          className={`absolute top-1/3 -right-32 w-[550px] h-[550px] rounded-full blur-3xl transition-opacity ${
            isLight ? 'bg-[#0B2545]/10 opacity-70' : 'bg-blue-600/10 opacity-30'
          }`}
        />
      </div>

      {/* Main Responsive Card Container */}
      <div className="relative z-10 w-full max-w-5xl my-auto">
        <div
          className={`rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 border grid grid-cols-1 lg:grid-cols-12 ${
            isLight
              ? 'bg-white border-slate-300 shadow-slate-900/10'
              : 'bg-slate-900/90 border-slate-800 shadow-black/80 backdrop-blur-xl'
          }`}
        >
          {/* ── Left Panel: Brand Showcase (Desktop only) ────────────────── */}
          <div
            className={`hidden lg:flex lg:col-span-6 relative p-6 sm:p-8 lg:p-10 flex-col justify-between overflow-hidden ${
              isLight
                ? 'bg-gradient-to-br from-[#0B2545] via-[#0B2545] to-[#0F8B8D] text-white'
                : 'bg-gradient-to-br from-slate-950 via-[#0B2545]/90 to-slate-900 text-slate-100 lg:border-r border-slate-800'
            }`}
          >
            {/* Ambient Overlay Patterns */}
            <div className="absolute top-10 left-10 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            {/* Top Logo & System Status */}
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="/res copy 2-white.png"
                  alt="Resulta Logo"
                  className="h-8 sm:h-9 w-auto object-contain"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-300 px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
                  EXECUTIVE PORTAL
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-black text-emerald-300">
                <FiShield className="w-3 h-3 text-emerald-300" />
                <span>TLS 1.3 ENCRYPTED</span>
              </span>
            </div>

            {/* Middle Value Proposition */}
            <div className="relative z-10 my-8 lg:my-auto py-4 space-y-5">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                  Resulta Executive Control Center
                </h2>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-semibold mt-2 max-w-md">
                  Administrative control suite for examination result checker PIN pools, real-time Mobile Money reconciliations, and partner commission distributions.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white shadow-xs">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <FiCheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-black text-white">Cryptographic PIN Vault</p>
                    <p className="text-[11px] text-white/70 font-semibold">AES-256 encrypted result-checker inventory management</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white shadow-xs">
                  <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                    <FiActivity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-black text-white">Idempotent Payment Engine</p>
                    <p className="text-[11px] text-white/70 font-semibold">Instant Mobile Money callback reconciliation & SMS dispatch</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white shadow-xs">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                    <FiZap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-black text-white">Multi-Channel Telemetry</p>
                    <p className="text-[11px] text-white/70 font-semibold">Real-time Web storefront & USSD *713# telemetry</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Compliance Text */}
            <div className="relative z-10 text-[10px] font-bold text-white/60 border-t border-white/15 pt-3.5 flex items-center justify-between">
              <span>OWELYN Holdings Ltd &bull; National Telecom &amp; WAEC Compliance</span>
              <span className="font-mono text-teal-300">v2.6.0</span>
            </div>
          </div>

          {/* ── Right Panel: Authentication Form ────────────────────────── */}
          <div className="col-span-1 lg:col-span-6 w-full p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            {/* Header Toolbar: Back Button & Theme Toggle */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <Link
                to="/"
                className={`inline-flex items-center gap-1.5 text-xs font-black transition-colors ${
                  isLight ? 'text-slate-700 hover:text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Storefront</span>
              </Link>

              <button
                type="button"
                aria-label="Toggle colour theme"
                onClick={handleToggleTheme}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black transition-all border shadow-2xs ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                    : 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
                }`}
              >
                {isLight ? (
                  <>
                    <FiMoon className="w-3.5 h-3.5 text-[#0B2545]" />
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

            {/* Center Form Container */}
            <div className="max-w-md w-full mx-auto my-auto py-2 space-y-5">
              {/* Brand Title */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={isLight ? '/logo.png' : '/res copy 2-white.png'}
                    alt="Resulta Logo"
                    className="h-8 w-auto object-contain"
                  />
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                    isLight
                      ? 'bg-[#0F8B8D]/15 text-[#0F8B8D] border-[#0F8B8D]/30'
                      : 'bg-teal-500/20 text-teal-400 border-teal-500/30'
                  }`}>
                    ADMIN PORTAL
                  </span>
                </div>

                <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}>
                  Executive Sign In
                </h1>
                <p className={`mt-1 text-xs font-semibold ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  Enter authorized administrator credentials to access system telemetry.
                </p>
              </div>

              {/* Demo Credentials Quick Fill */}
              <div className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 text-xs transition-colors ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <span className="text-[11px] font-bold text-slate-500 truncate">
                  Test Credentials: <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>superadmin@example.com</strong>
                </span>
                <button
                  type="button"
                  onClick={handleFillDemoAdmin}
                  className={`text-[11px] font-black px-3 py-1 rounded-xl border shrink-0 transition-all ${
                    isLight
                      ? 'bg-teal-50 border-teal-300 text-[#0F8B8D] hover:bg-teal-100'
                      : 'bg-teal-500/10 border-teal-500/30 text-teal-300 hover:bg-teal-500/20'
                  }`}
                >
                  Quick Fill
                </button>
              </div>

              {/* Submit Error Banner */}
              {submitError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-black flex items-center gap-2.5 shadow-2xs"
                >
                  <FiAlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                {/* Email */}
                <div>
                  <label
                    htmlFor="admin-email"
                    className={`block text-xs font-black uppercase mb-1.5 ${
                      isLight ? 'text-slate-800' : 'text-slate-300'
                    }`}
                  >
                    Administrator Email
                  </label>
                  <div className="relative">
                    <input
                      id="admin-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={email || rememberedEmail}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                      }}
                      placeholder="admin@resulta.com.gh"
                      required
                      aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                      aria-invalid={!!fieldErrors.email}
                      className={`w-full rounded-2xl pl-11 pr-4 py-2.5 text-xs font-bold border focus:outline-none transition-colors ${
                        fieldErrors.email
                          ? 'border-rose-400 bg-rose-50 dark:bg-rose-900/10 focus:border-rose-500'
                          : isLight
                            ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D] focus:bg-white'
                            : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-teal-500'
                      }`}
                    />
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  {fieldErrors.email && (
                    <p id="email-error" className="mt-1 text-[11px] font-bold text-rose-500">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="admin-password"
                    className={`block text-xs font-black uppercase mb-1.5 ${
                      isLight ? 'text-slate-800' : 'text-slate-300'
                    }`}
                  >
                    Security Password
                  </label>
                  <div className="relative">
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                      }}
                      placeholder="Enter admin password..."
                      required
                      aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                      aria-invalid={!!fieldErrors.password}
                      className={`w-full rounded-2xl pl-11 pr-11 py-2.5 text-xs font-bold border focus:outline-none transition-colors ${
                        fieldErrors.password
                          ? 'border-rose-400 bg-rose-50 dark:bg-rose-900/10 focus:border-rose-500'
                          : isLight
                            ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D] focus:bg-white'
                            : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-teal-500'
                      }`}
                    />
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword
                        ? <FiEyeOff className="w-4 h-4 text-slate-500" />
                        : <FiEye className="w-4 h-4 text-[#0F8B8D]" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p id="password-error" className="mt-1 text-[11px] font-bold text-rose-500">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between text-xs font-semibold pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#0F8B8D] focus:ring-[#0F8B8D] cursor-pointer"
                    />
                    <span className={isLight ? 'text-slate-700 font-bold' : 'text-slate-300'}>
                      Remember this device
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className={`font-black hover:underline ${
                      isLight ? 'text-[#0F8B8D]' : 'text-teal-400'
                    }`}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    id="admin-sign-in-btn"
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                      isLoading ? 'opacity-75 cursor-wait' : 'hover:-translate-y-0.5 active:translate-y-0'
                    } ${
                      isLight
                        ? 'bg-[#0F8B8D] text-white hover:bg-[#0B2545] shadow-[#0F8B8D]/20'
                        : 'bg-teal-500 text-slate-950 font-black hover:bg-teal-400 shadow-teal-500/20'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Authenticating Session...</span>
                      </>
                    ) : (
                      <span>Sign In to Portal &rarr;</span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer copyright */}
            <div className={`mt-4 pt-3 border-t text-center text-[11px] font-bold ${
              isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
            }`}>
              &copy; {new Date().getFullYear()} OWELYN Holdings Ltd. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password OTP Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        isLight={isLight}
        initialEmail={email || rememberedEmail}
      />
    </div>
  );
};

export default AdminLogin;