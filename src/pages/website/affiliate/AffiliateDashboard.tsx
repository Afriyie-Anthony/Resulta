import React, { useState } from 'react';
import WebsiteNavbar from '../../../components/website/layout/WebsiteNavbar';
import WebsiteFooter from '../../../components/website/layout/WebsiteFooter';
import MobileBottomNav from '../../../components/website/layout/MobileBottomNav';
import BuyBottomSheet from '../../../components/website/layout/BuyBottomSheet';
import MoreBottomSheet from '../../../components/website/layout/MoreBottomSheet';
import { FiUsers, FiCopy, FiTrendingUp, FiDollarSign, FiCreditCard, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/Button';

const AffiliateDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const referralCode = 'REF-GH-8823';
  const referralLink = `https://resulta.com.gh/?ref=${referralCode}`;
  const pendingPayout = 320.0;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <WebsiteNavbar />
      <main className="flex-1 pb-20 md:pb-0">
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary">Affiliate Dashboard</h1>
                <p className="mt-2 text-text-secondary">Welcome back, {user?.name || 'Affiliate'}!</p>
              </div>
              <Button variant="outline" size="sm" leftIcon={<FiLogOut />} onClick={logout}>
                Sign Out
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-warm rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                    <FiTrendingUp className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-text-secondary">Total Referrals</p>
                </div>
                <p className="text-2xl font-black text-text-primary">24</p>
              </div>
              <div className="bg-warm rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                    <FiDollarSign className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-text-secondary">Total Earnings</p>
                </div>
                <p className="text-2xl font-black text-text-primary">GH₵ 1,240.00</p>
              </div>
              <div className="bg-warm rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <FiCreditCard className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-text-secondary">Pending Payout</p>
                </div>
                <p className="text-2xl font-black text-text-primary">GH₵ {pendingPayout.toFixed(2)}</p>
              </div>
              <div className="bg-warm rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <FiUsers className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-text-secondary">Conversion Rate</p>
                </div>
                <p className="text-2xl font-black text-text-primary">18.5%</p>
              </div>
            </div>

            <div className="bg-warm rounded-2xl border border-border p-6 sm:p-8">
              <h2 className="text-lg font-bold text-text-primary mb-4">Your Referral Link</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-1 rounded-xl bg-surface border border-border px-4 py-3 text-sm text-text-primary font-mono"
                />
                <Button variant="primary" size="sm" leftIcon={<FiCopy className="w-4 h-4" />} onClick={handleCopyLink}>
                  Copy Link
                </Button>
              </div>
              <p className="mt-3 text-xs text-text-secondary">
                Share this link with customers. When they purchase vouchers using your link, you earn commissions.
              </p>
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

export default AffiliateDashboard;
