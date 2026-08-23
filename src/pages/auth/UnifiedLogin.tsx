import React, { useState, useEffect } from 'react';
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
  FiZap,
  FiUser,
  FiPhone,
  FiMapPin,
} from 'react-icons/fi';

type Portal = 'admin' | 'affiliate';
type AffiliateView = 'login' | 'register';
type RegisterStep = 1 | 2;

const UnifiedLogin: React.FC = () => {
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

  // ── Portal tab ────────────────────────────────────────────────────────────
  const [portal, setPortal] = useState<Portal>('admin');
  const [affiliateView, setAffiliateView] = useState<AffiliateView>('login');
  const [registerStep, setRegisterStep] = useState<RegisterStep>(1);

  // ── Shared state ──────────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  // ── Admin-specific ─────────────────────────────────────────────────────────
  const [rememberMe, setRememberMe] = useState(() =>
    localStorage.getItem('resulta_remember_admin') === 'true',
  );

  // ── Affiliate register form ────────────────────────────────────────────────
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    agreeTerms: false,
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login, affiliateLogin, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname;
  const adminFrom = from || '/admin/overview';
  const affiliateFrom = from || '/affiliate/dashboard';

  // Reset errors on tab change
  useEffect(() => {
    setSubmitError('');
    setSubmitSuccess('');
    setFieldErrors({});
    setEmail('');
    setPassword('');
    setRegisterStep(1);
    setAffiliateView('login');
  }, [portal]);

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

  // ── Affiliate Register submit ───────────────────────────────────────────────
  const handleAffiliateRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (registerStep === 1) {
      if (!registerForm.fullName || !registerForm.phone || !registerForm.email || !registerForm.location || !registerForm.password || !registerForm.confirmPassword) {
        setSubmitError('Please fill in all required fields.');
        return;
      }
      if (registerForm.password !== registerForm.confirmPassword) {
        setSubmitError('Passwords do not match.');
        return;
      }
      if (registerForm.password.length < 6) {
        setSubmitError('Password must be at least 6 characters.');
        return;
      }
      setRegisterStep(2);
      setSubmitError('');
      return;
    }

    if (!registerForm.agreeTerms) {
      setSubmitError('You must agree to the Terms & Conditions to continue.');
      return;
    }

    setIsLoading(true);
    const result = await register({
      name: registerForm.fullName,
      email: registerForm.email,
      password: registerForm.password,
    });
    setIsLoading(false);

    if (result.success) {
      setSubmitSuccess('Registration successful! Welcome to the Resulta affiliate program.');
      setTimeout(() => navigate('/affiliate/dashboard', { replace: true }), 1500);
    } else {
      setSubmitError(result.error || 'Registration failed. Please try again.');
    }
  };



  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setSubmitError('');
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-black text-emerald-300">
                <FiShield className="w-3 h-3" />
                TLS 1.3
              </span>
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

              <div className="space-y-3 pt-2">
                {[
                  { icon: FiCheckCircle, color: 'emerald', title: 'Cryptographic PIN Vault', desc: 'AES-256 encrypted result-checker inventory management' },
                  { icon: FiActivity, color: 'teal', title: 'Idempotent Payment Engine', desc: 'Instant Mobile Money callback reconciliation & SMS dispatch' },
                  { icon: FiZap, color: 'amber', title: 'Multi-Channel Telemetry', desc: 'Real-time Web storefront & USSD *713# telemetry' },
                ].map(({ icon: Icon, color, title, desc }) => (
                  <div key={title} className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white shadow-xs">
                    <div className={`w-7 h-7 rounded-xl bg-${color}-500/20 text-${color}-300 flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-black text-white">{title}</p>
                      <p className="text-[11px] text-white/70 font-semibold">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 text-[10px] font-bold text-white/60 border-t border-white/15 pt-3.5 flex items-center justify-between">
              <span>OWELYN Holdings Ltd &bull; National Telecom &amp; WAEC Compliance</span>
              <span className="font-mono text-teal-300">v2.6.0</span>
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

              {/* ── Portal Toggle Tabs ── */}
              <div className={`flex rounded-2xl p-1 border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                {(['admin', 'affiliate'] as Portal[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPortal(p)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all capitalize ${
                      portal === p
                        ? isLight
                          ? 'bg-white text-[#0B2545] shadow-sm border border-slate-200'
                          : 'bg-slate-800 text-white shadow-sm border border-slate-700'
                        : isLight
                          ? 'text-slate-500 hover:text-slate-700'
                          : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {p === 'admin' ? '⚙️ Admin Portal' : '🤝 Affiliate Portal'}
                  </button>
                ))}
              </div>

              {/* ── Title ── */}
              <div>
                <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  {portal === 'admin'
                    ? 'Executive Sign In'
                    : affiliateView === 'register'
                      ? 'Become an Affiliate'
                      : 'Affiliate Sign In'}
                </h1>
                <p className={`mt-1 text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {portal === 'admin'
                    ? 'Enter authorized administrator credentials to access system telemetry.'
                    : affiliateView === 'register'
                      ? 'Apply to join the Resulta affiliate partner program.'
                      : 'Sign in to access your affiliate dashboard and manage referrals.'}
                </p>
              </div>



              {/* ── Affiliate sub-tab: Login / Register ── */}
              {portal === 'affiliate' && (
                <div className={`flex rounded-xl p-1 border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                  {(['login', 'register'] as AffiliateView[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => { setAffiliateView(v); setSubmitError(''); setRegisterStep(1); }}
                      className={`flex-1 py-2 rounded-lg text-xs font-black transition-all capitalize ${
                        affiliateView === v
                          ? isLight ? 'bg-white text-[#0B2545] shadow-sm' : 'bg-slate-800 text-white shadow-sm'
                          : isLight ? 'text-slate-500 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {v === 'login' ? 'Sign In' : 'Apply Now'}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Error / Success Banner ── */}
              {submitError && (
                <div role="alert" className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-black flex items-center gap-2.5">
                  <FiAlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{submitError}</span>
                </div>
              )}
              {submitSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black flex items-center gap-2.5">
                  <FiCheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              {/* ════ ADMIN LOGIN FORM ════ */}
              {portal === 'admin' && (
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
              )}

              {/* ════ AFFILIATE LOGIN FORM ════ */}
              {portal === 'affiliate' && affiliateView === 'login' && (
                <form onSubmit={handleAffiliateLogin} className="space-y-4" noValidate>
                  <InputField id="aff-email" label="Email Address" type="email" value={email} icon={<FiMail />} placeholder="partner@example.com" isLight={isLight}
                    onChange={(v) => { setEmail(v); setSubmitError(''); }}
                  />
                  <PasswordField id="aff-password" label="Password" value={password} show={showPassword} icon={<FiLock />} placeholder="Enter your password..." isLight={isLight}
                    onChange={(v) => { setPassword(v); setSubmitError(''); }}
                    onToggle={() => setShowPassword((v) => !v)}
                  />

                  <div className="flex items-center justify-end pt-1">
                    <button type="button" onClick={() => setIsForgotPasswordOpen(true)} className={`text-xs font-black hover:underline ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`}>
                      Forgot password?
                    </button>
                  </div>

                  <SubmitButton isLoading={isLoading} isLight={isLight} loadingText="Signing In..." text="Sign In to Affiliate Portal →" />

                  <p className={`text-center text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Not a partner yet?{' '}
                    <button type="button" onClick={() => { setAffiliateView('register'); setSubmitError(''); }} className={`font-black hover:underline ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`}>
                      Apply now
                    </button>
                  </p>
                </form>
              )}

              {/* ════ AFFILIATE REGISTER FORM ════ */}
              {portal === 'affiliate' && affiliateView === 'register' && (
                <form onSubmit={handleAffiliateRegister} className="space-y-4" noValidate>
                  {registerStep === 1 && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField id="reg-name" label="Full Name" type="text" value={registerForm.fullName} icon={<FiUser />} placeholder="Your Full Name" isLight={isLight}
                          onChange={(v) => setRegisterForm((p) => ({ ...p, fullName: v }))}
                        />
                        <InputField id="reg-phone" label="Phone Number" type="tel" value={registerForm.phone} icon={<FiPhone />} placeholder="0244XXXXXX" isLight={isLight}
                          onChange={(v) => setRegisterForm((p) => ({ ...p, phone: v }))}
                        />
                      </div>
                      <InputField id="reg-email" label="Email Address" type="email" value={registerForm.email} icon={<FiMail />} placeholder="partner@example.com" isLight={isLight}
                        onChange={(v) => setRegisterForm((p) => ({ ...p, email: v }))}
                      />
                      <InputField id="reg-location" label="Region / Location" type="text" value={registerForm.location} icon={<FiMapPin />} placeholder="e.g. Accra, Greater Accra" isLight={isLight}
                        onChange={(v) => setRegisterForm((p) => ({ ...p, location: v }))}
                      />
                      <PasswordField id="reg-password" label="Password" value={registerForm.password} show={showRegPassword} icon={<FiLock />} placeholder="Min. 6 characters" isLight={isLight}
                        onChange={(v) => setRegisterForm((p) => ({ ...p, password: v }))}
                        onToggle={() => setShowRegPassword((v) => !v)}
                      />
                      <PasswordField id="reg-confirm" label="Confirm Password" value={registerForm.confirmPassword} show={showConfirmPassword} icon={<FiLock />} placeholder="Re-enter password" isLight={isLight}
                        onChange={(v) => setRegisterForm((p) => ({ ...p, confirmPassword: v }))}
                        onToggle={() => setShowConfirmPassword((v) => !v)}
                      />
                    </>
                  )}

                  {registerStep === 2 && (
                    <>
                      <div className={`p-4 rounded-2xl border space-y-1 text-xs ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
                        <p className={`font-black text-sm mb-3 ${isLight ? 'text-slate-800' : 'text-white'}`}>Confirm Your Application</p>
                        {[
                          { label: 'Full Name', value: registerForm.fullName },
                          { label: 'Email', value: registerForm.email },
                          { label: 'Phone', value: registerForm.phone },
                          { label: 'Location', value: registerForm.location },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex justify-between gap-2">
                            <span className={`font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span>
                            <span className={`font-black truncate max-w-[180px] ${isLight ? 'text-slate-900' : 'text-white'}`}>{value}</span>
                          </div>
                        ))}
                      </div>

                      <InputField id="reg-referral" label="Referral Code (Optional)" type="text" value={registerForm.referralCode} icon={<FiZap />} placeholder="Enter referral code if you have one" isLight={isLight}
                        onChange={(v) => setRegisterForm((p) => ({ ...p, referralCode: v }))}
                      />

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={registerForm.agreeTerms}
                          onChange={handleRegChange}
                          className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0F8B8D] cursor-pointer"
                        />
                        <span className={`text-xs font-semibold leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          I agree to the{' '}
                          <Link to="/legal/terms" className={`font-black hover:underline ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`}>Terms &amp; Conditions</Link>
                          {' '}and{' '}
                          <Link to="/legal/privacy" className={`font-black hover:underline ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`}>Privacy Policy</Link>
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() => { setRegisterStep(1); setSubmitError(''); }}
                        className={`text-xs font-bold ${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-500 hover:text-white'}`}
                      >
                        ← Back to edit details
                      </button>
                    </>
                  )}

                  <SubmitButton
                    isLoading={isLoading}
                    isLight={isLight}
                    loadingText={registerStep === 1 ? 'Continue...' : 'Submitting Application...'}
                    text={registerStep === 1 ? 'Continue to Review →' : 'Submit Application →'}
                  />

                  <p className={`text-center text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Already have an account?{' '}
                    <button type="button" onClick={() => { setAffiliateView('login'); setSubmitError(''); }} className={`font-black hover:underline ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`}>
                      Sign in
                    </button>
                  </p>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className={`mt-4 pt-3 border-t text-center text-[11px] font-bold ${isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'}`}>
              &copy; {new Date().getFullYear()} OWELYN Holdings Ltd. All rights reserved.
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

// ─── Shared Sub-components ────────────────────────────────────────────────────

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  icon: React.ReactNode;
  placeholder?: string;
  error?: string;
  isLight: boolean;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, type, value, icon, placeholder, error, isLight, onChange }) => (
  <div>
    <label htmlFor={id} className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-2xl pl-11 pr-4 py-2.5 text-xs font-bold border focus:outline-none transition-colors ${
          error
            ? 'border-rose-400 bg-rose-50 focus:border-rose-500'
            : isLight
              ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D] focus:bg-white'
              : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-teal-500'
        }`}
      />
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400">
        {icon}
      </span>
    </div>
    {error && <p className="mt-1 text-[11px] font-bold text-rose-500">{error}</p>}
  </div>
);

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  show: boolean;
  icon: React.ReactNode;
  placeholder?: string;
  error?: string;
  isLight: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ id, label, value, show, icon, placeholder, error, isLight, onChange, onToggle }) => (
  <div>
    <label htmlFor={id} className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-2xl pl-11 pr-11 py-2.5 text-xs font-bold border focus:outline-none transition-colors ${
          error
            ? 'border-rose-400 bg-rose-50 focus:border-rose-500'
            : isLight
              ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D] focus:bg-white'
              : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-teal-500'
        }`}
      />
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400">
        {icon}
      </span>
      <button type="button" onClick={onToggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
        {show ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4 text-[#0F8B8D]" />}
      </button>
    </div>
    {error && <p className="mt-1 text-[11px] font-bold text-rose-500">{error}</p>}
  </div>
);

interface SubmitButtonProps {
  isLoading: boolean;
  isLight: boolean;
  loadingText: string;
  text: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, isLight, loadingText, text }) => (
  <div className="pt-2">
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full py-3 px-6 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
        isLoading ? 'opacity-75 cursor-wait' : 'hover:-translate-y-0.5 active:translate-y-0'
      } ${isLight ? 'bg-[#0F8B8D] text-white hover:bg-[#0B2545] shadow-[#0F8B8D]/20' : 'bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-teal-500/20'}`}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </button>
  </div>
);

export default UnifiedLogin;
