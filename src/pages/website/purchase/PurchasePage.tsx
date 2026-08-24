import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiShoppingCart, FiUsers, FiLoader } from 'react-icons/fi';
import WebsiteNavbar from '../../../components/website/layout/WebsiteNavbar';
import WebsiteFooter from '../../../components/website/layout/WebsiteFooter';
import MobileBottomNav from '../../../components/website/layout/MobileBottomNav';
import BuyBottomSheet from '../../../components/website/layout/BuyBottomSheet';
import MoreBottomSheet from '../../../components/website/layout/MoreBottomSheet';
import { useVoucherConfig, useInitiatePurchase } from '../../../hooks/usePurchase';

const voucherConfigData = {
  wassce: {
    title: 'WASSCE / NOVDEC',
    subtitle: 'Senior High School Results',
    badge: 'WASSCE 2026',
    apiType: 'WASSCE_NOVDEC' as const,
  },
  bece: {
    title: 'BECE',
    subtitle: 'Basic Education Results',
    badge: 'BECE 2026',
    apiType: 'BECE' as const,
  },
};

const PurchasePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const voucherType = searchParams.get('type') || 'bece';
  const configInfo = voucherConfigData[voucherType as keyof typeof voucherConfigData];
  
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [quantity, setQuantity] = useState(mode === 'single' ? 1 : 10);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Data Hooks
  const { data: config, isLoading: isConfigLoading } = useVoucherConfig();
  const { mutate: initiateOrder, isPending: isSubmitting } = useInitiatePurchase();

  if (!configInfo) {
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

  // Calculate pricing based on dynamic tiers
  let pricePerVoucher = 0;
  if (config) {
    const matchingTier = config.priceTiers.find(
      (tier) => 
        tier.voucherType === configInfo.apiType && 
        quantity >= tier.minQuantity && 
        quantity <= tier.maxQuantity
    );
    // Fallback to highest tier if not found
    pricePerVoucher = matchingTier?.unitPrice || 25; 
  }

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
    
    initiateOrder(
      {
        voucherType: configInfo.apiType,
        quantity,
        fullName,
        phoneNumber: phone,
        email: email || '',
      },
      {
        onSuccess: (data) => {
          // Redirect to Hubtel Checkout URL
          window.location.href = data.checkoutUrl;
        },
        onError: () => {
          alert('Failed to initiate order. Please try again.');
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Helmet>
        <title>Buy {configInfo.title} Voucher - Resulta</title>
        <meta name="description" content={`Purchase your ${configInfo.title} result checking voucher instantly. Secure payment, instant delivery.`} />
      </Helmet>
      <WebsiteNavbar />

      <main className="flex-1 pb-20 md:pb-0">
        <section className={`${voucherType === 'wassce' ? 'bg-primary' : 'bg-secondary'} py-16 lg:py-20`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {configInfo.title} Result Checker
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
                    className="w-full rounded-xl bg-white border border-border px-4 py-3 text-sm text-text-primary placeholder-text-secondary/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
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
                    className={`w-full rounded-xl bg-white border px-4 py-3 text-sm text-text-primary placeholder-text-secondary/60 focus:outline-none focus:ring-4 transition-all shadow-sm ${
                      phoneError ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10' : 'border-border focus:border-primary focus:ring-primary/10'
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
                
                {mode === 'bulk' && (
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-2">
                      Email Address
                      <span className="text-rose-400 text-[10px]">(Required for Bulk)</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl bg-white border border-border px-4 py-3 text-sm text-text-primary placeholder-text-secondary/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                      placeholder="Enter your email address"
                    />
                  </div>
                )}
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
                      {isConfigLoading ? (
                        <FiLoader className="w-6 h-6 animate-spin text-text-secondary" />
                      ) : (
                        `GH₵ ${pricePerVoucher.toFixed(2)}`
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-secondary">Total</p>
                    <p className="text-2xl font-black text-secondary">
                      {isConfigLoading ? (
                        <FiLoader className="w-6 h-6 animate-spin text-secondary" />
                      ) : (
                        `GH₵ ${total.toFixed(2)}`
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting || isConfigLoading}
                  className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <FiLoader className="w-5 h-5 animate-spin" />
                  ) : (
                    <FiShoppingCart className="w-5 h-5" />
                  )}
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
