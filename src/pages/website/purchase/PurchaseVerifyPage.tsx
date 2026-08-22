import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiCopy, FiCheck, FiSearch } from 'react-icons/fi';
import WebsiteNavbar from '../../../components/website/layout/WebsiteNavbar';
import WebsiteFooter from '../../../components/website/layout/WebsiteFooter';
import { useVerifyPayment } from '../../../hooks/usePurchase';

const PurchaseVerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Hubtel usually appends parameters to the return URL. 
  // Depending on configuration, it could be `orderId`, `clientReference`, etc.
  const orderId = searchParams.get('orderId') || searchParams.get('clientReference');
  
  const { data: verifyData, isLoading, isError } = useVerifyPayment(orderId);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      // If someone just navigated to /purchase/verify directly without an orderId
      navigate('/purchase');
    }
  }, [orderId, navigate]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="bg-warm rounded-2xl border border-border p-12 text-center max-w-lg w-full mx-auto shadow-2xl">
          <div className="w-16 h-16 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-black text-text-primary mb-2">Verifying Payment</h2>
          <p className="text-text-secondary">Please wait while we confirm your payment with Hubtel. Do not close this window.</p>
        </div>
      );
    }

    if (isError || !verifyData) {
      return (
        <div className="bg-warm rounded-2xl border border-border p-12 text-center max-w-lg w-full mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
            <FiXCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-2xl font-black text-text-primary mb-2">Verification Failed</h2>
          <p className="text-text-secondary mb-8">We could not verify your payment status. If you have been charged, your vouchers will still be delivered via SMS.</p>
          <button
            onClick={() => navigate('/retrieve-voucher')}
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <FiSearch className="w-4 h-4" />
            Go to Voucher Retrieval
          </button>
        </div>
      );
    }

    const { status, vouchers, message } = verifyData;

    if (status === 'PENDING_MOMO') {
      return (
        <div className="bg-warm rounded-2xl border border-border p-12 text-center max-w-lg w-full mx-auto shadow-2xl">
          <div className="w-16 h-16 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-black text-text-primary mb-2">Payment Pending</h2>
          <p className="text-text-secondary mb-4">{message || 'Waiting for Mobile Money confirmation...'}</p>
          <p className="text-xs text-slate-500 bg-surface border border-border p-3 rounded-lg inline-block">
            Order ID: {orderId}
          </p>
        </div>
      );
    }

    if (status === 'FAILED') {
      return (
        <div className="bg-warm rounded-2xl border border-border p-12 text-center max-w-lg w-full mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
            <FiXCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-2xl font-black text-text-primary mb-2">Payment Failed</h2>
          <p className="text-text-secondary mb-8">{message || 'Your payment was declined or cancelled.'}</p>
          <button
            onClick={() => navigate('/purchase')}
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Try Again
          </button>
        </div>
      );
    }

    // FULFILLED
    return (
      <div className="max-w-2xl w-full mx-auto space-y-6">
        <div className="bg-warm rounded-2xl border border-border p-8 text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <FiCheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-text-primary mb-2">Payment Successful!</h2>
          <p className="text-text-secondary">Your order has been fulfilled. An SMS containing your vouchers has been sent to your phone.</p>
        </div>

        {vouchers && vouchers.length > 0 && (
          <div className="bg-warm rounded-2xl border border-border p-6 sm:p-8 shadow-lg">
            <h3 className="text-xl font-bold text-text-primary mb-6">Your Vouchers</h3>
            <div className="space-y-4">
              {vouchers.map((voucher, index) => (
                <div key={index} className="bg-surface rounded-xl p-5 border border-border">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Serial Number</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-text-primary font-mono bg-slate-100 px-3 py-1.5 rounded-lg">{voucher.serial}</p>
                        <button
                          onClick={() => handleCopy(voucher.serial, `serial-${index}`)}
                          className="p-1.5 rounded-lg hover:bg-slate-200 text-text-secondary hover:text-text-primary transition-colors"
                          title="Copy serial number"
                        >
                          {copiedField === `serial-${index}` ? <FiCheck className="w-4 h-4 text-emerald-500" /> : <FiCopy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Voucher PIN</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-text-primary font-mono bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">{voucher.pin}</p>
                        <button
                          onClick={() => handleCopy(voucher.pin, `pin-${index}`)}
                          className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-700 transition-colors"
                          title="Copy PIN"
                        >
                          {copiedField === `pin-${index}` ? <FiCheck className="w-4 h-4 text-emerald-500" /> : <FiCopy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center pt-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-sm font-semibold text-secondary hover:underline"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <WebsiteNavbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        {renderContent()}
      </main>
      <WebsiteFooter />
    </div>
  );
};

export default PurchaseVerifyPage;
