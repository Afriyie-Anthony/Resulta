import React, { useState } from 'react';
import { AffiliateLayout } from '../../../components/affilite/AffiliateLayout';
import { AffiliateOverviewView } from './views/AffiliateOverviewView';
import { AffiliateReferralsView } from './views/AffiliateReferralsView';
import { AffiliateSalesView } from './views/AffiliateSalesView';
import { AffiliateEarningsView } from './views/AffiliateEarningsView';
import { AffiliateWithdrawalsView } from './views/AffiliateWithdrawalsView';
import { AffiliateProfileView } from './views/AffiliateProfileView';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useToast } from '../../../components/ui/Toast';
import { formatCedi } from '../../../utils/formatters';
import { FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import {
  useAffiliateDashboard,
  useAffiliateProfile,
  useRequestAffiliateWithdrawal,
} from '../../../hooks/useAffiliate';
import { useSearchParams } from 'react-router-dom';

const AffiliateDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const setActiveTab = (tab: string) => setSearchParams({ tab });

  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [momoNetwork, setMomoNetwork] = useState<string | null>(null);
  const [momoPhone, setMomoPhone] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string | null>(null);

  const { addToast } = useToast();
  
  const { data, isLoading } = useAffiliateDashboard();
  const { data: profile } = useAffiliateProfile();
  const requestWithdrawalMutation = useRequestAffiliateWithdrawal();

  const availableBalance = data?.kpiCards?.availableCashoutGhs || 0;
  const greetingName = data?.headerBanner?.greetingName || '';

  const currentPhone = momoPhone ?? profile?.phoneNumber ?? profile?.accountNumber ?? '';
  const currentNetwork = momoNetwork ?? profile?.network ?? 'MTN';
  const currentAccountName = accountName ?? profile?.accountName ?? profile?.user?.name ?? greetingName ?? '';

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-sm font-medium text-slate-500 animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  const handlePayoutSubmit = async (e: React.FormEvent) => {
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

    try {
      await requestWithdrawalMutation.mutateAsync({
        amount: amountNum,
        description: `Affiliate commission payout request to ${currentPhone} (${currentNetwork})`,
      });

      setIsPayoutModalOpen(false);
      setPayoutAmount('');
      addToast({
        title: 'Withdrawal Request Submitted',
        message: `Your request for ${formatCedi(amountNum)} to ${currentPhone} (${currentNetwork}) has been submitted for admin review.`,
        type: 'success',
      });
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Could not submit withdrawal request. Please try again.';
      addToast({
        title: 'Withdrawal Failed',
        message: errorMsg,
        type: 'error',
      });
    }
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
            data={data}
            onNavigateTab={setActiveTab}
            onRequestPayout={() => setIsPayoutModalOpen(true)}
          />
        )}
        {activeTab === 'referrals' && <AffiliateReferralsView />}
        {activeTab === 'sales' && <AffiliateSalesView />}
        {activeTab === 'earnings' && (
          <AffiliateEarningsView onRequestPayout={() => setIsPayoutModalOpen(true)} />
        )}
        {activeTab === 'withdrawals' && (
          <AffiliateWithdrawalsView
            onRequestPayout={() => setIsPayoutModalOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}
        {activeTab === 'profile' && <AffiliateProfileView />}
      </AffiliateLayout>

      {/* MoMo Payout Request Modal */}
      <Modal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        title="Request Mobile Money Payout"
        description="Transfer your cleared affiliate commissions directly to your Ghana Mobile Money wallet."
        size="md"
        forceLight
      >
        <form onSubmit={handlePayoutSubmit} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Available Wallet Balance:</span>
            <span className="font-medium text-emerald-600 text-sm">{formatCedi(availableBalance)}</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Withdrawal Amount (GH₵)
            </label>
            <Input
              type="number"
              step="0.01"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              placeholder="Min GH₵ 20.00"
              leftIcon={<FiDollarSign className="text-slate-400" />}
              forceLight
            />
            <span className="text-[10px] text-slate-500 mt-1.5 block">
              Minimum payout: GH₵ 20.00 • No transfer fee deducted
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                MoMo Network
              </label>
              <select
                value={currentNetwork}
                onChange={(e) => setMomoNetwork(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
              >
                <option value="MTN">MTN Mobile Money</option>
                <option value="Telecel">Telecel Cash</option>
                <option value="AT">AT Money</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Receiver Mobile Number
              </label>
              <Input
                value={currentPhone}
                onChange={(e) => setMomoPhone(e.target.value)}
                placeholder="024 XXX XXXX"
                forceLight
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Account Holder Name
            </label>
            <Input
              value={currentAccountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Verified MoMo Account Name"
              forceLight
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
            <Button
              variant="gradient"
              type="submit"
              leftIcon={<FiCheckCircle />}
              disabled={requestWithdrawalMutation.isPending}
            >
              {requestWithdrawalMutation.isPending ? 'Submitting...' : 'Submit Cashout Request'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AffiliateDashboard;
