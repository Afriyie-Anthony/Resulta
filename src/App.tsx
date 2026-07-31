import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './components/ui/Toast';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { AffiliateLayout } from './components/layout/AffiliateLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Badge } from './components/ui/Badge';
import { Input } from './components/ui/Input';
import { Modal } from './components/ui/Modal';
import { formatCedi } from './utils/formatters';
import type { LayoutMode } from './types/ui';
import {
  FiCheckCircle,
  FiZap,
  FiShield,
  FiSmartphone,
  FiTrendingUp,
  FiCopy,
  FiBox,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const AppContent: React.FC = () => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('customer');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<'WASSCE' | 'BECE' | null>(null);
  const [phone, setPhone] = useState('');
  const [momoNetwork, setMomoNetwork] = useState('MTN');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { addToast } = useToast();

  const slides = [
    {
      badge: 'Official WAEC Result Checker Distributor',
      badgeVariant: 'primary' as const,
      title: 'Get Your WASSCE & BECE Result Checker Instantly',
      description: 'Buy genuine WAEC result checking vouchers 24/7 online or via USSD (*928*44#). Instant PIN & Serial delivery straight to your screen and SMS.',
      primaryBtnText: 'Buy WASSCE Checker (GH₵ 35.00)',
      secondaryBtnText: 'Buy BECE Checker (GH₵ 30.00)',
      primaryProduct: 'WASSCE' as const,
      secondaryProduct: 'BECE' as const,
      imageIcon: <FiZap className="w-12 h-12 text-teal-600" />,
      bgGradient: 'from-teal-500/10 via-emerald-500/5 to-transparent',
    },
    {
      badge: 'Offline Cellular USSD Technology',
      badgeVariant: 'warning' as const,
      title: 'No Internet? Dial *928*44# On Any Phone Network',
      description: 'Zero data needed. Dial *928*44# on MTN, Telecel, or AT to buy WASSCE and BECE result checkers directly with Mobile Money in under 10 seconds.',
      primaryBtnText: 'Try Online Checkout Now',
      secondaryBtnText: 'View USSD Instructions',
      primaryProduct: 'WASSCE' as const,
      secondaryProduct: 'BECE' as const,
      imageIcon: <FiSmartphone className="w-12 h-12 text-amber-600" />,
      bgGradient: 'from-amber-500/10 via-teal-500/5 to-transparent',
    },
    {
      badge: 'Earn 8% Commission Per Sale',
      badgeVariant: 'success' as const,
      title: 'Become an Authorized Resulta Affiliate Agent',
      description: 'Share your custom referral link with students, schools, and friends. Earn instant commissions paid straight to your Mobile Money wallet.',
      primaryBtnText: 'Join Affiliate Program',
      secondaryBtnText: 'Calculate Earnings',
      primaryProduct: 'WASSCE' as const,
      secondaryProduct: 'BECE' as const,
      imageIcon: <FiTrendingUp className="w-12 h-12 text-emerald-600" />,
      bgGradient: 'from-emerald-500/10 via-sky-500/5 to-transparent',
    },
  ];

  // Hero Slider Auto-Play Effect
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handleBuyClick = (product: 'WASSCE' | 'BECE') => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckoutOpen(false);
    addToast({
      title: 'Payment Prompt Sent',
      message: `A Mobile Money prompt has been sent to ${phone} (${momoNetwork}). Approve to receive your voucher instantly.`,
      type: 'success',
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top Layout Switcher Control */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-4 sticky top-0 z-50 flex items-center justify-between text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold uppercase tracking-wider">Preview Mode:</span>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setLayoutMode('customer')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                layoutMode === 'customer'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Customer Website
            </button>
            <button
              onClick={() => setLayoutMode('affiliate')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                layoutMode === 'affiliate'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Affiliate Portal
            </button>
            <button
              onClick={() => setLayoutMode('admin')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                layoutMode === 'admin'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin Control Center
            </button>
          </div>
        </div>

        <Badge variant="primary" pulse>
          Light Theme Commercial Architecture
        </Badge>
      </div>

      {/* Render Selected Layout Mode */}
      {layoutMode === 'customer' && (
        <CustomerLayout>
          {/* Hero Slider Section */}
          <section
            className="relative py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative rounded-3xl border border-slate-200/80 bg-white shadow-xl overflow-hidden">
              {/* Slider Track */}
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide, idx) => (
                  <div
                    key={idx}
                    className={`w-full shrink-0 p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br ${slide.bgGradient}`}
                  >
                    <div className="max-w-2xl text-center md:text-left">
                      <Badge variant={slide.badgeVariant} pulse className="mb-4">
                        {slide.badge}
                      </Badge>

                      <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
                        {slide.title}
                      </h1>

                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
                        {slide.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <Button
                          variant="primary"
                          size="lg"
                          leftIcon={<FiZap className="w-5 h-5" />}
                          onClick={() => handleBuyClick(slide.primaryProduct)}
                        >
                          {slide.primaryBtnText}
                        </Button>

                        <Button
                          variant="outline"
                          size="lg"
                          leftIcon={<FiSmartphone className="w-5 h-5" />}
                          onClick={() => handleBuyClick(slide.secondaryProduct)}
                          className="border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                          {slide.secondaryBtnText}
                        </Button>
                      </div>
                    </div>

                    {/* Decorative Visual Card */}
                    <div className="shrink-0 flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-lg w-full md:w-72 text-center">
                      <div className="w-20 h-20 rounded-2xl bg-teal-50 flex items-center justify-center mb-4 border border-teal-100 shadow-inner">
                        {slide.imageIcon}
                      </div>
                      <img src="/assets/logo.png" alt="Resulta" className="h-7 w-auto mb-2 object-contain" />
                      <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                        24/7 Automated Dispatch
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider Controls (Prev / Next & Dots) */}
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-6 pointer-events-none">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                  className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-teal-600 hover:text-white transition-all"
                  aria-label="Previous Slide"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-2 pointer-events-auto">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2.5 rounded-full transition-all ${
                        currentSlide === i ? 'w-8 bg-teal-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-teal-600 hover:text-white transition-all"
                  aria-label="Next Slide"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <Card glass hoverable>
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl mb-4 border border-teal-200">
                  <FiZap />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Instant Fulfillment</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your Serial Number & PIN display immediately on screen and arrive via SMS in less than 5 seconds.
                </p>
              </Card>

              <Card glass hoverable>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-4 border border-emerald-200">
                  <FiShield />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">100% Genuine WAEC Vouchers</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verified stock directly sourced for authentic WASSCE School & Private candidate result portals.
                </p>
              </Card>

              <Card glass hoverable>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl mb-4 border border-amber-200">
                  <FiSmartphone />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">USSD Offline Support</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No internet? Dial *928*44# on any Ghanaian phone network to buy instantly via Mobile Money.
                </p>
              </Card>
            </div>
          </section>

          {/* Catalog Section */}
          <section id="vouchers" className="py-16 bg-white border-t border-slate-200 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <Badge variant="primary" className="mb-2">Official Portal Rates</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Select Result Checker Voucher</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2">Available 24/7 with zero service markup fees</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* WASSCE Product Card */}
                <Card glass hoverable className="border-teal-300 bg-gradient-to-b from-teal-50/50 to-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge variant="primary" className="mb-2">WASSCE 2026 Ready</Badge>
                      <h3 className="text-2xl font-bold text-slate-900">WASSCE Result Checker</h3>
                      <p className="text-xs text-slate-500 mt-1">School & Private Candidates</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-teal-700">{formatCedi(35.0)}</span>
                      <span className="block text-[10px] font-semibold text-slate-500">per voucher</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-700 mb-8 border-y border-slate-100 py-4">
                    <li className="flex items-center gap-2 font-medium"><FiCheckCircle className="text-teal-600" /> Checks WASSCE School & Nov/Dec Results</li>
                    <li className="flex items-center gap-2 font-medium"><FiCheckCircle className="text-teal-600" /> Up to 5 uses per voucher pin</li>
                    <li className="flex items-center gap-2 font-medium"><FiCheckCircle className="text-teal-600" /> Instant SMS & On-Screen PIN delivery</li>
                  </ul>
                  <Button variant="primary" fullWidth size="lg" onClick={() => handleBuyClick('WASSCE')}>
                    Buy WASSCE Voucher Now
                  </Button>
                </Card>

                {/* BECE Product Card */}
                <Card glass hoverable className="border-emerald-300 bg-gradient-to-b from-emerald-50/50 to-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge variant="success" className="mb-2">BECE 2026 Ready</Badge>
                      <h3 className="text-2xl font-bold text-slate-900">BECE Result Checker</h3>
                      <p className="text-xs text-slate-500 mt-1">Junior High School Candidates</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-emerald-700">{formatCedi(30.0)}</span>
                      <span className="block text-[10px] font-semibold text-slate-500">per voucher</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-700 mb-8 border-y border-slate-100 py-4">
                    <li className="flex items-center gap-2 font-medium"><FiCheckCircle className="text-emerald-600" /> Checks BECE School & Private Results</li>
                    <li className="flex items-center gap-2 font-medium"><FiCheckCircle className="text-emerald-600" /> Up to 5 uses per voucher pin</li>
                    <li className="flex items-center gap-2 font-medium"><FiCheckCircle className="text-emerald-600" /> Instant SMS & On-Screen PIN delivery</li>
                  </ul>
                  <Button variant="primary" fullWidth size="lg" onClick={() => handleBuyClick('BECE')}>
                    Buy BECE Voucher Now
                  </Button>
                </Card>
              </div>
            </div>
          </section>
        </CustomerLayout>
      )}

      {/* Affiliate Layout View */}
      {layoutMode === 'affiliate' && (
        <AffiliateLayout>
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card glass>
                <p className="text-xs text-slate-500 font-semibold uppercase">Total Sales Referred</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">148</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <FiTrendingUp /> +18% from last week
                </p>
              </Card>

              <Card glass>
                <p className="text-xs text-slate-500 font-semibold uppercase">Total Earnings</p>
                <p className="text-3xl font-bold text-teal-700 mt-1">{formatCedi(1450.0)}</p>
                <p className="text-[10px] text-slate-500 mt-1">GH₵ 10.00 commission per sale</p>
              </Card>

              <Card glass>
                <p className="text-xs text-slate-500 font-semibold uppercase">Withdrawn to MoMo</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{formatCedi(1130.0)}</p>
                <p className="text-[10px] text-teal-700 mt-1 font-medium">Paid directly to 024XXXX67</p>
              </Card>

              <Card glass>
                <p className="text-xs text-slate-500 font-semibold uppercase">Available for Payout</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{formatCedi(320.0)}</p>
                <Button variant="primary" size="sm" className="mt-2 w-full">
                  Withdraw to MoMo
                </Button>
              </Card>
            </div>

            {/* Link Sharing Card */}
            <Card glass header={<h3 className="font-bold text-slate-900">Your Unique Referral Link</h3>}>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <Input
                  readOnly
                  value="https://resulta.com.gh/?ref=REF-GH-8823"
                  className="font-mono text-xs"
                />
                <Button variant="primary" leftIcon={<FiCopy />}>
                  Copy Link
                </Button>
              </div>
            </Card>
          </div>
        </AffiliateLayout>
      )}

      {/* Admin Layout View */}
      {layoutMode === 'admin' && (
        <AdminLayout>
          <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card glass>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">WASSCE Stock Available</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">1,420</p>
                  </div>
                  <Badge variant="success">Healthy</Badge>
                </div>
              </Card>

              <Card glass>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">BECE Stock Available</p>
                    <p className="text-3xl font-bold text-amber-600 mt-1">180</p>
                  </div>
                  <Badge variant="warning" pulse>Low Stock</Badge>
                </div>
              </Card>

              <Card glass>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Today's Revenue</p>
                    <p className="text-3xl font-bold text-emerald-700 mt-1">{formatCedi(8450.0)}</p>
                  </div>
                  <Badge variant="primary">338 Orders</Badge>
                </div>
              </Card>

              <Card glass>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Pending Withdrawals</p>
                    <p className="text-3xl font-bold text-rose-600 mt-1">{formatCedi(640.0)}</p>
                  </div>
                  <Badge variant="error">2 Payouts</Badge>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card glass header={<h3 className="font-bold text-slate-900">Voucher Inventory Batch Operations</h3>}>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" leftIcon={<FiBox />}>
                  Import Voucher Batch (CSV / Excel)
                </Button>
                <Button variant="secondary" leftIcon={<FiRefreshCw />}>
                  Trigger MoMo Reconciliation
                </Button>
              </div>
            </Card>
          </div>
        </AdminLayout>
      )}

      {/* Checkout Modal */}
      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title={`Purchase ${selectedProduct} Result Checker`}
        description="Select Mobile Money network and enter your phone number to receive payment prompt."
      >
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-900 text-sm">{selectedProduct} Result Checker</p>
              <p className="text-xs text-slate-500">Instant Serial & PIN via SMS</p>
            </div>
            <p className="text-xl font-bold text-teal-700">
              {selectedProduct === 'WASSCE' ? formatCedi(35.0) : formatCedi(30.0)}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Mobile Money Network
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['MTN', 'Telecel', 'AT'].map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setMomoNetwork(net)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    momoNetwork === net
                      ? 'bg-teal-50 border-teal-600 text-teal-800 ring-2 ring-teal-600/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Mobile Money Phone Number"
            placeholder="e.g. 024XXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            helperText="The Mobile Money prompt will be sent directly to this number."
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" type="button" onClick={() => setIsCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" size="lg">
              Pay Now ({selectedProduct === 'WASSCE' ? formatCedi(35.0) : formatCedi(30.0)})
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
