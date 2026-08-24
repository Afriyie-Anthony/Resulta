import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthStore } from '../../store/authStore';

import { loginRequestSchema } from '../../schemas/auth';
import { ForgotPasswordModal } from '../../components/auth/ForgotPasswordModal';
import { InputField, PasswordField, SubmitButton } from '../../components/auth/AuthFields';
import {
  FiMail,
  FiLock,
  FiSun,
  FiMoon,
  FiArrowLeft,
  FiAlertCircle,
} from 'react-icons/fi';

const AdminLogin: React.FC = () => {
  // ── Theme ─────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('resulta_admin_theme');
    return stored === 'dark' ? 'dark' : 'light';
  });

  const handleToggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('resulta_admin_theme', next);
  };

  // ── Shared state ──────────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  // ── Admin-specific ─────────────────────────────────────────────────────────
  const [rememberMe, setRememberMe] = useState(() =>
    localStorage.getItem('resulta_remember_admin') === 'true',
  );

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname;
  const adminFrom = from || '/admin/overview';

  const isLight = theme === 'light';
  const rememberedEmail = localStorage.getItem('resulta_admin_email') ?? '';

  // ── Admin Login submit ─────────────────────────────────────────────────────
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setFieldErrors({});

    const parsed = loginRequestSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errs = parsed.error.flatten().fieldErrors;
      setFieldErrors({ email: errs.email?.[0], password: errs.password?.[0] });
      return;
    }

    setIsLoading(true);
    const result = await login(email, password, 'admin');
    setIsLoading(false);

    if (!result.success) {
      setSubmitError(result.error || 'Invalid administrator credentials. Please verify your email and password.');
      return;
    }

    const freshUser = useAuthStore.getState().user;
    if (freshUser?.role !== 'ADMIN' && freshUser?.role !== 'SUPER_ADMIN') {
      setSubmitError('Access denied. This portal is restricted to administrators only.');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('resulta_remember_admin', 'true');
      localStorage.setItem('resulta_admin_email', email);
    } else {
      localStorage.removeItem('resulta_remember_admin');
      localStorage.removeItem('resulta_admin_email');
    }

    navigate(adminFrom, { replace: true });
  };

  return (
    <div
      className={`min-h-screen w-screen overflow-y-auto font-primary transition-colors duration-300 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative ${
        isLight
          ? 'bg-slate-100 text-slate-950 selection:bg-[#0F8B8D] selection:text-white'
          : 'bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950'
      }`}
    >
      {/* Decorative background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className={`absolute -top-24 -left-24 w-[450px] h-[450px] rounded-full blur-3xl transition-opacity ${isLight ? 'bg-[#0F8B8D]/15 opacity-80' : 'bg-teal-500/10 opacity-30'}`} />
        <div className={`absolute top-1/3 -right-32 w-[550px] h-[550px] rounded-full blur-3xl transition-opacity ${isLight ? 'bg-[#0B2545]/10 opacity-70' : 'bg-blue-600/10 opacity-30'}`} />
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-5xl my-auto">
        <div className={`rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 border grid grid-cols-1 lg:grid-cols-12 ${isLight ? 'bg-white border-slate-300 shadow-slate-900/10' : 'bg-slate-900/90 border-slate-800 shadow-black/80 backdrop-blur-xl'}`}>

          {/* ── Left Panel: Brand Showcase ── */}
          <div className={`hidden lg:flex lg:col-span-6 relative p-6 sm:p-8 lg:p-10 flex-col justify-between overflow-hidden ${isLight ? 'bg-gradient-to-br from-[#0B2545] via-[#0B2545] to-[#0F8B8D] text-white' : 'bg-gradient-to-br from-slate-950 via-[#0B2545]/90 to-slate-900 text-slate-100 lg:border-r border-slate-800'}`}>
            {/* Ambient overlay */}
            <div className="absolute top-10 left-10 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            {/* Logo & Status */}
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src="/res copy 2-white.png" alt="Resulta Logo" className="h-8 sm:h-9 w-auto object-contain" />
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-300 px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
                  RESULTA PORTAL
                </span>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="relative z-10 my-8 lg:my-auto py-4 space-y-5">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                  Resulta Executive Control Center
                </h2>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-semibold mt-2 max-w-md">
                  Administrative control suite for examination result checker PIN pools, real-time Mobile Money reconciliations, and partner commission distributions.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 text-[10px] font-bold text-white/60 border-t border-white/15 pt-3.5 flex items-center justify-between">
              <span>OWUBEX DIGITAL SERVICES &bull; National Telecom &amp; WAEC Compliance</span>
            </div>
          </div>

          {/* ── Right Panel: Authentication Form ── */}
          <div className="col-span-1 lg:col-span-6 w-full p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <Link
                to="/"
                className={`inline-flex items-center gap-1.5 text-xs font-black transition-colors ${isLight ? 'text-slate-700 hover:text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Storefront</span>
              </Link>

              <button
                type="button"
                onClick={handleToggleTheme}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black transition-all border shadow-2xs ${isLight ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200' : 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'}`}
              >
                {isLight ? <><FiMoon className="w-3.5 h-3.5 text-[#0B2545]" /><span>Dark Mode</span></> : <><FiSun className="w-3.5 h-3.5 text-amber-400" /><span>Light Mode</span></>}
              </button>
            </div>

            {/* Form container */}
            <div className="max-w-md w-full mx-auto my-auto py-2 space-y-5">
              {/* Logo + Portal badge */}
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={isLight ? '/logo.png' : '/res copy 2-white.png'}
                  alt="Resulta Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>

              {/* ── Title ── */}
              <div>
                <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  Executive Sign In
                </h1>
                <p className={`mt-1 text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Enter authorized administrator credentials to access system telemetry.
                </p>
              </div>

              {/* ── Error / Success Banner ── */}
              {submitError && (
                <div role="alert" className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-black flex items-center gap-2.5">
                  <FiAlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* ════ ADMIN LOGIN FORM ════ */}
              <form onSubmit={handleAdminSubmit} className="space-y-4" noValidate>
                <InputField id="admin-email" label="Administrator Email" type="email" value={email || rememberedEmail} icon={<FiMail />} placeholder="admin@resulta.com.gh" error={fieldErrors.email} isLight={isLight}
                  onChange={(v) => { setEmail(v); if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined })); }}
                />
                <PasswordField id="admin-password" label="Security Password" value={password} show={showPassword} icon={<FiLock />} placeholder="Enter admin password..." error={fieldErrors.password} isLight={isLight}
                  onChange={(v) => { setPassword(v); if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined })); }}
                  onToggle={() => setShowPassword((v) => !v)}
                />

                <div className="flex items-center justify-between text-xs font-semibold pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-[#0F8B8D] focus:ring-[#0F8B8D] cursor-pointer" />
                    <span className={isLight ? 'text-slate-700 font-bold' : 'text-slate-300'}>Remember this device</span>
                  </label>
                  <button type="button" onClick={(e) => { e.preventDefault(); setIsForgotPasswordOpen(true); }} className={`font-black hover:underline ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`}>
                    Forgot password?
                  </button>
                </div>

                <SubmitButton isLoading={isLoading} isLight={isLight} loadingText="Authenticating Session..." text="Sign In to Admin Portal →" />
              </form>
              
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
                  <Link to="/affiliate/login" className={`text-xs font-black hover:underline ${isLight ? 'text-slate-500 hover:text-slate-950' : 'text-slate-400 hover:text-white'}`}>
                    Switch to Affiliate Login
                  </Link>
              </div>
            </div>

            {/* Footer */}
            <div className={`mt-4 pt-3 border-t text-center text-[11px] font-bold ${isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'}`}>
              &copy; {new Date().getFullYear()} OWUBEX DIGITAL SERVICES | All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
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
