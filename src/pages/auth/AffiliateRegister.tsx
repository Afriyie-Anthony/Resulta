import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { InputField, PasswordField, SubmitButton } from '../../components/auth/AuthFields';
import { registerPublicAffiliate } from '../../services/auth.service';
import {
  FiSun,
  FiMoon,
  FiCheckCircle,
  FiArrowLeft,
  FiAlertCircle,
  FiUser,
  FiPhone,
  FiMapPin,
  FiZap,
  FiMail,
  FiBriefcase,
  FiLock,
  FiCreditCard,
  FiActivity
} from 'react-icons/fi';

type RegisterStep = 1 | 2 | 3;

const AffiliateRegister: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('resulta_affiliate_theme');
    return stored === 'dark' ? 'dark' : 'light';
  });

  const handleToggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('resulta_affiliate_theme', next);
  };

  const [registerStep, setRegisterStep] = useState<RegisterStep>(1);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    businessName: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    agreeTerms: false,
    paymentChannel: 'MOBILE_MONEY' as 'MOBILE_MONEY' | 'BANK',
    network: '',
    bankName: '',
    bankCode: '',
    accountNumber: '',
    accountName: '',
  });

  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const isLight = theme === 'light';

  const handleNextStep = () => {
    setSubmitError('');
    if (registerStep === 1) {
      if (!registerForm.fullName || !registerForm.phone || !registerForm.email || !registerForm.location) {
        setSubmitError('Please provide all required personal details (Name, Phone, Email, Location).');
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(registerForm.email)) {
        setSubmitError('Please provide a valid email address.');
        return;
      }
      setRegisterStep(2);
    } else if (registerStep === 2) {
      if (!registerForm.paymentChannel || !registerForm.accountNumber || !registerForm.accountName) {
        setSubmitError('Please provide your payout account details.');
        return;
      }
      if (registerForm.paymentChannel === 'MOBILE_MONEY' && !registerForm.network) {
        setSubmitError('Please select your mobile money network.');
        return;
      }
      if (registerForm.paymentChannel === 'BANK' && !registerForm.bankName) {
        setSubmitError('Please provide your bank name.');
        return;
      }
      setRegisterStep(3);
    }
  };

  const handlePrevStep = () => {
    if (registerStep > 1) {
      setSubmitError('');
      setRegisterStep((prev) => (prev - 1) as RegisterStep);
    }
  };

  const handleAffiliateRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setSubmitError('Passwords do not match.');
      return;
    }
    if (registerForm.password.length < 6) {
      setSubmitError('Password must be at least 6 characters.');
      return;
    }
    if (!registerForm.agreeTerms) {
      setSubmitError('You must agree to the Terms & Conditions to continue.');
      return;
    }

    setIsLoading(true);
    try {
      await registerPublicAffiliate({
        name: registerForm.fullName,
        phoneNumber: registerForm.phone,
        businessName: registerForm.businessName || undefined,
        email: registerForm.email,
        location: registerForm.location,
        paymentChannel: registerForm.paymentChannel,
        network: registerForm.network || undefined,
        bankName: registerForm.bankName || undefined,
        bankCode: registerForm.bankCode || undefined,
        accountNumber: registerForm.accountNumber,
        accountName: registerForm.accountName,
        password: registerForm.password,
        confirmPassword: registerForm.confirmPassword,
        referralCode: registerForm.referralCode || undefined,
      });

      setIsLoading(false);
      setSubmitSuccess('Application submitted successfully! Awaiting admin approval.');
      setTimeout(() => navigate('/affiliate/login', { replace: true }), 3000);
    } catch (err: any) {
      setIsLoading(false);
      setSubmitError(err.response?.data?.message || err.message || 'Application failed.');
    }
  };

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setRegisterForm((prev) => ({ ...prev, [target.name]: target.checked }));
    } else {
      setRegisterForm((prev) => ({ ...prev, [target.name]: target.value }));
    }
    setSubmitError('');
  };

  // Shared select class
  const selectClass = `w-full rounded-xl px-4 py-2 text-xs font-bold focus:outline-none transition-all border ${
    isLight
      ? 'bg-slate-50 text-slate-950 border-slate-200 focus:bg-white focus:border-[#0F8B8D]'
      : 'bg-slate-900/80 text-white border-slate-800 focus:bg-slate-900 focus:border-teal-500'
  }`;

  const labelClass = `block text-[10px] font-black uppercase tracking-widest mb-1 ${
    isLight ? 'text-slate-500' : 'text-slate-400'
  }`;

  return (
    <div
      className={`min-h-screen w-screen overflow-y-auto font-primary transition-colors duration-300 flex items-center justify-center p-3 sm:p-4 lg:p-6 relative ${
        isLight
          ? 'bg-slate-100 text-slate-950 selection:bg-[#0F8B8D] selection:text-white'
          : 'bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950'
      }`}
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className={`absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full blur-3xl transition-opacity duration-1000 ${isLight ? 'bg-emerald-400/15 opacity-80' : 'bg-teal-500/10 opacity-30'}`} />
        <div className={`absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full blur-3xl transition-opacity duration-1000 ${isLight ? 'bg-cyan-500/10 opacity-70' : 'bg-blue-600/10 opacity-30'}`} />
      </div>

      <div className="relative z-10 w-full max-w-5xl my-auto">
        <div className={`rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 border grid grid-cols-1 lg:grid-cols-12 ${isLight ? 'bg-white/80 backdrop-blur-xl border-white/50 shadow-slate-900/10' : 'bg-slate-900/80 border-slate-800 shadow-black/80 backdrop-blur-2xl'}`}>

          {/* Left Panel */}
          <div className={`hidden lg:flex lg:col-span-5 relative p-8 flex-col justify-between overflow-hidden ${isLight ? 'bg-gradient-to-br from-emerald-600 via-teal-700 to-[#0B2545] text-white' : 'bg-gradient-to-br from-slate-900 via-[#0B2545]/90 to-slate-950 text-slate-100 lg:border-r border-slate-800'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src="/res copy 2-white.png" alt="Resulta Logo" className="h-8 w-auto object-contain drop-shadow-md" />
              </div>
            </div>

            <div className="relative z-10 space-y-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-300 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-3 inline-block">
                  Partnership Application
                </span>
                <h2 className="text-3xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
                  Turn Connections into Commissions.
                </h2>
                <p className="text-sm text-white/80 leading-relaxed font-semibold mt-3 max-w-sm">
                  Join Ghana's fastest-growing digital voucher distribution network. Earn instant commissions on every WASSCE/NOVDEC and BECE voucher you sell.
                </p>
              </div>
            </div>

            <div className="relative z-10 text-[10px] font-bold text-white/50 border-t border-white/10 pt-4">
              &copy; {new Date().getFullYear()} OWUBEX DIGITAL SERVICES | All rights reserved.
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-1 lg:col-span-7 w-full p-5 sm:p-7 lg:p-10 flex flex-col justify-between relative">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-2 mb-5">
              <Link to="/" className={`inline-flex items-center gap-1.5 text-xs font-black transition-colors ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}>
                <FiArrowLeft className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <button type="button" onClick={handleToggleTheme} className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all border ${isLight ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm' : 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700 shadow-sm'}`}>
                {isLight ? <FiMoon className="w-4 h-4" /> : <FiSun className="w-4 h-4" />}
              </button>
            </div>

            <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
              {/* Page title */}
              <div className="mb-4">
                <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Apply to become an Affiliate
                </h1>
                <p className={`mt-1 text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Complete the 3-step application to get your unique referral link.
                </p>
              </div>

              {/* Step Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-teal-600' : 'text-teal-400'}`}>
                    Step {registerStep} of 3
                  </span>
                  <span className={`text-[10px] font-bold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    {registerStep === 1 && 'Personal Info'}
                    {registerStep === 2 && 'Payout Details'}
                    {registerStep === 3 && 'Security'}
                  </span>
                </div>
                <div className={`h-1.5 w-full rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${(registerStep / 3) * 100}%` }}
                  />
                </div>

                {/* Step dots */}
                <div className="flex justify-between mt-2">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center gap-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border transition-all ${
                        registerStep > s
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : registerStep === s
                          ? isLight ? 'bg-[#0F8B8D] border-[#0F8B8D] text-white' : 'bg-teal-500 border-teal-500 text-slate-950'
                          : isLight ? 'bg-white border-slate-300 text-slate-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                      }`}>
                        {registerStep > s ? '✓' : s}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alerts */}
              {submitError && (
                <div role="alert" className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2">
                  <FiAlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}
              {submitSuccess && (
                <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-start gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2">
                  <FiCheckCircle className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              <form onSubmit={handleAffiliateRegister} noValidate>
                {/* ─── Step 1: Personal Info ─────────────────────────── */}
                {registerStep === 1 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    {/* Row 1: Full Name + Phone */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <InputField
                        id="reg-name"
                        label="Full Name *"
                        type="text"
                        value={registerForm.fullName}
                        icon={<FiUser />}
                        placeholder="Kwame Mensah"
                        isLight={isLight}
                        onChange={(v) => setRegisterForm((p) => ({ ...p, fullName: v }))}
                      />
                      <InputField
                        id="reg-phone"
                        label="Phone Number *"
                        type="tel"
                        value={registerForm.phone}
                        icon={<FiPhone />}
                        placeholder="024XXXXXXX"
                        isLight={isLight}
                        onChange={(v) => setRegisterForm((p) => ({ ...p, phone: v }))}
                      />
                    </div>

                    {/* Row 2: Email + Location */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <InputField
                        id="reg-email"
                        label="Email Address *"
                        type="email"
                        value={registerForm.email}
                        icon={<FiMail />}
                        placeholder="kwame@example.com"
                        isLight={isLight}
                        onChange={(v) => setRegisterForm((p) => ({ ...p, email: v }))}
                      />
                      <InputField
                        id="reg-location"
                        label="Location / Region *"
                        type="text"
                        value={registerForm.location}
                        icon={<FiMapPin />}
                        placeholder="e.g. Accra"
                        isLight={isLight}
                        onChange={(v) => setRegisterForm((p) => ({ ...p, location: v }))}
                      />
                    </div>

                    {/* Row 3: Business Name (full width, optional) */}
                    <div className="mb-4">
                      <InputField
                        id="reg-business"
                        label="Business Name (Optional)"
                        type="text"
                        value={registerForm.businessName}
                        icon={<FiBriefcase />}
                        placeholder="Mensah Digital"
                        isLight={isLight}
                        onChange={(v) => setRegisterForm((p) => ({ ...p, businessName: v }))}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className={`w-full py-2.5 px-6 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 active:translate-y-0 ${
                        isLight
                          ? 'bg-[#0F8B8D] text-white hover:bg-[#0B2545] shadow-[#0F8B8D]/20'
                          : 'bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-teal-500/20'
                      }`}
                    >
                      Continue →
                    </button>
                  </div>
                )}

                {/* ─── Step 2: Payout Details ────────────────────────── */}
                {registerStep === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    {/* Info banner */}
                    <div className={`p-3 rounded-xl border mb-3 flex items-center gap-2 ${isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-900/50 border-slate-800'}`}>
                      <FiCreditCard className="text-emerald-500 shrink-0 w-4 h-4" />
                      <div>
                        <p className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Payout Destination</p>
                        <p className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Where should we send your commissions?</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <label htmlFor="paymentChannel" className={labelClass}>Payment Channel *</label>
                        <select id="paymentChannel" name="paymentChannel" value={registerForm.paymentChannel} onChange={handleRegChange} className={selectClass}>
                          <option value="MOBILE_MONEY">Mobile Money</option>
                          <option value="BANK">Bank Transfer</option>
                        </select>
                      </div>

                      {registerForm.paymentChannel === 'MOBILE_MONEY' && (
                        <div>
                          <label htmlFor="network" className={labelClass}>Network *</label>
                          <select id="network" name="network" value={registerForm.network} onChange={handleRegChange} className={selectClass}>
                            <option value="">Select network</option>
                            <option value="MTN">MTN</option>
                            <option value="VODAFONE">Telecel</option>
                            <option value="AIRTELTIGO">AT</option>
                          </select>
                        </div>
                      )}

                      {registerForm.paymentChannel === 'BANK' && (
                        <div className="grid grid-cols-2 gap-3">
                          <InputField id="reg-bankName" label="Bank Name *" type="text" value={registerForm.bankName} icon={<FiActivity />} placeholder="e.g. Ecobank" isLight={isLight}
                            onChange={(v) => setRegisterForm((p) => ({ ...p, bankName: v }))}
                          />
                          <InputField id="reg-bankCode" label="Bank Code (Optional)" type="text" value={registerForm.bankCode} icon={<FiActivity />} placeholder="e.g. 040100" isLight={isLight}
                            onChange={(v) => setRegisterForm((p) => ({ ...p, bankCode: v }))}
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <InputField id="reg-accountNumber" label="Account / Mobile No. *" type="text" value={registerForm.accountNumber} icon={<FiActivity />} placeholder="Account Number" isLight={isLight}
                          onChange={(v) => setRegisterForm((p) => ({ ...p, accountNumber: v }))}
                        />
                        <InputField id="reg-accountName" label="Account Name *" type="text" value={registerForm.accountName} icon={<FiUser />} placeholder="Name on account" isLight={isLight}
                          onChange={(v) => setRegisterForm((p) => ({ ...p, accountName: v }))}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={handlePrevStep} className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all border ${isLight ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}`}>
                        Back
                      </button>
                      <button type="button" onClick={handleNextStep} className={`flex-1 py-2.5 px-6 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 active:translate-y-0 ${isLight ? 'bg-[#0F8B8D] text-white hover:bg-[#0B2545] shadow-[#0F8B8D]/20' : 'bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-teal-500/20'}`}>
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {/* ─── Step 3: Security ─────────────────────────────── */}
                {registerStep === 3 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-3 mb-4">
                      {/* Password fields side by side */}
                      <div className="grid grid-cols-2 gap-3">
                        <PasswordField
                          id="reg-password"
                          label="Create Password *"
                          value={registerForm.password}
                          show={showRegPassword}
                          icon={<FiLock />}
                          placeholder="Min. 6 chars"
                          isLight={isLight}
                          onChange={(v) => setRegisterForm((p) => ({ ...p, password: v }))}
                          onToggle={() => setShowRegPassword((v) => !v)}
                        />
                        <PasswordField
                          id="reg-confirm"
                          label="Confirm Password *"
                          value={registerForm.confirmPassword}
                          show={showConfirmPassword}
                          icon={<FiLock />}
                          placeholder="Re-enter"
                          isLight={isLight}
                          onChange={(v) => setRegisterForm((p) => ({ ...p, confirmPassword: v }))}
                          onToggle={() => setShowConfirmPassword((v) => !v)}
                        />
                      </div>

                      <InputField
                        id="reg-referral"
                        label="Referral Code (Optional)"
                        type="text"
                        value={registerForm.referralCode}
                        icon={<FiZap />}
                        placeholder="Got a code?"
                        isLight={isLight}
                        onChange={(v) => setRegisterForm((p) => ({ ...p, referralCode: v }))}
                      />

                      {/* Terms */}
                      <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'}`}>
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            name="agreeTerms"
                            checked={registerForm.agreeTerms}
                            onChange={handleRegChange}
                            className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer transition-colors shrink-0"
                          />
                          <span className={`text-[11px] font-semibold leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            I confirm that the information is accurate and I agree to the{' '}
                            <Link to="/legal/terms" target="_blank" className={`font-black hover:underline ${isLight ? 'text-teal-600' : 'text-teal-400'}`}>Terms &amp; Conditions</Link>
                            {' '}and{' '}
                            <Link to="/legal/privacy" target="_blank" className={`font-black hover:underline ${isLight ? 'text-teal-600' : 'text-teal-400'}`}>Privacy Policy</Link>.
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={handlePrevStep} disabled={isLoading} className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all border disabled:opacity-50 ${isLight ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}`}>
                        Back
                      </button>
                      <div className="flex-1">
                        <SubmitButton isLoading={isLoading} isLight={isLight} loadingText="Submitting..." text="Submit Application" />
                      </div>
                    </div>
                  </div>
                )}
              </form>

              <div className="mt-4 text-center">
                <span className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Already an affiliate partner?{' '}
                  <Link to="/affiliate/login" className={`font-black hover:underline transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Sign In
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateRegister;
