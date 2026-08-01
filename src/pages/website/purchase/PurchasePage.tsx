import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiShoppingCart, FiUsers } from 'react-icons/fi';
import WebsiteNavbar from '../../../components/website/layout/WebsiteNavbar';
import WebsiteFooter from '../../../components/website/layout/WebsiteFooter';
import MobileBottomNav from '../../../components/website/layout/MobileBottomNav';
import BuyBottomSheet from '../../../components/website/layout/BuyBottomSheet';
import MoreBottomSheet from '../../../components/website/layout/MoreBottomSheet';
import { formatGhanaPhone } from '../../../utils/formatters';

const voucherConfig = {
  wassce: {
    title: 'WASSCE / NOVDEC',
    subtitle: 'Senior High School Results',
    badge: 'WASSCE 2026',
  },
  bece: {
    title: 'BECE',
    subtitle: 'Basic Education Results',
    badge: 'BECE 2026',
  },
};

const PurchasePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const voucherType = searchParams.get('type') || 'bece';
  const config = voucherConfig[voucherType as keyof typeof voucherConfig];
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [quantity, setQuantity] = useState(mode === 'single' ? 1 : 10);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary">Voucher Type Not Found</h2>
          <p className="mt-2 text-text-secondary">Please select a valid voucher type.</p>
          <a href="/" className="inline-block mt-4 text-secondary font-semibold hover:underline">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const pricePerVoucher =
    mode === 'single'
      ? 20
      : quantity >= 30
        ? 16
        : 17;
  const total = pricePerVoucher * quantity;

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
      setPhoneError('Enter a valid Ghanaian number (e.g. 024 XXX XXX)');
    } else {
      setPhoneError('');
    }
  };

  const handleModeChange = (newMode: 'single' | 'bulk') => {
    setMode(newMode);
    setQuantity(newMode === 'single' ? 1 : 10);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (mode === 'single' && next >= 1 && next <= 9) return next;
      if (mode === 'bulk' && next >= 10) return next;
      return prev;
    });
  };

  const handleProceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    if (!validatePhone(phone)) {
      setPhoneError('Enter a valid Ghanaian number (e.g. 024 XXX XXX)');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      alert('Hubtel payment integration will be implemented here.');
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <WebsiteNavbar />

      <main className="flex-1 pb-20 md:pb-0">
        <section className={`${voucherType === 'wassce' ? 'bg-primary' : 'bg-secondary'} py-16 lg:py-20`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {config.title} Result Checker
            </h1>
            <p className="mt-4 text-sm sm:text-base text-white/60 max-w-xl mx-auto">
              Choose Single or Bulk purchase and get your voucher instantly.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleProceedToCheckout} className="space-y-8">
              <div>
                <div className="flex justify-center">
                  <div className="bg-warm rounded-2xl border border-border p-1.5 inline-flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => navigate('/purchase?type=bece')}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                        voucherType === 'bece'
                          ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      BECE
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/purchase?type=wassce')}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                        voucherType === 'wassce'
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      WASSCE / NOVDEC
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-text-secondary text-center">
                  Select the voucher type you want to purchase.
                </p>
              </div>

              <div>
                <div className="flex justify-center">
                  <div className="bg-warm rounded-2xl border border-border p-1.5 inline-flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleModeChange('single')}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                        mode === 'single'
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <FiShoppingCart className="w-4 h-4" />
                      Single
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModeChange('bulk')}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                        mode === 'bulk'
                          ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <FiUsers className="w-4 h-4" />
                      Bulk
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-text-secondary text-center">
                  {mode === 'single'
                    ? 'Buy 1 to 9 vouchers at GH₵ 20 each.'
                    : 'Buy 10+ vouchers. GH₵ 17 each (10-29), GH₵ 16 each (30+).'}
                </p>
              </div>

              <div className="bg-warm rounded-2xl border border-border p-6 sm:p-8 space-y-6">
                <h2 className="text-lg font-bold text-text-primary">Your Details</h2>

                <div>
                  <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-900/90 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Contact (Phone Number)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                    className={`w-full rounded-xl bg-slate-900/90 border px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all ${
                      phoneError ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-800 focus:border-secondary'
                    }`}
                    placeholder="024 XXX XXX"
                  />
                  {phoneError && (
                    <p className="mt-1.5 text-xs text-rose-400 font-medium">{phoneError}</p>
                  )}
                  {!phoneError && phone && validatePhone(phone) && (
                    <p className="mt-1.5 text-xs text-emerald-400 font-medium">Valid Ghanaian number</p>
                  )}
                </div>
              </div>

              <div className="bg-warm rounded-2xl border border-border p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-text-primary">Quantity</h2>
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {mode === 'single' ? 'Max 9' : 'Min 10'}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-6">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={
                      mode === 'single'
                        ? quantity <= 1
                        : quantity <= 10
                    }
                    className="w-12 h-12 rounded-xl border border-border bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus className="w-5 h-5" />
                  </button>
                  <span className="text-4xl font-black text-text-primary w-16 text-center tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={mode === 'single' ? quantity >= 9 : false}
                    className="w-12 h-12 rounded-xl border border-border bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    aria-label="Increase quantity"
                  >
                    <FiPlus className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-text-secondary">Price per voucher</p>
                    <p className="text-2xl font-black text-text-primary">
                      GH₵ {pricePerVoucher.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-secondary">Total</p>
                    <p className="text-2xl font-black text-secondary">
                      GH₵ {total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  {isSubmitting ? 'Processing...' : 'Proceed to Checkout'}
                </button>
                <p className="mt-3 text-xs text-text-secondary">
                  Secure checkout powered by Hubtel
                </p>
              </div>
            </form>
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

export default PurchasePage;
