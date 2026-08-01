import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider, useToast } from './components/ui/Toast';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { AffiliateLayout } from './components/affilite/AffiliateLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Badge } from './components/ui/Badge';
import { Input } from './components/ui/Input';
import { Modal } from './components/ui/Modal';
import ProtectedRoute from './components/website/layout/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { formatCedi } from './utils/formatters';
import Home from './pages/website/Home';
import PurchasePage from './pages/website/purchase/PurchasePage';
import RetrieveVoucherPage from './pages/website/my-vouchers/RetrieveVoucherPage';
import FAQPage from './pages/website/help/FAQPage';
import ContactSupportPage from './pages/website/help/ContactSupportPage';
import TermsPage from './pages/website/legal/TermsPage';
import PrivacyPage from './pages/website/legal/PrivacyPage';
import RefundPolicyPage from './pages/website/legal/RefundPolicyPage';
import NotFound from './pages/website/NotFound';
import AffiliateAuth from './pages/website/affiliate/AffiliateAuth';
import AffiliateDashboard from './pages/website/affiliate/AffiliateDashboard';
import AffiliatePage from './pages/website/affiliate/AffiliatePage';
import AffiliateProtectedRoute from './components/website/layout/AffiliateProtectedRoute';
import AdminLogin from './pages/admin/Login';
import type { LayoutMode } from './types/ui';
import {
  FiCheckCircle,
  FiZap,
  FiSmartphone,
  FiTrendingUp,
  FiCopy,
  FiBox,
  FiRefreshCw
} from 'react-icons/fi';

const AppContent: React.FC = () => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('customer');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<'WASSCE' | 'BECE' | null>(null);
  const [phone, setPhone] = useState('');
  const [momoNetwork, setMomoNetwork] = useState('MTN');
  const { addToast } = useToast();

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
    <div>
      {/* Top Layout Switcher Control */}
      <div className="bg-slate-900/90 border-b border-slate-800 py-2.5 px-4 sticky top-0 z-50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold uppercase tracking-wider">Preview Mode:</span>
          <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setLayoutMode('customer')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                layoutMode === 'customer'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Customer Website
            </button>
            <button
              onClick={() => setLayoutMode('website')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                layoutMode === 'website'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Resulta Homepage
            </button>
            <button
              onClick={() => setLayoutMode('affiliate')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                layoutMode === 'affiliate'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Affiliate Portal
            </button>
            <button
              onClick={() => setLayoutMode('admin')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                layoutMode === 'admin'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin Control Center
            </button>
          </div>
        </div>

        <Badge variant="primary" pulse>
          Phase 1 Production Ready Architecture
        </Badge>
      </div>

      {/* Render Selected Layout Mode */}
      {layoutMode === 'customer' && (
        <CustomerLayout>
          {/* Hero Section */}
          <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative overflow-hidden">
            <Badge variant="success" pulse className="mb-4">
              Official WAEC Result-Checking Voucher Distributor
            </Badge>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight">
              Get Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-200">WASSCE & BECE</span> Result Checker Instantly
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Buy WAEC result checking vouchers online or via USSD (*928*44#). Instant PIN & Serial delivery straight to your screen and phone SMS.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="gradient"
                size="lg"
                leftIcon={<FiZap className="w-5 h-5" />}
                onClick={() => handleBuyClick('WASSCE')}
              >
                Buy WASSCE Checker (GH₵ 25.00)
              </Button>

              <Button
                variant="outline"
                size="lg"
                leftIcon={<FiSmartphone className="w-5 h-5" />}
                onClick={() => handleBuyClick('BECE')}
              >
                Buy BECE Checker (GH₵ 20.00)
              </Button>
            </div>

            {/* Feature Highlights */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <Card glass hoverable>
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center text-xl mb-4 border border-teal-500/20">
                  <FiZap />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Instant Fulfillment</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your Serial Number & PIN display immediately on screen and arrive via SMS in less than 5 seconds.
                </p>
              </Card>

              <Card glass hoverable>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl mb-4 border border-emerald-500/20">
                  <FiCheckCircle />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">100% Genuine WAEC Vouchers</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Verified stock directly sourced for authentic WASSCE School & Private candidate result portals.
                </p>
              </Card>

              <Card glass hoverable>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl mb-4 border border-amber-500/20">
                  <FiSmartphone />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">USSD Offline Support</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No internet? Dial *928*44# on any Ghanaian phone network to buy instantly via Mobile Money.
                </p>
              </Card>
            </div>
          </section>

          {/* Catalog Section */}
          <section id="vouchers" className="py-12 bg-slate-900/60 border-t border-slate-800 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Select Result Checker Voucher</h2>
                <p className="text-xs text-slate-400 mt-1">Available 24/7 with zero service markup fees</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* WASSCE Product Card */}
                <Card glass hoverable className="border-teal-500/30">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge variant="primary" className="mb-2">WASSCE 2026 Ready</Badge>
                      <h3 className="text-xl font-extrabold text-white">WASSCE Result Checker</h3>
                      <p className="text-xs text-slate-400 mt-1">School & Private Candidates</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-400">{formatCedi(25.0)}</span>
                      <span className="block text-[10px] text-slate-400">per voucher</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300 mb-6">
                    <li className="flex items-center gap-2"><FiCheckCircle className="text-teal-400" /> Checks WASSCE School & Nov/Dec Results</li>
                    <li className="flex items-center gap-2"><FiCheckCircle className="text-teal-400" /> Up to 5 uses per voucher pin</li>
                    <li className="flex items-center gap-2"><FiCheckCircle className="text-teal-400" /> Instant SMS & On-Screen PIN delivery</li>
                  </ul>
                  <Button variant="gradient" fullWidth onClick={() => handleBuyClick('WASSCE')}>
                    Buy WASSCE Voucher Now
                  </Button>
                </Card>

                {/* BECE Product Card */}
                <Card glass hoverable className="border-emerald-500/30">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge variant="success" className="mb-2">BECE 2026 Ready</Badge>
                      <h3 className="text-xl font-extrabold text-white">BECE Result Checker</h3>
                      <p className="text-xs text-slate-400 mt-1">Junior High School Candidates</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-400">{formatCedi(20.0)}</span>
                      <span className="block text-[10px] text-slate-400">per voucher</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300 mb-6">
                    <li className="flex items-center gap-2"><FiCheckCircle className="text-emerald-400" /> Checks BECE School & Private Results</li>
                    <li className="flex items-center gap-2"><FiCheckCircle className="text-emerald-400" /> Up to 5 uses per voucher pin</li>
                    <li className="flex items-center gap-2"><FiCheckCircle className="text-emerald-400" /> Instant SMS & On-Screen PIN delivery</li>
                  </ul>
                  <Button variant="primary" fullWidth onClick={() => handleBuyClick('BECE')}>
                    Buy BECE Voucher Now
                  </Button>
                </Card>
              </div>
            </div>
          </section>
        </CustomerLayout>
      )}

      {/* Website Homepage */}
      {layoutMode === 'website' && <Home />}

      {/* Affiliate Layout View */}
      {layoutMode === 'affiliate' && (
        <AffiliateLayout>
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card glass>
                <p className="text-xs text-slate-400 font-semibold uppercase">Total Sales Referred</p>
                <p className="text-2xl font-black text-white mt-1">148</p>
                <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                  <FiTrendingUp /> +18% from last week
                </p>
              </Card>

              <Card glass>
                <p className="text-xs text-slate-400 font-semibold uppercase">Total Earnings</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">{formatCedi(1450.0)}</p>
                <p className="text-[10px] text-slate-400 mt-1">GH₵ 10.00 commission per sale</p>
              </Card>

              <Card glass>
                <p className="text-xs text-slate-400 font-semibold uppercase">Withdrawn to MoMo</p>
                <p className="text-2xl font-black text-white mt-1">{formatCedi(1130.0)}</p>
                <p className="text-[10px] text-teal-400 mt-1">Paid directly to 024XXXX67</p>
              </Card>

              <Card glass>
                <p className="text-xs text-slate-400 font-semibold uppercase">Available for Payout</p>
                <p className="text-2xl font-black text-amber-400 mt-1">{formatCedi(320.0)}</p>
                <Button variant="gradient" size="sm" className="mt-2 w-full">
                  Withdraw to MoMo
                </Button>
              </Card>
            </div>

            {/* Link Sharing Card */}
            <Card glass header={<h3 className="font-bold text-white">Your Unique Referral Link</h3>}>
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
                    <p className="text-xs text-slate-400 font-semibold uppercase">WASSCE Stock Available</p>
                    <p className="text-2xl font-black text-white mt-1">1,420</p>
                  </div>
                  <Badge variant="success">Healthy</Badge>
                </div>
              </Card>

              <Card glass>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">BECE Stock Available</p>
                    <p className="text-2xl font-black text-amber-400 mt-1">180</p>
                  </div>
                  <Badge variant="warning" pulse>Low Stock</Badge>
                </div>
              </Card>

              <Card glass>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Today's Revenue</p>
                    <p className="text-2xl font-black text-emerald-400 mt-1">{formatCedi(8450.0)}</p>
                  </div>
                  <Badge variant="primary">338 Orders</Badge>
                </div>
              </Card>

              <Card glass>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Pending Withdrawals</p>
                    <p className="text-2xl font-black text-rose-400 mt-1">{formatCedi(640.0)}</p>
                  </div>
                  <Badge variant="error">2 Payouts</Badge>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card glass header={<h3 className="font-bold text-white">Voucher Inventory Batch Operations</h3>}>
              <div className="flex flex-wrap gap-3">
                <Button variant="gradient" leftIcon={<FiBox />}>
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
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
            <div>
              <p className="font-bold text-white text-sm">{selectedProduct} Result Checker</p>
              <p className="text-xs text-slate-400">Instant Serial & PIN via SMS</p>
            </div>
            <p className="text-lg font-black text-emerald-400">
              {selectedProduct === 'WASSCE' ? formatCedi(25.0) : formatCedi(20.0)}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
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
                      ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
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
            <Button variant="gradient" type="submit">
              Pay Now ({selectedProduct === 'WASSCE' ? formatCedi(25.0) : formatCedi(20.0)})
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isWebsiteRoute = location.pathname === '/' || location.pathname.startsWith('/purchase') || location.pathname.startsWith('/retrieve-voucher') || location.pathname.startsWith('/help') || location.pathname.startsWith('/legal') || location.pathname.startsWith('/affiliate');

  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card glass>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase">WASSCE Stock Available</p>
                        <p className="text-2xl font-black text-white mt-1">1,420</p>
                      </div>
                      <Badge variant="success">Healthy</Badge>
                    </div>
                  </Card>
                  <Card glass>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase">BECE Stock Available</p>
                        <p className="text-2xl font-black text-amber-400 mt-1">180</p>
                      </div>
                      <Badge variant="warning" pulse>Low Stock</Badge>
                    </div>
                  </Card>
                  <Card glass>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase">Today's Revenue</p>
                        <p className="text-2xl font-black text-emerald-400 mt-1">{formatCedi(8450.0)}</p>
                      </div>
                      <Badge variant="primary">338 Orders</Badge>
                    </div>
                  </Card>
                  <Card glass>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase">Pending Withdrawals</p>
                        <p className="text-2xl font-black text-rose-400 mt-1">{formatCedi(640.0)}</p>
                      </div>
                      <Badge variant="error">2 Payouts</Badge>
                    </div>
                  </Card>
                </div>
                <Card glass header={<h3 className="font-bold text-white">Voucher Inventory Batch Operations</h3>}>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="gradient" leftIcon={<FiBox />}>
                      Import Voucher Batch (CSV / Excel)
                    </Button>
                    <Button variant="secondary" leftIcon={<FiRefreshCw />}>
                      Trigger MoMo Reconciliation
                    </Button>
                  </div>
                </Card>
              </div>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/purchase" element={<PurchasePage />} />
      <Route path="/retrieve-voucher" element={<RetrieveVoucherPage />} />
      <Route path="/help/faq" element={<FAQPage />} />
      <Route path="/help/contact" element={<ContactSupportPage />} />
      <Route path="/legal/terms" element={<TermsPage />} />
      <Route path="/legal/privacy" element={<PrivacyPage />} />
      <Route path="/legal/refund" element={<RefundPolicyPage />} />
      <Route path="/affiliate" element={<AffiliatePage />} />
      <Route path="/affiliate/apply" element={<AffiliateAuth defaultView="register" />} />
      <Route path="/affiliate/login" element={<AffiliateAuth defaultView="login" />} />
      <Route
        path="/affiliate/dashboard"
        element={
          <AffiliateProtectedRoute>
            <AffiliateDashboard />
          </AffiliateProtectedRoute>
        }
      />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
