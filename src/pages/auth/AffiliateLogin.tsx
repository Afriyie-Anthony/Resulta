import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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

const AffiliateLogin: React.FC = () => {
  // ── Theme ─────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('resulta_affiliate_theme');
    return stored === 'dark' ? 'dark' : 'light';
  });

  const handleToggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('resulta_affiliate_theme', next);
  };

  const location = useLocation();

  // ── Shared state ──────────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const { affiliateLogin } = useAuth();
  const navigate = useNavigate();

  const from = (location.state as { from?: Location })?.from?.pathname;
  const affiliateFrom = from || '/affiliate/dashboard';

  const isLight = theme === 'light';

  // ── Affiliate Login submit ─────────────────────────────────────────────────
  const handleAffiliateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!email || !password) {
      setSubmitError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    const result = await affiliateLogin(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate(affiliateFrom, { replace: true });
    } else {
      setSubmitError(result.error || 'Invalid email or password. Please try again.');
    }
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
        <div className={`absolute -top-24 -left-24 w-[450px] h-[450px] rounded-full blur-3xl transition-opacity duration-1000 ${isLight ? 'bg-teal-500/15 opacity-80' : 'bg-teal-500/10 opacity-30'}`} />
        <div className={`absolute top-1/3 -right-32 w-[550px] h-[550px] rounded-full blur-3xl transition-opacity duration-1000 ${isLight ? 'bg-blue-600/10 opacity-70' : 'bg-blue-600/10 opacity-30'}`} />
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-5xl my-auto">
        <div className={`rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 border grid grid-cols-1 lg:grid-cols-12 ${isLight ? 'bg-white/80 backdrop-blur-xl border-white/50 shadow-slate-900/10' : 'bg-slate-900/80 border-slate-800 shadow-black/80 backdrop-blur-2xl'}`}>

          {/* ── Left Panel: Brand Showcase ── */}
          <div className={`hidden lg:flex lg:col-span-5 relative p-6 sm:p-8 lg:p-10 flex-col justify-between overflow-hidden ${isLight ? 'bg-gradient-to-br from-[#0B2545] via-teal-900 to-teal-700 text-white' : 'bg-gradient-to-br from-slate-950 via-[#0B2545]/90 to-slate-900 text-slate-100 lg:border-r border-slate-800'}`}>
            <div className="absolute top-10 left-10 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src="/res copy 2-white.png" alt="Resulta Logo" className="h-8 sm:h-9 w-auto object-contain drop-shadow-md" />
              </div>
            </div>

            <div className="relative z-10 my-8 lg:my-auto py-4 space-y-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-300 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-4 inline-block">
                  AFFILIATE PORTAL
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
                  Welcome Back.
                </h2>
                <p className="text-sm text-white/80 leading-relaxed font-semibold mt-4 max-w-sm">
                  Access your dashboard to track referrals, monitor your earnings, and request payouts instantly.
                </p>
              </div>
            </div>

            <div className="relative z-10 text-[10px] font-bold text-white/50 border-t border-white/10 pt-4 flex items-center justify-between">
              <span>&copy; {new Date().getFullYear()} OWUBEX DIGITAL SERVICES | All rights reserved.</span>
            </div>
          </div>

          {/* ── Right Panel: Authentication Form ── */}
          <div className="col-span-1 lg:col-span-7 w-full p-6 sm:p-8 lg:p-12 flex flex-col justify-between">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-2 mb-8">
              <Link
                to="/"
                className={`inline-flex items-center gap-1.5 text-xs font-black transition-colors ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
              >
                <FiArrowLeft className="w-4 h-4" />
                <span>Return to Store</span>
              </Link>

              <button
                type="button"
                onClick={handleToggleTheme}
                className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all border ${isLight ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm' : 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700 shadow-sm'}`}
              >
                {isLight ? <FiMoon className="w-4 h-4" /> : <FiSun className="w-4 h-4" />}
              </button>
            </div>

            {/* Form container */}
            <div className="max-w-md w-full mx-auto my-auto space-y-6">
              
              {/* ── Title ── */}
              <div className="mb-8">
                <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Affiliate Sign In
                </h1>
                <p className={`mt-2 text-sm font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Securely access your partner dashboard.
                </p>
              </div>

              {/* ── Error Banner ── */}
              {submitError && (
                <div role="alert" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                  <FiAlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* ════ AFFILIATE LOGIN FORM ════ */}
              <form onSubmit={handleAffiliateLogin} className="space-y-5" noValidate>
                <InputField id="aff-email" label="Email Address" type="email" value={email} icon={<FiMail />} placeholder="partner@example.com" isLight={isLight}
                  onChange={(v) => { setEmail(v); setSubmitError(''); }}
                />
                <PasswordField id="aff-password" label="Password" value={password} show={showPassword} icon={<FiLock />} placeholder="Enter your password..." isLight={isLight}
                  onChange={(v) => { setPassword(v); setSubmitError(''); }}
                  onToggle={() => setShowPassword((v) => !v)}
                />

                <div className="flex items-center justify-end pt-1">
                  <button type="button" onClick={() => setIsForgotPasswordOpen(true)} className={`text-sm font-bold hover:underline transition-colors ${isLight ? 'text-teal-600' : 'text-teal-400'}`}>
                    Forgot password?
                  </button>
                </div>

                <SubmitButton isLoading={isLoading} isLight={isLight} loadingText="Signing In..." text="Sign In to Portal →" />
              </form>

              {/* Registration Link */}
              <div className="mt-8 text-center">
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Not a partner yet?{' '}
                  <Link to="/affiliate/apply" className={`font-black hover:underline transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Apply Here
                  </Link>
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className={`mt-8 pt-4 border-t text-center text-xs font-bold ${isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-500'}`}>
              
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        isLight={isLight}
        initialEmail={email}
      />
    </div>
  );
};

export default AffiliateLogin;
