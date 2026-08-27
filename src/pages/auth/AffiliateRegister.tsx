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
      const result = await registerPublicAffiliate({
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
      if (result.success) {
        setSubmitSuccess('Application submitted successfully! Awaiting admin approval.');
        setTimeout(() => navigate('/affiliate/login', { replace: true }), 3000);
      } else {
        setSubmitError(result.message || 'Application failed. Please try again or contact support.');
      }
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

  return (
    <div
      className={`min-h-screen w-screen overflow-y-auto font-primary transition-colors duration-300 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative ${
        isLight
          ? 'bg-slate-100 text-slate-950 selection:bg-[#0F8B8D] selection:text-white'
          : 'bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950'
      }`}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className={`absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full blur-3xl transition-opacity duration-1000 ${isLight ? 'bg-emerald-400/15 opacity-80' : 'bg-teal-500/10 opacity-30'}`} />
        <div className={`absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full blur-3xl transition-opacity duration-1000 ${isLight ? 'bg-cyan-500/10 opacity-70' : 'bg-blue-600/10 opacity-30'}`} />
      </div>

      <div className="relative z-10 w-full max-w-5xl my-auto">
        <div className={`rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 border grid grid-cols-1 lg:grid-cols-12 ${isLight ? 'bg-white/80 backdrop-blur-xl border-white/50 shadow-slate-900/10' : 'bg-slate-900/80 border-slate-800 shadow-black/80 backdrop-blur-2xl'}`}>

          {/* Left Panel */}
          <div className={`hidden lg:flex lg:col-span-5 relative p-6 sm:p-8 lg:p-10 flex-col justify-between overflow-hidden ${isLight ? 'bg-gradient-to-br from-emerald-600 via-teal-700 to-[#0B2545] text-white' : 'bg-gradient-to-br from-slate-900 via-[#0B2545]/90 to-slate-950 text-slate-100 lg:border-r border-slate-800'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src="/res copy 2-white.png" alt="Resulta Logo" className="h-8 sm:h-9 w-auto object-contain drop-shadow-md" />
              </div>
            </div>

            <div className="relative z-10 my-10 py-4 space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-300 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-4 inline-block">
                  Partnership Application
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
                  Turn Connections into Commissions.
                </h2>
                <p className="text-sm text-white/80 leading-relaxed font-semibold mt-4 max-w-sm">
                  Join Ghana's fastest-growing digital voucher distribution network. Earn instant commissions on every WASSCE/NOVDEC and BECE voucher you sell.
                </p>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <FiCheckCircle className="text-teal-300 w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-white/90">Zero setup fees or hidden costs</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <FiZap className="text-amber-300 w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-white/90">Instant daily MoMo payouts</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 text-[10px] font-bold text-white/50 border-t border-white/10 pt-4">
              &copy; {new Date().getFullYear()} OWUBEX DIGITAL SERVICES | All rights reserved.
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-1 lg:col-span-7 w-full p-6 sm:p-8 lg:p-12 flex flex-col justify-between relative">
            <div className="flex items-center justify-between gap-2 mb-8">
              <Link to="/" className={`inline-flex items-center gap-1.5 text-xs font-black transition-colors ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}>
                <FiArrowLeft className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <button type="button" onClick={handleToggleTheme} className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all border ${isLight ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm' : 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700 shadow-sm'}`}>
                {isLight ? <FiMoon className="w-4 h-4" /> : <FiSun className="w-4 h-4" />}
              </button>
            </div>

            <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
              <div className="mb-8">
                <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Apply to become an Affiliate
                </h1>
                <p className={`mt-2 text-sm font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Complete the 3-step application to get your unique referral link.
                </p>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-teal-600' : 'text-teal-400'}`}>
                    Step {registerStep} of 3
                  </span>
                  <span className={`text-xs font-bold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    {registerStep === 1 && 'Personal Info'}
                    {registerStep === 2 && 'Payout Details'}
                    {registerStep === 3 && 'Security'}
                  </span>
                </div>
                <div className={`h-1.5 w-full rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
                  <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500 ease-out rounded-full" style={{ width: `${(registerStep / 3) * 100}%` }} />
                </div>
              </div>

              {submitError && (
                <div role="alert" className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                  <FiAlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}
              {submitSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                  <FiCheckCircle className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              <form onSubmit={handleAffiliateRegister} className="space-y-5" noValidate>
                {registerStep === 1 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <InputField id="reg-name" label="Full Name *" type="text" value={registerForm.fullName} icon={<FiUser />} placeholder="Kwame Mensah" isLight={isLight}
                      onChange={(v) => setRegisterForm((p) => ({ ...p, fullName: v }))}
                    />
                    <InputField id="reg-email" label="Email Address *" type="email" value={registerForm.email} icon={<FiMail />} placeholder="kwame@example.com" isLight={isLight}
                      onChange={(v) => setRegisterForm((p) => ({ ...p, email: v }))}
                    />
                    <InputField id="reg-phone" label="Phone Number *" type="tel" value={registerForm.phone} icon={<FiPhone />} placeholder="024XXXXXXX" isLight={isLight}
                      onChange={(v) => setRegisterForm((p) => ({ ...p, phone: v }))}
                    />
                    <InputField id="reg-location" label="Location / Region *" type="text" value={registerForm.location} icon={<FiMapPin />} placeholder="e.g. Accra" isLight={isLight}
                      onChange={(v) => setRegisterForm((p) => ({ ...p, location: v }))}
                    />
                    <InputField id="reg-business" label="Business Name (Optional)" type="text" value={registerForm.businessName} icon={<FiBriefcase />} placeholder="Mensah Digital" isLight={isLight}
                      onChange={(v) => setRegisterForm((p) => ({ ...p, businessName: v }))}
                    />
                    <div className="pt-2">
                      <button type="button" onClick={handleNextStep} className={`w-full py-3 px-6 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 active:translate-y-0 ${isLight ? 'bg-[#0F8B8D] text-white hover:bg-[#0B2545] shadow-[#0F8B8D]/20' : 'bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-teal-500/20'}`}>
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {registerStep === 2 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className={`p-4 rounded-xl border ${isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-900/50 border-slate-800'}`}>
                       <h3 className={`text-sm font-bold flex items-center gap-2 mb-2 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                         <FiCreditCard className="text-emerald-500" /> Payout Destination
                       </h3>
                       <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Where should we send your commissions? Provide valid details.</p>
                    </div>

                    <div>
                      <label htmlFor="paymentChannel" className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Payment Channel *</label>
                      <select id="paymentChannel" name="paymentChannel" value={registerForm.paymentChannel} onChange={handleRegChange} className={`w-full rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none transition-all ${isLight ? 'bg-slate-50 text-slate-950 border border-slate-200 focus:bg-white focus:border-[#0F8B8D] focus:ring-4 focus:ring-[#0F8B8D]/10' : 'bg-slate-900/80 text-white border border-slate-800 focus:bg-slate-900 focus:border-teal-500'}`}>
                        <option value="MOBILE_MONEY">Mobile Money</option>
                        <option value="BANK">Bank Transfer</option>
                      </select>
                    </div>

                    {registerForm.paymentChannel === 'MOBILE_MONEY' && (
                      <div>
                        <label htmlFor="network" className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Network *</label>
                        <select id="network" name="network" value={registerForm.network} onChange={handleRegChange} className={`w-full rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none transition-all ${isLight ? 'bg-slate-50 text-slate-950 border border-slate-200 focus:bg-white focus:border-[#0F8B8D] focus:ring-4 focus:ring-[#0F8B8D]/10' : 'bg-slate-900/80 text-white border border-slate-800 focus:bg-slate-900 focus:border-teal-500'}`}>
                          <option value="">Select network</option>
                          <option value="MTN">MTN</option>
                          <option value="VODAFONE">Telecel</option>
                          <option value="AIRTELTIGO">AT</option>
                        </select>
                      </div>
                    )}

                    {registerForm.paymentChannel === 'BANK' && (
                      <>
                        <InputField id="reg-bankName" label="Bank Name *" type="text" value={registerForm.bankName} icon={<FiActivity />} placeholder="e.g. Ecobank" isLight={isLight}
                          onChange={(v) => setRegisterForm((p) => ({ ...p, bankName: v }))}
                        />
                        <InputField id="reg-bankCode" label="Bank Code (Optional)" type="text" value={registerForm.bankCode} icon={<FiActivity />} placeholder="e.g. 040100" isLight={isLight}
                          onChange={(v) => setRegisterForm((p) => ({ ...p, bankCode: v }))}
                        />
                      </>
                    )}

                    <InputField id="reg-accountNumber" label="Account Number / Mobile Number *" type="text" value={registerForm.accountNumber} icon={<FiActivity />} placeholder="Account Number" isLight={isLight}
                      onChange={(v) => setRegisterForm((p) => ({ ...p, accountNumber: v }))}
                    />
                    <InputField id="reg-accountName" label="Account Name *" type="text" value={registerForm.accountName} icon={<FiUser />} placeholder="Name on account" isLight={isLight}
                      onChange={(v) => setRegisterForm((p) => ({ ...p, accountName: v }))}
                    />

                    <div className="pt-2 flex gap-3">
                      <button type="button" onClick={handlePrevStep} className={`px-6 py-3.5 rounded-xl font-bold text-sm transition-all border ${isLight ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}`}>
                        Back
                      </button>
                      <div className="flex-1">
                        <button type="button" onClick={handleNextStep} className={`w-full py-3 px-6 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 active:translate-y-0 ${isLight ? 'bg-[#0F8B8D] text-white hover:bg-[#0B2545] shadow-[#0F8B8D]/20' : 'bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-teal-500/20'}`}>
                          Continue →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {registerStep === 3 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <PasswordField id="reg-password" label="Create Password *" value={registerForm.password} show={showRegPassword} icon={<FiLock />} placeholder="Min. 6 characters" isLight={isLight}
                      onChange={(v) => setRegisterForm((p) => ({ ...p, password: v }))}
                      onToggle={() => setShowRegPassword((v) => !v)}
                    />
                    <PasswordField id="reg-confirm" label="Confirm Password *" value={registerForm.confirmPassword} show={showConfirmPassword} icon={<FiLock />} placeholder="Re-enter password" isLight={isLight}
                      onChange={(v) => setRegisterForm((p) => ({ ...p, confirmPassword: v }))}
                      onToggle={() => setShowConfirmPassword((v) => !v)}
                    />
                    
                    <InputField id="reg-referral" label="Referral Code (Optional)" type="text" value={registerForm.referralCode} icon={<FiZap />} placeholder="Got a code?" isLight={isLight}
                      onChange={(v) => setRegisterForm((p) => ({ ...p, referralCode: v }))}
                    />

                    <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'}`}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" name="agreeTerms" checked={registerForm.agreeTerms} onChange={handleRegChange} className="mt-1 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer transition-colors" />
                        <span className={`text-xs font-semibold leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          I confirm that the information provided is accurate, and I agree to the{' '}
                          <Link to="/legal/terms" target="_blank" className={`font-black hover:underline ${isLight ? 'text-teal-600' : 'text-teal-400'}`}>Terms &amp; Conditions</Link>
                          {' '}and{' '}
                          <Link to="/legal/privacy" target="_blank" className={`font-black hover:underline ${isLight ? 'text-teal-600' : 'text-teal-400'}`}>Privacy Policy</Link>.
                        </span>
                      </label>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button type="button" onClick={handlePrevStep} disabled={isLoading} className={`px-6 py-3.5 rounded-xl font-bold text-sm transition-all border disabled:opacity-50 ${isLight ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}`}>
                        Back
                      </button>
                      <div className="flex-1">
                        <SubmitButton isLoading={isLoading} isLight={isLight} loadingText="Submitting..." text="Submit Application" />
                      </div>
                    </div>
                  </div>
                )}
              </form>

              <div className="mt-8 text-center">
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
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
