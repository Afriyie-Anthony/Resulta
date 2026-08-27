import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Modal } from '../../ui/Modal';
import { useToast } from '../../ui/Toast';
import { formatCedi } from '../../../utils/formatters';
import type { Affiliate } from '../../../schemas/affiliate';
import {
  useAdminAffiliateDetail,
  useApproveAdminAffiliate,
  useRejectAdminAffiliate,
  useUpdateAdminAffiliate,
  useDeleteAdminAffiliate
} from '../../../hooks/useAdminAffiliates';
import {
  FiArrowLeft,
  FiMail,
  FiSmartphone,
  FiMapPin,
  FiCreditCard,
  FiCheckCircle,
  FiXCircle,
  FiEdit,
  FiTrash2
} from 'react-icons/fi';

interface AffiliateDetailsViewProps {
  affiliate: Affiliate;
  onBack: () => void;
  // Note: Old dummy action handlers removed. Real mutations are used now.
  onApprove?: (id: string, name: string) => void;
  onSuspend?: (id: string, name: string) => void;
  onDeactivate?: (id: string, name: string) => void;
  onDelete?: (id: string, name: string) => void;
  onUpdateUssdCode?: (id: string, newCode: string) => void;
}

export const AffiliateDetailsView: React.FC<AffiliateDetailsViewProps> = ({
  affiliate: initialAffiliate,
  onBack
}) => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();

  // Queries & Mutations
  const { data: detailData, isLoading } = useAdminAffiliateDetail(initialAffiliate.id);
  const affiliate = detailData || initialAffiliate;

  const approveMutation = useApproveAdminAffiliate(affiliate.id);
  const rejectMutation = useRejectAdminAffiliate(affiliate.id);
  const updateMutation = useUpdateAdminAffiliate(affiliate.id);
  const deleteMutation = useDeleteAdminAffiliate();

  // Modals state
  const [isEditUssdOpen, setIsEditUssdOpen] = useState(false);
  const [ussdInput, setUssdInput] = useState(`*713*${affiliate.id.replace('AFF-', '59') || '5912'}*1#`);
  
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: affiliate.name,
    phone: affiliate.phone || '',
    // location is not in schema anymore, but assuming we can still update something
  });

  const initials = affiliate.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ussdInput.trim()) return;
    approveMutation.mutate({ ussdCode: ussdInput.trim() }, {
      onSuccess: () => {
        setIsEditUssdOpen(false);
        addToast({ title: 'Application Approved', message: `${affiliate.name} is now approved!`, type: 'success' });
      },
      onError: () => {
        addToast({ title: 'Approval Failed', message: 'Could not approve. Check if USSD code is unique.', type: 'error' });
      }
    });
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    rejectMutation.mutate({ rejectionReason }, {
      onSuccess: () => {
        setIsRejectOpen(false);
        addToast({ title: 'Application Rejected', message: `${affiliate.name}'s application rejected.`, type: 'info' });
      }
    });
  };

  const handleUpdateStatus = (status: 'ACTIVE' | 'SUSPENDED' | 'REJECTED') => {
    updateMutation.mutate({ status }, {
      onSuccess: () => {
        addToast({ title: 'Status Updated', message: `Affiliate status changed to ${status}.`, type: 'success' });
      }
    });
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ phoneNumber: profileData.phone }, {
      onSuccess: () => {
        setIsEditProfileOpen(false);
        addToast({ title: 'Profile Updated', message: 'Affiliate details updated successfully.', type: 'success' });
      }
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to completely delete this affiliate? This action cannot be undone.')) {
      deleteMutation.mutate(affiliate.id, {
        onSuccess: () => {
          addToast({ title: 'Affiliate Deleted', message: 'Partner profile removed permanently.', type: 'success' });
          onBack();
        }
      });
    }
  };

  const isApproved = affiliate.status === 'ACTIVE';
  const isPending = affiliate.status === 'PENDING';
  const isSuspended = affiliate.status === 'SUSPENDED';

  if (isLoading && !detailData && !initialAffiliate) {
    return <div className="p-10 text-center">Loading details...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className={`inline-flex items-center gap-2 text-xs font-black transition-colors ${
            isLight ? 'text-slate-700 hover:text-slate-950' : 'text-slate-300 hover:text-white'
          }`}
        >
          <FiArrowLeft className="w-4 h-4 text-[#0F8B8D] dark:text-teal-400" />
          <span>Back to Affiliates Management</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {isPending && (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsRejectOpen(true)} leftIcon={<FiXCircle />} className="font-black text-xs h-9 px-4 rounded-xl shadow-xs text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950">
                Reject
              </Button>
              <Button variant={isLight ? 'primary' : 'gradient'} size="sm" onClick={() => setIsEditUssdOpen(true)} leftIcon={<FiCheckCircle />} className="font-black text-xs h-9 px-4 rounded-xl shadow-md">
                Approve Application
              </Button>
            </>
          )}

          {isApproved && (
            <button type="button" onClick={() => handleUpdateStatus('SUSPENDED')} className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 text-slate-950 hover:bg-amber-600 shadow-xs transition-all">
              Suspend Account
            </button>
          )}

          {isSuspended && (
            <button type="button" onClick={() => handleUpdateStatus('ACTIVE')} className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-all">
              Re-Activate Account
            </button>
          )}

          <button type="button" onClick={() => setIsEditProfileOpen(true)} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${isLight ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}`}>
            <FiEdit className="inline mr-1 mb-0.5" /> Edit
          </button>

          <button type="button" onClick={handleDelete} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${isLight ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100 hover:border-rose-400' : 'bg-rose-950/40 border-rose-900/50 text-rose-400 hover:bg-rose-900/60'}`}>
            <FiTrash2 className="inline mr-1 mb-0.5" /> Delete Profile
          </button>
        </div>
      </div>

      {/* Main Banner Card */}
      <div className={`p-6 rounded-3xl border transition-all shadow-sm ${isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-md ${isApproved ? 'bg-emerald-800 text-white' : isPending ? 'bg-amber-500 text-slate-950' : 'bg-rose-800 text-white'}`}>
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className={`text-2xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  {affiliate.name}
                </h1>
                <Badge variant={isApproved ? 'success' : isPending ? 'warning' : 'error'} className="font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
                  {affiliate.status}
                </Badge>
              </div>

              <p className={`text-xs font-mono font-bold mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {affiliate.id}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-bold mt-2.5">
                <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <FiMail className="text-[#0F8B8D] dark:text-teal-400" /> {affiliate.email}
                </span>
                <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <FiSmartphone className="text-[#0F8B8D] dark:text-teal-400" /> {affiliate.phone || 'N/A'}
                </span>
              </div>
            </div>
          </div>
          
          {isApproved && (
            <div className={`p-4 rounded-2xl border min-w-[240px] flex flex-col items-center justify-center text-center ${isLight ? 'bg-emerald-50/70 border-emerald-300' : 'bg-emerald-950/20 border-emerald-500/30'}`}>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                ASSIGNED USSD CODE
              </span>
              <p className="text-xl font-mono font-black text-emerald-950 dark:text-emerald-300 my-1">
                {/* Note: In a real app this would be fetched from affiliate.ussdCode if added to schema */}
                *713*5912*1#
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className={`p-5 rounded-3xl border transition-all shadow-sm ${isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'}`}>
          <span className={`text-[11px] font-black uppercase tracking-wider block mb-2 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            VOUCHERS SOLD
          </span>
          <p className={`text-3xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
            {affiliate.totalSales}
          </p>
          <p className={`text-xs font-bold mt-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Total vouchers completed
          </p>
        </div>

        <div className={`p-5 rounded-3xl border transition-all shadow-sm ${isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'}`}>
          <span className={`text-[11px] font-black uppercase tracking-wider block mb-2 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            TOTAL EARNINGS
          </span>
          <p className="text-3xl font-black tracking-tight text-emerald-700 dark:text-emerald-400">
            {formatCedi(affiliate.totalEarnings)}
          </p>
          <p className={`text-xs font-bold mt-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Lifetime commission earned
          </p>
        </div>

        <div className={`p-5 rounded-3xl border transition-all shadow-sm ${isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'}`}>
          <span className={`text-[11px] font-black uppercase tracking-wider block mb-2 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            AVAILABLE BALANCE
          </span>
          <p className="text-3xl font-black tracking-tight text-amber-600 dark:text-amber-400">
            {formatCedi(affiliate.pendingBalance)}
          </p>
          <p className={`text-xs font-bold mt-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Commission available for payout
          </p>
        </div>
      </div>

      {/* 2 Detail Grid Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-3xl border transition-all shadow-sm space-y-4 ${isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'}`}>
          <h3 className={`text-base font-black tracking-tight border-b pb-3 ${isLight ? 'border-slate-200 text-slate-950' : 'border-slate-800 text-white'}`}>
            Personal & Business Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Full Name</span>
              <span className={`font-black text-sm block mt-0.5 ${isLight ? 'text-slate-950' : 'text-white'}`}>{affiliate.name}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Partner Ref Code</span>
              <span className={`font-mono font-black text-sm block mt-0.5 ${isLight ? 'text-[#0B2545]' : 'text-teal-400'}`}>{affiliate.referralCode}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Email Address</span>
              <span className={`font-black block mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{affiliate.email}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Phone Contact</span>
              <span className={`font-black block mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{affiliate.phone || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Registered On</span>
              <span className={`font-black block mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{new Date(affiliate.joinedAt).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Total Orders</span>
              <span className={`font-black block mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{affiliate.totalOrders}</span>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-3xl border transition-all shadow-sm space-y-4 ${isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'}`}>
          <h3 className={`text-base font-black tracking-tight border-b pb-3 ${isLight ? 'border-slate-200 text-slate-950' : 'border-slate-800 text-white'}`}>
            Payout Accounts
          </h3>
          <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                <FiCreditCard /> Mobile Money Payout Account
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                ACTIVE ROUTING
              </span>
            </div>
            <p className={`text-base font-mono font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {affiliate.phone || 'N/A'}
            </p>
            <p className={`text-xs font-bold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              Account Holder: {affiliate.name}
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      
      {/* Approve Modal (Assign USSD) */}
      <Modal isOpen={isEditUssdOpen} onClose={() => setIsEditUssdOpen(false)} title="Approve & Assign USSD Code">
        <form onSubmit={handleApprove} className="space-y-4">
          <div>
            <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
              Assign USSD Shortcode Extension
            </label>
            <input
              type="text"
              required
              value={ussdInput}
              onChange={(e) => setUssdInput(e.target.value)}
              placeholder="*920*15#"
              className={`w-full rounded-2xl px-4 py-2.5 text-xs font-mono font-bold border focus:outline-none ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
              }`}
            />
            <p className="text-xs text-slate-500 mt-2">
              This code must be globally unique across all active affiliates.
            </p>
          </div>
          <div className={`flex items-center justify-end gap-3 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsEditUssdOpen(false)} className="font-bold text-xs">
              Cancel
            </Button>
            <Button variant={isLight ? 'primary' : 'gradient'} size="sm" type="submit" isLoading={approveMutation.isPending} className="font-black text-xs px-5 rounded-xl">
              Approve Partner
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={isRejectOpen} onClose={() => setIsRejectOpen(false)} title="Reject Application">
        <form onSubmit={handleReject} className="space-y-4">
          <div>
            <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
              Rejection Reason (Optional)
            </label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="E.g., Incomplete business credentials"
              className={`w-full rounded-2xl px-4 py-2.5 text-xs font-bold border focus:outline-none ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
              }`}
            />
          </div>
          <div className={`flex items-center justify-end gap-3 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsRejectOpen(false)} className="font-bold text-xs">
              Cancel
            </Button>
            <Button variant="outline" size="sm" type="submit" isLoading={rejectMutation.isPending} className="font-black text-xs px-5 rounded-xl text-rose-600 border-rose-300">
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} title="Edit Affiliate Details">
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase mb-1">Phone Number</label>
            <input type="text" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className={`w-full p-2 text-sm border rounded-xl ${isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700 text-white'}`} />
          </div>
          <div className={`flex items-center justify-end gap-3 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsEditProfileOpen(false)} className="font-bold text-xs">Cancel</Button>
            <Button variant="primary" size="sm" type="submit" isLoading={updateMutation.isPending} className="font-black text-xs px-5 rounded-xl">Save Changes</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
