import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiCopy,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiPrinter,
  FiExternalLink,
  FiSearch,
  FiShield,
  FiRefreshCw,
  FiShoppingCart,
  FiHelpCircle,
} from 'react-icons/fi';
import WebsiteNavbar from '../../../components/website/layout/WebsiteNavbar';
import WebsiteFooter from '../../../components/website/layout/WebsiteFooter';
import MobileBottomNav from '../../../components/website/layout/MobileBottomNav';
import BuyBottomSheet from '../../../components/website/layout/BuyBottomSheet';
import MoreBottomSheet from '../../../components/website/layout/MoreBottomSheet';
import { useVerifyPayment } from '../../../hooks/usePurchase';
import { useToast } from '../../../components/ui/Toast';

const CheckoutSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Extract order identifier from various potential Hubtel query parameters
  const paramOrderId =
    searchParams.get('orderId') ||
    searchParams.get('clientReference') ||
    searchParams.get('order_id') ||
    searchParams.get('checkoutid') ||
    searchParams.get('checkoutId') ||
    searchParams.get('transactionId') ||
    searchParams.get('reference') ||
    searchParams.get('ref') ||
    searchParams.get('orderNumber');

  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    if (paramOrderId) return paramOrderId;
    const cached = sessionStorage.getItem('resulta_last_order');
    return cached || null;
  });

  const [manualInput, setManualInput] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [revealedPins, setRevealedPins] = useState<Record<number, boolean>>({});
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Sync param if it changes
  useEffect(() => {
    if (paramOrderId) {
      setActiveOrderId(paramOrderId);
    }
  }, [paramOrderId]);

  // Payment status polling query
  const { data: verifyData, isLoading, isError, refetch, isFetching } = useVerifyPayment(activeOrderId);

  // Copy helper
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    addToast({
      title: 'Copied to Clipboard',
      message: `${field.includes('pin') ? 'PIN' : 'Serial'} copied successfully!`,
      type: 'success',
    });
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Copy all vouchers
  const handleCopyAll = () => {
    if (!verifyData?.vouchers || verifyData.vouchers.length === 0) return;
    const formatted = verifyData.vouchers
      .map((v, i) => `Voucher #${i + 1} (${v.product || 'Result Checker'})\nSerial: ${v.serial}\nPIN: ${v.pin}`)
      .join('\n\n-------------------------\n\n');

    navigator.clipboard.writeText(
      `RESULTA VOUCHERS RECEIPT\nOrder ID: ${activeOrderId}\n\n${formatted}\n\nCheck Result At: https://ghana.waecdirect.org`
    );
    setCopiedField('all');
    addToast({
      title: 'All Vouchers Copied',
      message: 'All voucher serials and PINs copied to clipboard.',
      type: 'success',
    });
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Toggle individual PIN visibility
  const togglePinVisibility = (index: number) => {
    setRevealedPins((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Toggle all PIN visibility
  const toggleAllPins = () => {
    const total = verifyData?.vouchers?.length || 0;
    const allCurrentlyVisible = Object.values(revealedPins).filter(Boolean).length === total;
    if (allCurrentlyVisible) {
      setRevealedPins({});
    } else {
      const next: Record<number, boolean> = {};
      for (let i = 0; i < total; i++) {
        next[i] = true;
      }
      setRevealedPins(next);
    }
  };

  // Print voucher receipt
  const handlePrint = () => {
    window.print();
  };

  // Manual search submit
  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setActiveOrderId(manualInput.trim());
  };

  // Determine WAEC direct URL
  const firstVoucherProduct = verifyData?.vouchers?.[0]?.product || '';
  const isBece = firstVoucherProduct.toLowerCase().includes('bece');
  const waecPortalUrl = isBece ? 'https://eresults.waecgh.org' : 'https://ghana.waecdirect.org';
  const examTitle = isBece ? 'BECE Results Portal' : 'WASSCE / NOVDEC Results Portal';

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Helmet>
        <title>Order Confirmation & Receipt - Resulta</title>
        <meta
          name="description"
          content="Your Resulta voucher purchase confirmation and instant result checker voucher details."
        />
      </Helmet>

      <div className="print:hidden">
        <WebsiteNavbar />
      </div>

      <main className="flex-1 py-10 lg:py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-3xl w-full mx-auto">
          {/* STATE 1: NO ORDER ID FOUND */}
          {!activeOrderId && (
            <div className="bg-warm rounded-3xl border border-border p-8 sm:p-12 text-center shadow-xl animate-fade-in max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-6 border border-secondary/20 text-secondary">
                <FiSearch className="w-8 h-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-3">
                Track Your Voucher Order
              </h1>
              <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                Enter your Order Reference or Transaction ID from your payment confirmation to view your vouchers.
              </p>

              <form onSubmit={handleManualSearch} className="space-y-4 mb-6 text-left">
                <div>
                  <label htmlFor="orderRef" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Order Reference / ID
                  </label>
                  <input
                    type="text"
                    id="orderRef"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="e.g. RES-948123 or Hubtel Ref"
                    className="w-full rounded-xl bg-white border border-border px-4 py-3 text-sm text-text-primary placeholder-text-secondary/60 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all uppercase shadow-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-secondary text-white font-semibold px-6 py-3.5 rounded-xl text-sm hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20"
                >
                  <FiSearch className="w-4 h-4" />
                  View Voucher Details
                </button>
              </form>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t border-border text-xs">
                <Link to="/purchase" className="text-primary font-semibold hover:underline">
                  Buy a new voucher
                </Link>
                <span className="hidden sm:inline text-border">|</span>
                <Link to="/retrieve-voucher" className="text-secondary font-semibold hover:underline">
                  Retrieve by phone number
                </Link>
              </div>
            </div>
          )}

          {/* STATE 2: LOADING / VERIFYING */}
          {activeOrderId && isLoading && (
            <div className="bg-warm rounded-3xl border border-border p-10 sm:p-14 text-center shadow-2xl animate-fade-in max-w-lg mx-auto">
              <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-secondary/20 animate-pulse" />
                <div className="w-20 h-20 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-secondary">
                  <FiClock className="w-7 h-7 animate-bounce" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-text-primary mb-3">Verifying Payment</h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                Please wait while we confirm your payment with Hubtel and generate your voucher serial and PIN.
              </p>

              {/* Progress Steps */}
              <div className="bg-surface rounded-2xl p-4 border border-border text-left space-y-3">
                <div className="flex items-center gap-3 text-xs font-semibold text-emerald-600">
                  <FiCheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>Payment Gateway Return Received</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-secondary">
                  <div className="w-4 h-4 rounded-full border-2 border-secondary border-t-transparent animate-spin shrink-0" />
                  <span>Validating Order & Allocating Vouchers...</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  <div className="w-4 h-4 rounded-full border border-border shrink-0" />
                  <span>SMS Delivery Dispatch</span>
                </div>
              </div>

              <p className="text-[11px] text-text-secondary mt-6">
                Order Reference:{' '}
                <span className="font-mono font-semibold text-text-primary">{activeOrderId}</span>
              </p>
            </div>
          )}

          {/* STATE 3: ERROR / UNABLE TO FETCH */}
          {activeOrderId && !isLoading && (isError || !verifyData) && (
            <div className="bg-warm rounded-3xl border border-border p-8 sm:p-12 text-center shadow-xl animate-fade-in max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-6 border border-rose-500/20 text-rose-500">
                <FiXCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-text-primary mb-2">
                Order Verification Pending
              </h2>
              <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                We could not automatically verify order <strong className="font-mono text-text-primary">{activeOrderId}</strong> at this moment. If you completed payment, your vouchers will be delivered via SMS.
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3.5 rounded-xl text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <FiRefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                  Retry Verification
                </button>
                <Link
                  to="/retrieve-voucher"
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-6 py-3.5 rounded-xl text-sm border border-border hover:bg-soft-ivory transition-all"
                >
                  <FiSearch className="w-4 h-4" />
                  Retrieve via Phone Number
                </Link>
                <a
                  href="https://wa.me/233246573062?text=Hello%20Resulta%2C%20I%20completed%20a%20Hubtel%20payment%20for%20order%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold px-6 py-3.5 rounded-xl text-sm hover:bg-emerald-700 transition-all"
                >
                  <FiHelpCircle className="w-4 h-4" />
                  Contact Support on WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* STATE 4: PENDING_MOMO STATUS */}
          {activeOrderId && !isLoading && verifyData?.status === 'PENDING_MOMO' && (
            <div className="bg-warm rounded-3xl border border-amber-500/30 p-8 sm:p-12 text-center shadow-xl animate-fade-in max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6 border border-amber-500/20 text-amber-600">
                <FiClock className="w-8 h-8 animate-pulse" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 border border-amber-500/30 mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Awaiting Payment Approval
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-text-primary mb-3">
                Approve Prompt on Your Phone
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                {verifyData.message ||
                  'Please authorize the Mobile Money prompt sent to your phone. Once approved, this page will update automatically.'}
              </p>

              <div className="bg-surface rounded-2xl p-5 border border-border text-left mb-6 space-y-3">
                <p className="text-xs font-bold text-text-primary uppercase tracking-wider">Helpful Tips:</p>
                <ul className="text-xs text-text-secondary space-y-2 list-disc list-inside">
                  <li>Check your phone screen for the payment approval popup.</li>
                  <li>Enter your Mobile Money PIN to authorize the transaction.</li>
                  <li>On MTN MoMo: If no prompt appeared, dial *170# &gt; My Approvals.</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-secondary text-white font-semibold px-6 py-3.5 rounded-xl text-sm hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 disabled:opacity-50"
                >
                  <FiRefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                  {isFetching ? 'Checking Status...' : 'Check Status Now'}
                </button>
              </div>
            </div>
          )}

          {/* STATE 5: PAYMENT FAILED */}
          {activeOrderId && !isLoading && verifyData?.status === 'FAILED' && (
            <div className="bg-warm rounded-3xl border border-rose-500/30 p-8 sm:p-12 text-center shadow-xl animate-fade-in max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-6 border border-rose-500/20 text-rose-600">
                <FiXCircle className="w-8 h-8" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-700 border border-rose-500/30 mb-3">
                Transaction Declined
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-text-primary mb-3">
                Payment Was Not Completed
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                {verifyData.message ||
                  'Your payment could not be processed. This may happen if the payment was cancelled, timed out, or had insufficient funds.'}
              </p>

              <div className="bg-surface rounded-2xl p-4 border border-border mb-6">
                <p className="text-xs text-text-secondary">
                  Order Reference:{' '}
                  <span className="font-mono font-bold text-text-primary">{activeOrderId}</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/purchase')}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3.5 rounded-xl text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <FiShoppingCart className="w-4 h-4" />
                  Try Purchase Again
                </button>
                <Link
                  to="/help/contact"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-6 py-3.5 rounded-xl text-sm border border-border hover:bg-soft-ivory transition-all"
                >
                  <FiHelpCircle className="w-4 h-4" />
                  Contact Support
                </Link>
              </div>
            </div>
          )}

          {/* STATE 6: FULFILLED / SUCCESSFUL */}
          {activeOrderId && !isLoading && verifyData?.status === 'FULFILLED' && (
            <div className="space-y-8 animate-fade-in">
              {/* Success Header Banner */}
              <div className="bg-warm rounded-3xl border border-emerald-500/30 p-8 sm:p-10 text-center shadow-xl relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-emerald-600/30 text-white animate-bounce-short">
                    <FiCheckCircle className="w-10 h-10" />
                  </div>

                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 mb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Payment Confirmed & Fulfilled
                  </span>

                  <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight mb-3">
                    Your Voucher Is Ready!
                  </h1>

                  <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
                    Thank you for your purchase. Your official result-checking voucher details are displayed below and have also been sent via SMS to your phone.
                  </p>

                  {/* Order Details Metadata Card */}
                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface rounded-2xl p-4 border border-border text-left shadow-sm">
                    <div>
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Order Reference</p>
                      <p className="text-xs sm:text-sm font-mono font-extrabold text-text-primary truncate mt-0.5" title={activeOrderId}>
                        {activeOrderId}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Product</p>
                      <p className="text-xs sm:text-sm font-extrabold text-secondary truncate mt-0.5">
                        {firstVoucherProduct || 'WAEC Voucher'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Quantity</p>
                      <p className="text-xs sm:text-sm font-extrabold text-text-primary mt-0.5">
                        {verifyData.vouchers?.length || 1} {verifyData.vouchers && verifyData.vouchers.length > 1 ? 'Vouchers' : 'Voucher'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Delivery</p>
                      <p className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                        <FiCheck className="w-3.5 h-3.5" /> Instant & SMS
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vouchers List Container */}
              {verifyData.vouchers && verifyData.vouchers.length > 0 && (
                <div className="bg-warm rounded-3xl border border-border p-6 sm:p-8 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-6">
                    <div>
                      <h2 className="text-xl font-black text-text-primary">Purchased Vouchers</h2>
                      <p className="text-xs text-text-secondary mt-1">
                        Use the serial number and PIN to check your results on the official WAEC portal.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 print:hidden">
                      {verifyData.vouchers.length > 1 && (
                        <button
                          type="button"
                          onClick={toggleAllPins}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-text-secondary bg-surface border border-border hover:text-text-primary hover:bg-slate-50 transition-colors"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          Toggle PINs
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleCopyAll}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-secondary bg-secondary/10 border border-secondary/20 hover:bg-secondary/20 transition-all"
                      >
                        {copiedField === 'all' ? <FiCheck className="w-3.5 h-3.5 text-emerald-600" /> : <FiCopy className="w-3.5 h-3.5" />}
                        {copiedField === 'all' ? 'All Copied!' : 'Copy All'}
                      </button>
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all"
                      >
                        <FiPrinter className="w-3.5 h-3.5" />
                        Print / PDF
                      </button>
                    </div>
                  </div>

                  {/* Individual Voucher Items */}
                  <div className="space-y-4">
                    {verifyData.vouchers.map((voucher, idx) => {
                      const isPinVisible = !!revealedPins[idx];
                      const serialKey = `serial-${idx}`;
                      const pinKey = `pin-${idx}`;

                      return (
                        <div
                          key={idx}
                          className="bg-surface rounded-2xl p-5 sm:p-6 border border-border shadow-sm hover:border-secondary/40 transition-all relative group"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-secondary bg-secondary/10 px-3 py-1 rounded-lg">
                              Voucher #{idx + 1} &bull; {voucher.product || 'WAEC Checker'}
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                              Active & Ready
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Serial Number Block */}
                            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
                              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">
                                Serial Number
                              </p>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-base sm:text-lg font-black font-mono text-text-primary tracking-wider select-all">
                                  {voucher.serial}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(voucher.serial, serialKey)}
                                  className="p-2 rounded-lg bg-white border border-border hover:bg-slate-100 text-text-secondary hover:text-primary transition-all shrink-0 print:hidden"
                                  title="Copy Serial Number"
                                >
                                  {copiedField === serialKey ? (
                                    <FiCheck className="w-4 h-4 text-emerald-500" />
                                  ) : (
                                    <FiCopy className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* PIN Block */}
                            <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-200/80">
                              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1">
                                Voucher PIN
                              </p>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-base sm:text-lg font-black font-mono text-emerald-950 tracking-widest select-all">
                                  {isPinVisible ? voucher.pin : '•••• •••• ••••'}
                                </span>
                                <div className="flex items-center gap-1 shrink-0 print:hidden">
                                  <button
                                    type="button"
                                    onClick={() => togglePinVisibility(idx)}
                                    className="p-2 rounded-lg bg-white border border-emerald-200 hover:bg-emerald-100/50 text-emerald-700 transition-all"
                                    title={isPinVisible ? 'Hide PIN' : 'Reveal PIN'}
                                  >
                                    {isPinVisible ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(voucher.pin, pinKey)}
                                    className="p-2 rounded-lg bg-white border border-emerald-200 hover:bg-emerald-100/50 text-emerald-700 transition-all"
                                    title="Copy PIN"
                                  >
                                    {copiedField === pinKey ? (
                                      <FiCheck className="w-4 h-4 text-emerald-500" />
                                    ) : (
                                      <FiCopy className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Direct Link to WAEC Result Portal */}
              <div className="bg-gradient-to-br from-primary via-primary/95 to-secondary rounded-3xl p-6 sm:p-8 text-white shadow-xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full">
                      <FiExternalLink className="w-3 h-3" /> Official WAEC Direct Portal
                    </span>
                    <h3 className="text-2xl font-black text-white">
                      Ready to Check Your Results?
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                      Visit the official portal to enter your Index Number, Examination Year, and the Serial Number and PIN above.
                    </p>
                  </div>

                  <a
                    href={waecPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-accent text-primary font-black px-6 py-4 rounded-2xl text-sm hover:bg-accent/90 hover:scale-105 transition-all shadow-xl shadow-black/20 shrink-0"
                  >
                    <span>Open {examTitle}</span>
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Quick 3-Step Guide */}
                <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                    <p className="text-white/80">Click the button above to launch the official portal.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                    <p className="text-white/80">Type your 10-digit Examination Index Number.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                    <p className="text-white/80">Paste your Voucher Serial & PIN to display your result card.</p>
                  </div>
                </div>
              </div>

              {/* Security & Support Footer Notice */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-warm rounded-2xl border border-border text-xs text-text-secondary print:hidden">
                <div className="flex items-center gap-2">
                  <FiShield className="w-4 h-4 text-secondary shrink-0" />
                  <span>
                    Keep your PIN confidential. You can re-retrieve this voucher anytime using your phone number on our website.
                  </span>
                </div>
                <div className="flex items-center gap-4 shrink-0 font-medium">
                  <Link to="/purchase" className="text-primary hover:underline">
                    Buy More
                  </Link>
                  <Link to="/retrieve-voucher" className="text-secondary hover:underline">
                    Retrieve Vouchers
                  </Link>
                  <Link to="/help/contact" className="text-text-primary hover:underline">
                    Support
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="print:hidden">
        <WebsiteFooter />
        <MobileBottomNav onBuyClick={() => setIsBuyOpen(true)} onMoreClick={() => setIsMoreOpen(true)} />
        <BuyBottomSheet isOpen={isBuyOpen} onClose={() => setIsBuyOpen(false)} />
        <MoreBottomSheet isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
