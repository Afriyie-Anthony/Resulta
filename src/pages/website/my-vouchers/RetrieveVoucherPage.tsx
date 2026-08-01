import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiCopy, FiCheck, FiEye, FiEyeOff, FiDownload, FiLock, FiHelpCircle, FiShoppingCart } from 'react-icons/fi';
import WebsiteNavbar from '../../../components/website/layout/WebsiteNavbar';
import WebsiteFooter from '../../../components/website/layout/WebsiteFooter';
import MobileBottomNav from '../../../components/website/layout/MobileBottomNav';
import BuyBottomSheet from '../../../components/website/layout/BuyBottomSheet';
import MoreBottomSheet from '../../../components/website/layout/MoreBottomSheet';

type PageState = 'idle' | 'loading' | 'success' | 'notFound' | 'error' | 'multiple';

interface Voucher {
  id: string;
  type: string;
  serialNumber: string;
  pin: string;
  purchasedAt: string;
  status: string;
}

const RetrieveVoucherPage: React.FC = () => {
  const [state, setState] = useState<PageState>('idle');
  const [phone, setPhone] = useState('');
  const [reference, setReference] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [referenceError, setReferenceError] = useState('');
  const [isPinVisible, setIsPinVisible] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [cardType, setCardType] = useState<'wassce' | 'bece'>('wassce');
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCardType((prev) => (prev === 'wassce' ? 'bece' : 'wassce'));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const validatePhone = (value: string): boolean => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) return false;
    if (cleaned.startsWith('0') && cleaned.length === 10) return true;
    if (cleaned.startsWith('233') && cleaned.length === 12) return true;
    return false;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    if (value && !validatePhone(value)) {
      setPhoneError('Please enter a valid Ghanaian phone number.');
    } else {
      setPhoneError('');
    }
  };

  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReference(value);
    if (!value.trim()) {
      setReferenceError('Please enter your transaction reference.');
    } else {
      setReferenceError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!validatePhone(phone)) {
      setPhoneError('Please enter a valid Ghanaian phone number.');
      hasError = true;
    }
    if (!reference.trim()) {
      setReferenceError('Please enter your transaction reference.');
      hasError = true;
    }

    if (hasError) return;

    setState('loading');

    setTimeout(() => {
      const ref = reference.trim().toUpperCase();
      if (ref === 'RES-MULTI-001') {
        setVouchers([
          {
            id: '1',
            type: 'WASSCE Result Checker',
            serialNumber: 'RES-WAS-2026-4829',
            pin: '8849-2217-6634',
            purchasedAt: '01 Aug 2026',
            status: 'Unused',
          },
          {
            id: '2',
            type: 'BECE Result Checker',
            serialNumber: 'RES-BEC-2026-1102',
            pin: '3341-8872-9910',
            purchasedAt: '28 Jul 2026',
            status: 'Used',
          },
        ]);
        setState('multiple');
      } else if (ref === 'RES-NOTFOUND') {
        setState('notFound');
      } else if (ref === 'RES-ERROR') {
        setState('error');
      } else {
        setSelectedVoucher({
          id: '1',
          type: 'WASSCE Result Checker',
          serialNumber: 'RES-WAS-2026-4829',
          pin: '8849-2217-6634',
          purchasedAt: '01 Aug 2026',
          status: 'Unused',
        });
        setState('success');
      }
    }, 1500);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleReset = () => {
    setState('idle');
    setPhone('');
    setReference('');
    setPhoneError('');
    setReferenceError('');
    setIsPinVisible(false);
    setSelectedVoucher(null);
    setVouchers([]);
  };

  const maskPin = (pin: string): string => {
    if (isPinVisible) return pin;
    const parts = pin.split('-');
    return parts.map(() => '••••').join('-');
  };

  const renderLeftVisual = () => {
    const isWassce = cardType === 'wassce';
    const cardGradient = isWassce
      ? 'from-accent via-accent/95 to-accent/80'
      : 'from-secondary via-secondary/95 to-primary/90';
    const cardTextColor = isWassce ? 'text-primary' : 'text-white';
    const cardSubtextColor = isWassce ? 'text-primary/80' : 'text-white/80';
    const badgeBg = isWassce ? 'bg-white/30' : 'bg-white/20';
    const badgeText = isWassce ? 'text-primary' : 'text-white';
    const dotColor = isWassce ? 'bg-primary' : 'bg-white';
    const dotText = isWassce ? 'text-primary' : 'text-white';
    const shadowColor = isWassce ? 'bg-accent/40' : 'bg-secondary/40';
    const serialPrefix = isWassce ? 'RES-WAS' : 'RES-BEC';
    const voucherLabel = isWassce ? 'WASSCE' : 'BECE';

    return (
      <div className="relative flex items-center justify-center h-full min-h-[400px] lg:min-h-[600px]">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full" />
        </div>

        {/* 3D Voucher Card */}
        <div className="relative z-10 w-full max-w-sm lg:max-w-md">
          {/* Main voucher card */}
          <div
            key={cardType}
            className={`relative bg-gradient-to-br ${cardGradient} rounded-3xl p-8 shadow-2xl border border-white/20 animate-fade-in`}
            style={{ transform: 'perspective(1000px) rotateX(2deg) rotateY(-4deg)' }}
          >
            {/* Card shine */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-8 h-8 rounded-lg ${badgeBg} flex items-center justify-center font-black text-sm ${badgeText}`}>
                  R
                </div>
                <span className={`font-extrabold tracking-wide ${cardTextColor}`}>RESULTA</span>
              </div>

              <div className="space-y-1 mb-6">
                <p className={`text-xs uppercase tracking-widest ${isWassce ? 'text-primary/70' : 'text-white/70'} font-semibold`}>Voucher Type</p>
                <p className={`text-3xl font-black ${cardTextColor}`}>{voucherLabel}</p>
                <p className={`text-xl font-bold ${cardSubtextColor} -mt-1`}>VOUCHER</p>
              </div>

              {/* Decorative barcode */}
              <div className="flex items-end gap-0.5 h-8 mb-6 opacity-30">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={`${isWassce ? 'bg-primary' : 'bg-white'} rounded-sm`}
                    style={{
                      width: '2px',
                      height: `${Math.random() > 0.5 ? '100%' : '60%'}`,
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 ${badgeBg} px-3 py-2 rounded-lg`}>
                  <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                  <span className={`text-xs font-semibold ${dotText}`}>Secure Voucher</span>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] ${isWassce ? 'text-primary/60' : 'text-white/60'} font-semibold uppercase`}>Serial</p>
                  <p className={`text-xs font-mono font-bold ${cardTextColor} tracking-wider`}>{serialPrefix}-4829</p>
              </div>
            </div>

            {/* Card shadow accent */}
            <div className={`absolute -bottom-2 -right-2 w-32 h-32 ${shadowColor} rounded-full blur-2xl pointer-events-none`} />
          </div>

        {/* Floating decorative elements */}
        <div className="absolute -top-4 -right-4 w-20 h-20 border-2 border-accent/20 rounded-full animate-pulse" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 border-2 border-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Card type indicator */}
        <div className="relative z-20 mt-6 text-center">
          <span key={cardType} className="inline-block text-xs font-bold uppercase tracking-widest text-white/80 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 animate-fade-in">
            {cardType === 'wassce' ? 'WASSCE Voucher' : 'BECE Voucher'}
          </span>
        </div>
        </div>
      </div>
      </div>
    );
  };

  const renderSuccessState = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-warm rounded-2xl border border-border p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-text-primary">Voucher Found</h2>
            </div>
            <p className="text-xs text-text-secondary">Order: {selectedVoucher?.id || reference}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {selectedVoucher?.status || 'Ready'}
          </span>
        </div>

        {/* Voucher Card */}
        <div className="bg-surface rounded-xl p-5 border border-border space-y-4">
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Voucher Type</p>
            <p className="text-sm font-bold text-text-primary">{selectedVoucher?.type}</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Serial Number</p>
              <p className="text-sm font-bold text-text-primary font-mono">{selectedVoucher?.serialNumber}</p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(selectedVoucher?.serialNumber || '', 'serial')}
              className="p-2 rounded-lg hover:bg-slate-100 text-text-secondary hover:text-text-primary transition-colors"
              title="Copy serial number"
            >
              {copiedField === 'serial' ? <FiCheck className="w-4 h-4 text-emerald-500" /> : <FiCopy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Voucher PIN</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-text-primary font-mono tracking-widest">{maskPin(selectedVoucher?.pin || '')}</p>
                <button
                  type="button"
                  onClick={() => setIsPinVisible(!isPinVisible)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-text-secondary hover:text-text-primary transition-colors"
                  title={isPinVisible ? 'Hide PIN' : 'Show PIN'}
                >
                  {isPinVisible ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(selectedVoucher?.pin || '', 'pin')}
              className="p-2 rounded-lg hover:bg-slate-100 text-text-secondary hover:text-text-primary transition-colors"
              title="Copy PIN"
            >
              {copiedField === 'pin' ? <FiCheck className="w-4 h-4 text-emerald-500" /> : <FiCopy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <p className="text-xs text-text-secondary">Purchased</p>
              <p className="text-sm font-semibold text-text-primary">{selectedVoucher?.purchasedAt}</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-secondary text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-secondary/90 transition-all"
            >
              <FiDownload className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-accent/5 border border-accent/20">
          <p className="text-xs text-text-secondary leading-relaxed">
            Keep your voucher credentials secure. Do not share them publicly. If you need help, contact our support team.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl text-sm border border-border hover:bg-soft-ivory transition-all"
        >
          Retrieve Another
        </button>
        <Link
          to="/help/contact"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-secondary text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-secondary/90 transition-all"
        >
          <FiHelpCircle className="w-4 h-4" />
          Contact Support
        </Link>
      </div>
    </div>
  );

  const renderMultipleState = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-warm rounded-2xl border border-border p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <FiShoppingCart className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-lg font-bold text-text-primary">Your Vouchers</h2>
        </div>
        <p className="text-sm text-text-secondary mb-6">
          We found {vouchers.length} vouchers associated with your details.
        </p>

        <div className="space-y-3">
          {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className={`bg-surface rounded-xl p-5 border transition-all cursor-pointer hover:border-accent/40 ${
                selectedVoucher?.id === voucher.id ? 'border-accent ring-2 ring-accent/20' : 'border-border'
              }`}
              onClick={() => setSelectedVoucher(voucher)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-text-primary">{voucher.type}</p>
                  <p className="text-xs text-text-secondary mt-1">Purchased: {voucher.purchasedAt}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  voucher.status === 'Unused'
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${voucher.status === 'Unused' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {voucher.status}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVoucher(voucher);
                  }}
                  className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-primary/90 transition-all"
                >
                  View Voucher
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedVoucher && renderSuccessState()}

      <button
        type="button"
        onClick={handleReset}
        className="w-full inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl text-sm border border-border hover:bg-soft-ivory transition-all"
      >
        Retrieve Another Voucher
      </button>
    </div>
  );

  const renderErrorState = (title: string, message: string) => (
    <div className="bg-warm rounded-2xl border border-border p-8 text-center animate-fade-in">
      <div className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
        <FiSearch className="w-6 h-6 text-rose-500" />
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm mx-auto mb-6">{message}</p>
      <button
        type="button"
        onClick={handleReset}
        className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-primary/90 transition-all"
      >
        Try Again
      </button>
      <div className="mt-4">
        <Link to="/help/contact" className="text-sm text-secondary hover:underline font-medium">
          Need help? Contact Support
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <WebsiteNavbar />

      <main className="flex-1 pb-20 md:pb-0">
        <section className="min-h-[calc(100vh-64px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Left Side - Visual */}
            <div className="hidden lg:block bg-gradient-to-br from-primary via-primary/95 to-secondary/80 relative overflow-hidden">
              {renderLeftVisual()}

              {/* Bottom decorative wave */}
              <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-24">
                  <path
                    d="M0,120 C300,90 600,70 900,80 C1000,84 1100,60 1200,40 L1200,120 L0,120 Z"
                    fill="#F8F7F2"
                    fillOpacity="0.1"
                  />
                </svg>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12 lg:py-0">
              <div className="w-full max-w-md">
                {/* Mobile visual (shown only on mobile) */}
                <div className="lg:hidden mb-8 flex justify-center">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl" />
                    <div key={cardType} className="relative z-10 w-full h-full flex items-center justify-center animate-fade-in">
                      <div className={`bg-gradient-to-br ${cardType === 'wassce' ? 'from-accent to-accent/80' : 'from-secondary to-primary/90'} rounded-2xl p-4 shadow-xl transform -rotate-3`}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className={`w-5 h-5 rounded ${cardType === 'wassce' ? 'bg-white/30' : 'bg-white/20'} flex items-center justify-center font-black ${cardType === 'wassce' ? 'text-primary' : 'text-white'} text-[10px]`}>
                            R
                          </div>
                          <span className={`font-extrabold ${cardType === 'wassce' ? 'text-primary' : 'text-white'} text-xs tracking-wide`}>RESULTA</span>
                        </div>
                        <p className={`text-lg font-black ${cardType === 'wassce' ? 'text-primary' : 'text-white'} leading-none`}>{cardType === 'wassce' ? 'WASSCE' : 'BECE'}</p>
                        <p className={`text-sm font-bold ${cardType === 'wassce' ? 'text-primary/80' : 'text-white/80'} -mt-0.5`}>VOUCHER</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Header */}
                <div className="mb-8">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent mb-3">
                    <FiSearch className="w-4 h-4" />
                    My Vouchers
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                    Retrieve Voucher
                  </h1>
                  <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed">
                    Already purchased a voucher? Enter your details below to retrieve it.
                  </p>
                </div>

                {/* States */}
                {(state === 'idle' || state === 'loading') && (
                  <form onSubmit={handleSubmit} className="bg-warm rounded-2xl border border-border p-6 sm:p-8 space-y-5">
                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={handlePhoneChange}
                        required
                        className={`w-full rounded-xl bg-slate-900/90 border px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all ${
                          phoneError ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-800 focus:border-secondary'
                        }`}
                        placeholder="+233 XX XXX XXXX"
                      />
                      {phoneError && (
                        <p className="mt-1.5 text-xs text-rose-400 font-medium">{phoneError}</p>
                      )}
                      {!phoneError && phone && validatePhone(phone) && (
                        <p className="mt-1.5 text-xs text-emerald-400 font-medium">Valid Ghanaian number</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="reference" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Transaction Reference
                      </label>
                      <input
                        type="text"
                        id="reference"
                        value={reference}
                        onChange={handleReferenceChange}
                        required
                        className={`w-full rounded-xl bg-slate-900/90 border px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all uppercase ${
                          referenceError ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-800 focus:border-secondary'
                        }`}
                        placeholder="e.g. RES-XXXXXXXX"
                      />
                      {referenceError && (
                        <p className="mt-1.5 text-xs text-rose-400 font-medium">{referenceError}</p>
                      )}
                      <p className="mt-1.5 text-[10px] text-slate-500">
                        Enter the transaction reference from your purchase confirmation or SMS.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={state === 'loading'}
                      className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      <FiSearch className="w-5 h-5" />
                      {state === 'loading' ? 'Retrieving Voucher...' : 'Retrieve Voucher'}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-text-secondary">
                      <FiLock className="w-3.5 h-3.5" />
                      <span>Your information is secure and protected.</span>
                    </div>
                  </form>
                )}

                {state === 'loading' && (
                  <div className="bg-warm rounded-2xl border border-border p-8 text-center">
                    <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin mx-auto mb-4" />
                    <h3 className="text-base font-bold text-text-primary mb-1">Retrieving your voucher...</h3>
                    <p className="text-xs text-text-secondary">Please wait a moment.</p>
                  </div>
                )}

                {state === 'success' && selectedVoucher && renderSuccessState()}

                {state === 'multiple' && renderMultipleState()}

                {state === 'notFound' && renderErrorState(
                  'Voucher Not Found',
                  "We couldn't find a voucher matching the details you entered. Please check your phone number and transaction reference and try again."
                )}

                {state === 'error' && renderErrorState(
                  'Something Went Wrong',
                  "We couldn't retrieve your voucher right now. Please try again in a moment."
                )}

                {/* Help Link */}
                {state === 'idle' && (
                  <p className="mt-6 text-center text-sm text-text-secondary">
                    Can't find your voucher?{' '}
                    <Link to="/help/contact" className="text-secondary font-semibold hover:underline">
                      Get Help
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <WebsiteFooter />
      <MobileBottomNav onBuyClick={() => setIsBuyOpen(true)} onMoreClick={() => setIsMoreOpen(true)} />
      <BuyBottomSheet isOpen={isBuyOpen} onClose={() => setIsBuyOpen(false)} />
      <MoreBottomSheet isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </div>
  );
};

export default RetrieveVoucherPage;
