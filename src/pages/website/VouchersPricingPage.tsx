import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiLoader, FiShoppingCart } from 'react-icons/fi';
import WebsiteNavbar from '../../components/website/layout/WebsiteNavbar';
import WebsiteFooter from '../../components/website/layout/WebsiteFooter';
import MobileBottomNav from '../../components/website/layout/MobileBottomNav';
import { useVoucherConfig } from '../../hooks/usePurchase';

const VouchersPricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: config, isLoading } = useVoucherConfig();

  const getTiersForType = (type: string) => {
    if (!config) return [];
    return config.priceTiers
      .filter((tier) => tier.voucherType === type)
      .sort((a, b) => a.minQuantity - b.minQuantity);
  };

  const renderPricingTable = (type: string) => {
    if (isLoading) {
      return (
        <div className="py-8 flex justify-center">
          <FiLoader className="w-8 h-8 animate-spin text-text-secondary" />
        </div>
      );
    }

    const tiers = getTiersForType(type);

    if (tiers.length === 0) {
      return <p className="text-text-secondary text-sm py-4">Pricing currently unavailable.</p>;
    }

    return (
      <div className="mt-6">
        <h4 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wider">Pricing Tiers</h4>
        <div className="space-y-3">
          {tiers.map((tier, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-surface border border-border">
              <div>
                <p className="font-semibold text-text-primary">
                  {tier.minQuantity === 1 && tier.maxQuantity === 9
                    ? 'Single Purchase (1 - 9)'
                    : tier.maxQuantity === 999999
                    ? `Bulk Purchase (${tier.minQuantity}+)`
                    : `Bulk Purchase (${tier.minQuantity} - ${tier.maxQuantity})`}
                </p>
              </div>
              <div className="text-right">
                <p className="font-black text-lg text-secondary">GH₵ {tier.unitPrice.toFixed(2)}</p>
                <p className="text-[10px] text-text-secondary uppercase">Per Voucher</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <WebsiteNavbar />

      <main className="flex-1 pb-20 md:pb-0">
        {/* Header Section */}
        <section className="bg-primary py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/20 via-primary to-primary"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6">
              Vouchers & Pricing
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Transparent, competitive pricing with massive discounts for bulk purchases. Buy directly from the source.
            </p>
          </div>
        </section>

        {/* Pricing Cards Section */}
        <section className="py-16 lg:py-24 -mt-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* WASSCE Card */}
              <div className="bg-warm rounded-3xl border border-border p-6 sm:p-8 shadow-xl shadow-slate-200/50 flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                
                <div className="relative z-10 flex-1">
                  <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-4">WASSCE 2026</span>
                  <h3 className="text-2xl font-black text-text-primary mb-2">WASSCE / NOVDEC</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    Valid for all Senior High School examinations including school and private candidates.
                  </p>
                  
                  <ul className="space-y-3 text-sm text-text-secondary mb-8">
                    <li className="flex items-center gap-3"><FiCheckCircle className="text-teal-500 shrink-0" /> Up to 5 uses per PIN</li>
                    <li className="flex items-center gap-3"><FiCheckCircle className="text-teal-500 shrink-0" /> Instant SMS Delivery</li>
                    <li className="flex items-center gap-3"><FiCheckCircle className="text-teal-500 shrink-0" /> 100% Genuine WAEC Checker</li>
                  </ul>

                  {renderPricingTable('WASSCE_NOVDEC')}
                </div>
                
                <div className="mt-8 pt-6 border-t border-border relative z-10">
                  <button
                    onClick={() => navigate('/purchase?type=wassce')}
                    className="w-full inline-flex justify-center items-center gap-2 bg-primary text-white font-semibold px-6 py-4 rounded-xl text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <FiShoppingCart className="w-5 h-5" />
                    Buy WASSCE Checker
                  </button>
                </div>
              </div>

              {/* BECE Card */}
              <div className="bg-warm rounded-3xl border border-border p-6 sm:p-8 shadow-xl shadow-slate-200/50 flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                
                <div className="relative z-10 flex-1">
                  <span className="inline-block px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full mb-4">BECE 2026</span>
                  <h3 className="text-2xl font-black text-text-primary mb-2">BECE</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    Valid for all Basic Education Certificate Examinations including school and private candidates.
                  </p>
                  
                  <ul className="space-y-3 text-sm text-text-secondary mb-8">
                    <li className="flex items-center gap-3"><FiCheckCircle className="text-emerald-500 shrink-0" /> Up to 5 uses per PIN</li>
                    <li className="flex items-center gap-3"><FiCheckCircle className="text-emerald-500 shrink-0" /> Instant SMS Delivery</li>
                    <li className="flex items-center gap-3"><FiCheckCircle className="text-emerald-500 shrink-0" /> 100% Genuine WAEC Checker</li>
                  </ul>

                  {renderPricingTable('BECE')}
                </div>
                
                <div className="mt-8 pt-6 border-t border-border relative z-10">
                  <button
                    onClick={() => navigate('/purchase?type=bece')}
                    className="w-full inline-flex justify-center items-center gap-2 bg-secondary text-white font-semibold px-6 py-4 rounded-xl text-base hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <FiShoppingCart className="w-5 h-5" />
                    Buy BECE Checker
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
      
      <WebsiteFooter />
      <MobileBottomNav onBuyClick={() => {}} onMoreClick={() => {}} />
    </div>
  );
};

export default VouchersPricingPage;
