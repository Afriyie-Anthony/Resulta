import React, { useState } from 'react';
import { AffiliateLayout } from '../../../components/affilite/AffiliateLayout';
import { AffiliateOverviewView } from './views/AffiliateOverviewView';
import { AffiliateLinkGeneratorView } from './views/AffiliateLinkGeneratorView';
import { AffiliateReferralsView } from './views/AffiliateReferralsView';
import { AffiliateWithdrawalsView } from './views/AffiliateWithdrawalsView';
import { AffiliatePayoutSettingsView } from './views/AffiliatePayoutSettingsView';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useToast } from '../../../components/ui/Toast';
import { formatCedi } from '../../../utils/formatters';
import { FiDollarSign, FiCheckCircle } from 'react-icons/fi';

const AffiliateDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('320.00');
  const [momoNetwork, setMomoNetwork] = useState('MTN');
  const [momoPhone, setMomoPhone] = useState('0241234567');
  const [accountName, setAccountName] = useState('Kofi Mensah');

  const { addToast } = useToast();
  const availableBalance = 320.0;

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payoutAmount);

    if (isNaN(amountNum) || amountNum < 20.0) {
      addToast({
        title: 'Invalid Payout Amount',
        message: 'Minimum withdrawal threshold is GH₵ 20.00.',
        type: 'error',
      });
      return;
    }

    if (amountNum > availableBalance) {
      addToast({
        title: 'Insufficient Balance',
        message: `Your available balance is ${formatCedi(availableBalance)}.`,
        type: 'error',
      });
      return;
    }

    setIsPayoutModalOpen(false);
    addToast({
      title: 'Withdrawal Request Submitted',
      message: `Your request for ${formatCedi(amountNum)} to ${momoPhone} (${momoNetwork}) has been sent for admin review.`,
      type: 'success',
    });
  };

  return (
    <>
      <AffiliateLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRequestPayout={() => setIsPayoutModalOpen(true)}
      >
        {activeTab === 'overview' && (
          <AffiliateOverviewView
            onNavigateTab={setActiveTab}
            onRequestPayout={() => setIsPayoutModalOpen(true)}
          />
        )}
        {activeTab === 'links' && <AffiliateLinkGeneratorView />}
        {activeTab === 'referrals' && <AffiliateReferralsView />}
        {activeTab === 'withdrawals' && (
          <AffiliateWithdrawalsView onRequestPayout={() => setIsPayoutModalOpen(true)} />
        )}
        {activeTab === 'profile' && <AffiliatePayoutSettingsView />}
      </AffiliateLayout>

      {/* MoMo Payout Request Modal */}
      <Modal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        title="Request Mobile Money Payout"
        description="Transfer your cleared affiliate commissions directly to your Ghana Mobile Money wallet."
        size="md"
      >
        <form onSubmit={handlePayoutSubmit} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Available Wallet Balance:</span>
            <span className="font-black text-emerald-600 text-sm">{formatCedi(availableBalance)}</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Withdrawal Amount (GH₵)
            </label>
            <Input
              type="number"
              step="0.01"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              placeholder="Min GH₵ 20.00"
              leftIcon={<FiDollarSign className="text-slate-400" />}
            />
            <span className="text-[10px] text-slate-500 mt-1.5 block">
              Minimum payout: GH₵ 20.00 • No transfer fee deducted
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                MoMo Network
              </label>
              <select
                value={momoNetwork}
                onChange={(e) => setMomoNetwork(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
              >
                <option value="MTN">MTN Mobile Money</option>
                <option value="Telecel">Telecel Cash</option>
                <option value="AT">AT Money</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Receiver Mobile Number
              </label>
              <Input
                value={momoPhone}
                onChange={(e) => setMomoPhone(e.target.value)}
                placeholder="024 XXX XXXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Account Holder Name
            </label>
            <Input
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Verified MoMo Account Name"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsPayoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="gradient" type="submit" leftIcon={<FiCheckCircle />}>
              Submit Cashout Request
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AffiliateDashboard;
