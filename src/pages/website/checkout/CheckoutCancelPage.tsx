import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiShoppingCart,
  FiHelpCircle,
  FiPhoneCall,
  FiShield,
  FiSmartphone,
  FiRefreshCw,
} from 'react-icons/fi';
import WebsiteNavbar from '../../../components/website/layout/WebsiteNavbar';
import WebsiteFooter from '../../../components/website/layout/WebsiteFooter';
import MobileBottomNav from '../../../components/website/layout/MobileBottomNav';
import BuyBottomSheet from '../../../components/website/layout/BuyBottomSheet';
import MoreBottomSheet from '../../../components/website/layout/MoreBottomSheet';

const CheckoutCancelPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId =
    searchParams.get('orderId') ||
    searchParams.get('clientReference') ||
    searchParams.get('order_id') ||
    searchParams.get('checkoutid') ||
    searchParams.get('checkoutId') ||
    searchParams.get('transactionId') ||
    searchParams.get('reference') ||
    searchParams.get('ref');

  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Helmet>
        <title>Payment Cancelled - Resulta</title>
        <meta
          name="description"
          content="Your transaction was cancelled. No charges were made to your account. You can retry your voucher purchase at any time."
        />
      </Helmet>

      <WebsiteNavbar />

      <main className="flex-1 py-12 lg:py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto space-y-8 animate-fade-in">
          {/* Main Cancellation Card */}
          <div className="bg-warm rounded-3xl border border-border p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Alert Icon */}
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6 text-amber-600 shadow-lg shadow-amber-500/10">
                <FiAlertCircle className="w-9 h-9 sm:w-10 sm:h-10" />
              </div>

              {/* Status Badge */}
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-800 border border-amber-500/30 mb-3">
                Transaction Cancelled
              </span>

              <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight mb-3">
                Payment Was Cancelled
              </h1>

              <p className="text-sm sm:text-base text-text-secondary max-w-lg mx-auto leading-relaxed mb-6">
                Your checkout session was stopped before completion. <strong className="text-text-primary">No funds were deducted</strong> from your Mobile Money wallet or card.
              </p>

              {/* Order reference banner if present */}
              {orderId && (
                <div className="inline-flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-xl text-xs text-text-secondary mb-8 shadow-sm">
                  <span>Order Reference:</span>
                  <span className="font-mono font-extrabold text-text-primary">{orderId}</span>
                </div>
              )}

              {/* Reassurance pill */}
              <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-border text-left mb-8 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                  <FiShield className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your account is completely secure</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed pl-6">
                  You can resume your purchase right away. If you experienced any unexpected errors, our automated system is available 24/7.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => navigate('/purchase')}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-xl text-sm hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 transition-all shadow-lg"
                >
                  <FiShoppingCart className="w-4 h-4" />
                  Try Purchase Again
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="inline-flex items-center justify-center gap-2 bg-white text-text-primary font-semibold px-6 py-4 rounded-xl text-sm border border-border hover:bg-soft-ivory transition-all shadow-sm"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Return to Homepage
                </button>
              </div>
            </div>
          </div>

          {/* Common Reasons / Help Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* USSD Alternative Card */}
            <div className="bg-warm rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4 border border-secondary/20">
                  <FiSmartphone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-text-primary mb-1">
                  Prefer Buying via USSD?
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  You can buy your WASSCE or BECE voucher without internet by dialing our official USSD shortcode.
                </p>
              </div>
              <div className="bg-surface rounded-xl p-3 border border-border flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Dial Code</p>
                  <p className="text-sm font-black font-mono text-secondary">*713*5912#</p>
                </div>
                <span className="text-[10px] bg-secondary/10 text-secondary font-bold px-2.5 py-1 rounded-lg">
                  MTN &bull; Telecel &bull; AT
                </span>
              </div>
            </div>

            {/* Support Assistance Card */}
            <div className="bg-warm rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-500/20">
                  <FiHelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-text-primary mb-1">
                  Need Help With Checkout?
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  If you faced payment issues, network timeouts, or have questions, our customer support team is available.
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href="https://wa.me/233246573062?text=Hello%20Resulta%2C%20my%20Hubtel%20checkout%20was%20cancelled%20and%20I%20need%20assistance."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-2.5 px-3 rounded-xl text-xs hover:bg-emerald-700 transition-all shadow-sm"
                >
                  <FiPhoneCall className="w-3.5 h-3.5" />
                  WhatsApp Support
                </a>
                <Link
                  to="/help/faq"
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-surface border border-border text-text-secondary hover:text-text-primary text-xs font-semibold rounded-xl transition-colors"
                >
                  FAQ
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Troubleshooting Guide */}
          <div className="bg-warm rounded-2xl border border-border p-6 sm:p-7 shadow-sm">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <FiRefreshCw className="w-4 h-4 text-secondary" />
              Common Reasons for Payment Cancellation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-text-secondary">
              <div className="bg-surface p-3.5 rounded-xl border border-border">
                <p className="font-bold text-text-primary mb-1">1. MoMo Prompt Timeout</p>
                <p>If the approval prompt doesn't show in 60 seconds, check your phone network and try again.</p>
              </div>
              <div className="bg-surface p-3.5 rounded-xl border border-border">
                <p className="font-bold text-text-primary mb-1">2. Accidental Close</p>
                <p>Closing the browser or clicking cancel aborts the transaction immediately without charge.</p>
              </div>
              <div className="bg-surface p-3.5 rounded-xl border border-border">
                <p className="font-bold text-text-primary mb-1">3. Insufficient Wallet Balance</p>
                <p>Ensure your mobile money balance covers the voucher price including network transaction fees.</p>
              </div>
              <div className="bg-surface p-3.5 rounded-xl border border-border">
                <p className="font-bold text-text-primary mb-1">4. Wrong PIN Entered</p>
                <p>Entering an incorrect PIN on your phone keypad will cause the payment gateway to decline.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <WebsiteFooter />
      <MobileBottomNav onBuyClick={() => setIsBuyOpen(true)} onMoreClick={() => setIsMoreOpen(true)} />
      <BuyBottomSheet isOpen={isBuyOpen} onClose={() => setIsBuyOpen(false)} />
      <MoreBottomSheet isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </div>
  );
};

export default CheckoutCancelPage;
