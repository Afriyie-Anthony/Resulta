import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Modal } from '../../ui/Modal';
import { useToast } from '../../ui/Toast';
import { formatCedi } from '../../../utils/formatters';
import type { Affiliate } from '../../../schemas/affiliate';
import {
  useAdminAffiliateDetail,
  useAdminAffiliateConfig,
  useApproveAdminAffiliate,
  useRejectAdminAffiliate,
  useUpdateAdminAffiliate,
  useDeleteAdminAffiliate
} from '../../../hooks/useAdminAffiliates';
import {
  FiArrowLeft,
  FiMail,
  FiSmartphone,
  FiCreditCard,
  FiCheckCircle,
  FiXCircle,
  FiEdit,
  FiTrash2,
  FiMapPin,
  FiBriefcase,
  FiPercent,
  FiRotateCcw
} from 'react-icons/fi';

interface AffiliateDetailsViewProps {
  affiliate: Affiliate;
  onBack: () => void;
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
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  // Queries & Mutations
  const { data: detailData, isLoading } = useAdminAffiliateDetail(initialAffiliate.id);
  const { data: globalConfig } = useAdminAffiliateConfig();
  const affiliate = detailData || initialAffiliate;

  const approveMutation = useApproveAdminAffiliate(affiliate.id);
  const rejectMutation = useRejectAdminAffiliate(affiliate.id);
  const updateMutation = useUpdateAdminAffiliate(affiliate.id);
  const deleteMutation = useDeleteAdminAffiliate();

  // Modals state
  const [isEditUssdOpen, setIsEditUssdOpen] = useState(false);
  const [ussdInput, setUssdInput] = useState(
    affiliate.ussdCode || `*713*${affiliate.id.replace(/[^0-9]/g, '') || '5912'}*1#`
  );
  
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Dedicated Individual Commission Override Modal State
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [commissionInput, setCommissionInput] = useState(
    affiliate.commissionPercentage !== undefined && affiliate.commissionPercentage !== null
      ? String(affiliate.commissionPercentage)
      : affiliate.commissionRate !== undefined && affiliate.commissionRate !== null
      ? String(affiliate.commissionRate)
      : ''
  );

  useEffect(() => {
    if (affiliate) {
      if (affiliate.ussdCode) {
        setUssdInput(affiliate.ussdCode);
      }
      setCommissionInput(
        affiliate.commissionPercentage !== undefined && affiliate.commissionPercentage !== null
          ? String(affiliate.commissionPercentage)
          : affiliate.commissionRate !== undefined && affiliate.commissionRate !== null
          ? String(affiliate.commissionRate)
          : ''
      );
    }
  }, [affiliate]);

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
      onError: (err: any) => {
        addToast({ title: 'Approval Failed', message: err.response?.data?.message || 'Could not approve. Check if USSD code is unique.', type: 'error' });
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

  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    const commVal = commissionInput.trim() !== '' ? Number(commissionInput) : undefined;
    updateMutation.mutate(
      {
        commissionPercentage: commVal,
        commissionRate: commVal,
      },
      {
        onSuccess: () => {
          setIsCommissionModalOpen(false);
          addToast({
            title: 'Commission Rate Updated',
            message: commVal !== undefined
              ? `Individual commission rate set to ${commVal}% for ${affiliate.name}.`
              : `Custom override cleared. ${affiliate.name} will now inherit the global rate.`,
            type: 'success',
          });
        },
        onError: (err: any) => {
          addToast({
            title: 'Update Failed',
            message: err.response?.data?.message || 'Could not update commission rate.',
            type: 'error',
          });
        },
      }
    );
  };

  const handleClearCommissionToGlobal = () => {
    setCommissionInput('');
    updateMutation.mutate(
      {
        commissionPercentage: undefined,
        commissionRate: undefined,
      },
      {
        onSuccess: () => {
          setIsCommissionModalOpen(false);
          addToast({
            title: 'Reverted to Global Default',
            message: `${affiliate.name} is now using the global platform commission rate.`,
            type: 'info',
          });
        },
        onError: (err: any) => {
          addToast({
            title: 'Update Failed',
            message: err.response?.data?.message || 'Could not revert commission rate.',
            type: 'error',
          });
        },
      }
    );
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(affiliate.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        addToast({ title: 'Affiliate Deleted', message: 'Partner profile removed permanently.', type: 'success' });
        onBack();
      },
      onError: (err: any) => {
        addToast({
          title: 'Delete Failed',
          message: err.response?.data?.message || 'Could not delete affiliate.',
          type: 'error',
        });
      }
    });
  };

  const isApproved = affiliate.status === 'ACTIVE';
  const isPending = affiliate.status === 'PENDING';
  const isSuspended = affiliate.status === 'SUSPENDED';
  const displayCommission = affiliate.commissionPercentage ?? affiliate.commissionRate;
  const globalDefaultRate = globalConfig?.commissionPercentage ?? 10;

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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRejectOpen(true)}
                leftIcon={<FiXCircle />}
                className="font-black text-xs h-9 px-4 rounded-xl shadow-xs text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950"
              >
                Reject
              </Button>
              <Button
                variant={isLight ? 'primary' : 'gradient'}
                size="sm"
                onClick={() => setIsEditUssdOpen(true)}
                leftIcon={<FiCheckCircle />}
                className="font-black text-xs h-9 px-4 rounded-xl shadow-md"
              >
                Approve Application
              </Button>
            </>
          )}

          {isApproved && (
            <button
              type="button"
              onClick={() => handleUpdateStatus('SUSPENDED')}
              className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 text-slate-950 hover:bg-amber-600 shadow-xs transition-all"
            >
              Suspend Account
            </button>
          )}

          {isSuspended && (
            <button
              type="button"
              onClick={() => handleUpdateStatus('ACTIVE')}
              className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-all"
            >
              Re-Activate Account
            </button>
          )}

          {/* Dedicated Individual Commission Override Button */}
          <button
            type="button"
            onClick={() => setIsCommissionModalOpen(true)}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
              isLight
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 shadow-2xs'
                : 'bg-teal-950/60 text-teal-300 border-teal-700/60 hover:bg-teal-900/60'
            }`}
          >
            <FiPercent className="inline mr-1 mb-0.5" /> Set Commission
          </button>

          {/* Dedicated Edit Profile Page Button */}
          <button
            type="button"
            onClick={() => navigate(`/admin/affiliates/${affiliate.id}/edit`)}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
              isLight
                ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-2xs'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <FiEdit className="inline mr-1 mb-0.5" /> Edit Profile
          </button>

          {isSuperAdmin && (
            <button
              type="button"
              onClick={handleDelete}
              className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                isLight
                  ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100 hover:border-rose-400'
                  : 'bg-rose-950/40 border-rose-900/50 text-rose-400 hover:bg-rose-900/60'
              }`}
            >
              <FiTrash2 className="inline mr-1 mb-0.5" /> Delete Profile
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-all shadow-sm ${
          isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${
                isLight
                  ? 'bg-[#0F8B8D]/15 text-[#0F8B8D] border border-[#0F8B8D]/20'
                  : 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
              }`}
            >
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2
                  className={`text-2xl font-black tracking-tight ${
                    isLight ? 'text-slate-950' : 'text-white'
                  }`}
                >
                  {affiliate.name}
                </h2>
                {affiliate.businessName && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    <FiBriefcase className="inline mr-1" />
                    {affiliate.businessName}
                  </span>
                )}
                <Badge
                  variant={
                    affiliate.status === 'ACTIVE'
                      ? 'success'
                      : affiliate.status === 'PENDING'
                      ? 'warning'
                      : 'error'
                  }
                  className="text-xs font-black tracking-wider uppercase px-3 py-1"
                >
                  {affiliate.status}
                </Badge>
              </div>

              <p
                className={`text-xs font-mono font-bold mt-0.5 ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {affiliate.id}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-bold mt-2.5">
                <span
                  className={`flex items-center gap-1.5 ${
                    isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  <FiMail className="text-[#0F8B8D] dark:text-teal-400" /> {affiliate.email}
                </span>
                <span
                  className={`flex items-center gap-1.5 ${
                    isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  <FiSmartphone className="text-[#0F8B8D] dark:text-teal-400" />{' '}
                  {affiliate.phone || 'N/A'}
                </span>
                {affiliate.location && (
                  <span
                    className={`flex items-center gap-1.5 ${
                      isLight ? 'text-slate-700' : 'text-slate-300'
                    }`}
                  >
                    <FiMapPin className="text-[#0F8B8D] dark:text-teal-400" /> {affiliate.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {(affiliate.ussdCode || isApproved) && (
            <div
              className={`p-4 rounded-2xl border min-w-[240px] flex flex-col items-center justify-center text-center shadow-2xs ${
                isLight
                  ? 'bg-slate-50 border-slate-300'
                  : 'bg-slate-950/60 border-slate-700'
              }`}
            >
              <span
                className={`text-[10px] font-black uppercase tracking-wider ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}
              >
                ASSIGNED USSD CODE
              </span>
              <p
                className={`text-xl font-mono font-black my-1 ${
                  isLight ? 'text-[#0F8B8D]' : 'text-teal-300'
                }`}
              >
                {affiliate.ussdCode || '*713*5912*1#'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          className={`p-5 rounded-3xl border transition-all shadow-sm ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <span
            className={`text-[11px] font-black uppercase tracking-wider block mb-2 ${
              isLight ? 'text-slate-700' : 'text-slate-400'
            }`}
          >
            VOUCHERS SOLD
          </span>
          <p
            className={`text-3xl font-black tracking-tight ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}
          >
            {affiliate.totalSales}
          </p>
          <p
            className={`text-xs font-bold mt-2 ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            Total vouchers completed
          </p>
        </div>

        <div
          className={`p-5 rounded-3xl border transition-all shadow-sm ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <span
            className={`text-[11px] font-black uppercase tracking-wider block mb-2 ${
              isLight ? 'text-slate-700' : 'text-slate-400'
            }`}
          >
            TOTAL EARNINGS
          </span>
          <p className="text-3xl font-black tracking-tight text-emerald-700 dark:text-emerald-400">
            {formatCedi(affiliate.totalEarnings)}
          </p>
          <p
            className={`text-xs font-bold mt-2 ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            Lifetime commission earned
          </p>
        </div>

        <div
          className={`p-5 rounded-3xl border transition-all shadow-sm ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <span
            className={`text-[11px] font-black uppercase tracking-wider block mb-2 ${
              isLight ? 'text-slate-700' : 'text-slate-400'
            }`}
          >
            AVAILABLE BALANCE
          </span>
          <p className="text-3xl font-black tracking-tight text-amber-600 dark:text-amber-400">
            {formatCedi(affiliate.pendingBalance)}
          </p>
          <p
            className={`text-xs font-bold mt-2 ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            Commission available for payout
          </p>
        </div>

        {/* Separated Commission Rate Card */}
        <div
          className={`p-5 rounded-3xl border transition-all shadow-sm ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[11px] font-black uppercase tracking-wider block ${
                isLight ? 'text-slate-700' : 'text-slate-400'
              }`}
            >
              COMMISSION RATE
            </span>
            <button
              type="button"
              onClick={() => setIsCommissionModalOpen(true)}
              className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-[#0F8B8D]/10 dark:bg-teal-500/20 text-[#0F8B8D] dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <FiPercent className="w-3 h-3" />
              {displayCommission !== undefined && displayCommission !== null && displayCommission !== ''
                ? 'Edit Override'
                : 'Set Override'}
            </button>
          </div>
          <p
            className={`text-3xl font-black tracking-tight ${
              isLight ? 'text-[#0F8B8D]' : 'text-teal-400'
            }`}
          >
            {displayCommission !== undefined && displayCommission !== null && displayCommission !== ''
              ? `${displayCommission}%`
              : `${globalDefaultRate}%`}
          </p>
          <p
            className={`text-xs font-bold mt-2 ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            {displayCommission !== undefined && displayCommission !== null && displayCommission !== ''
              ? 'Partner specific override active'
              : `Inheriting global platform rate (${globalDefaultRate}%)`}
          </p>
        </div>
      </div>

      {/* 2 Detail Grid Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal & Business Details */}
        <div
          className={`p-6 rounded-3xl border transition-all shadow-sm space-y-4 ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3">
            <h3
              className={`text-base font-black tracking-tight ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}
            >
              Personal &amp; Business Details
            </h3>
            <button
              type="button"
              onClick={() => navigate(`/admin/affiliates/${affiliate.id}/edit`)}
              className={`text-xs font-bold flex items-center gap-1 ${
                isLight ? 'text-[#0F8B8D] hover:text-[#0B2545]' : 'text-teal-400 hover:text-teal-300'
              }`}
            >
              <FiEdit className="w-3.5 h-3.5" /> Edit Page &rarr;
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Full Name</span>
              <span
                className={`font-black text-sm block mt-0.5 ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}
              >
                {affiliate.name}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Partner Ref Code</span>
              <span
                className={`font-mono font-black text-sm block mt-0.5 ${
                  isLight ? 'text-[#0B2545]' : 'text-teal-400'
                }`}
              >
                {affiliate.referralCode}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Business Name</span>
              <span
                className={`font-black block mt-0.5 ${
                  isLight ? 'text-slate-900' : 'text-slate-200'
                }`}
              >
                {affiliate.businessName || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Location / Region</span>
              <span
                className={`font-black block mt-0.5 ${
                  isLight ? 'text-slate-900' : 'text-slate-200'
                }`}
              >
                {affiliate.location || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Commission Structure</span>
              <span className="font-black block mt-0.5 text-emerald-700 dark:text-emerald-400">
                {displayCommission !== undefined && displayCommission !== null && displayCommission !== ''
                  ? `${displayCommission}% (Custom Override)`
                  : `Global Platform Default (${globalDefaultRate}%)`}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Phone Contact</span>
              <span
                className={`font-black block mt-0.5 ${
                  isLight ? 'text-slate-900' : 'text-slate-200'
                }`}
              >
                {affiliate.phone || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Registered On</span>
              <span
                className={`font-black block mt-0.5 ${
                  isLight ? 'text-slate-900' : 'text-slate-200'
                }`}
              >
                {new Date(affiliate.joinedAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Total Orders</span>
              <span
                className={`font-black block mt-0.5 ${
                  isLight ? 'text-slate-900' : 'text-slate-200'
                }`}
              >
                {affiliate.totalOrders}
              </span>
            </div>
          </div>
        </div>

        {/* Payout Accounts */}
        <div
          className={`p-6 rounded-3xl border transition-all shadow-sm space-y-4 ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3">
            <h3
              className={`text-base font-black tracking-tight ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}
            >
              Payout Accounts
            </h3>
            <button
              type="button"
              onClick={() => navigate(`/admin/affiliates/${affiliate.id}/edit`)}
              className={`text-xs font-bold flex items-center gap-1 ${
                isLight ? 'text-[#0F8B8D] hover:text-[#0B2545]' : 'text-teal-400 hover:text-teal-300'
              }`}
            >
              <FiEdit className="w-3.5 h-3.5" /> Edit Page &rarr;
            </button>
          </div>
          <div
            className={`p-4 rounded-2xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                <FiCreditCard />{' '}
                {affiliate.paymentChannel === 'BANK'
                  ? 'Bank Payout Account'
                  : 'Mobile Money Payout Account'}
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                ACTIVE ROUTING
              </span>
            </div>
            <p
              className={`text-base font-mono font-black ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}
            >
              {affiliate.accountNumber || affiliate.phone || 'N/A'}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Account Holder
                </span>
                <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  {affiliate.accountName || affiliate.name}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Channel / Provider
                </span>
                <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  {affiliate.paymentChannel === 'BANK'
                    ? affiliate.bankName || 'Bank Transfer'
                    : affiliate.network || 'Mobile Money'}
                </span>
              </div>
            </div>
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

      {/* Dedicated Separated Individual Commission Modal */}
      <Modal
        isOpen={isCommissionModalOpen}
        onClose={() => setIsCommissionModalOpen(false)}
        title="Individual Partner Commission Override"
        size="md"
      >
        <form onSubmit={handleSaveCommission} className="space-y-5">
          {/* Header Info Banner */}
          <div
            className={`p-4 rounded-2xl border ${
              isLight
                ? 'bg-slate-100/90 border-slate-300 text-slate-900'
                : 'bg-slate-900/90 border-slate-700 text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`p-1.5 rounded-lg ${
                    isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/20 text-teal-400'
                  }`}
                >
                  <FiPercent className="w-4 h-4" />
                </div>
                <span
                  className={`text-xs font-black uppercase tracking-wider ${
                    isLight ? 'text-slate-950' : 'text-white'
                  }`}
                >
                  Partner Commission Override
                </span>
              </div>
              <span
                className={`text-xs font-black px-2.5 py-1 rounded-lg border ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-900 shadow-2xs'
                    : 'bg-slate-800 border-slate-600 text-teal-300'
                }`}
              >
                {affiliate.name}
              </span>
            </div>
            <p
              className={`text-xs font-semibold leading-relaxed ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
              Define a specific commission percentage for this affiliate. When left blank, the partner automatically inherits the global platform default rate (
              <span className={`font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                {globalDefaultRate}%
              </span>
              ).
            </p>
          </div>

          {/* Commission Input Field */}
          <div className="space-y-1.5">
            <label
              className={`block text-xs font-black uppercase tracking-wider ${
                isLight ? 'text-slate-950' : 'text-slate-200'
              }`}
            >
              Commission Percentage (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0"
                max="100"
                value={commissionInput}
                onChange={(e) => setCommissionInput(e.target.value)}
                placeholder={`e.g. ${globalDefaultRate} (Leave empty for global rate)`}
                className={`w-full px-4 py-3 pr-10 text-sm font-black border rounded-2xl focus:outline-none transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-950 placeholder:text-slate-400 focus:border-[#0F8B8D] focus:bg-white'
                    : 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-400'
                }`}
              />
              <span
                className={`absolute right-4 top-1/2 -translate-y-1/2 font-black text-sm ${
                  isLight ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                %
              </span>
            </div>
            <p
              className={`text-xs font-bold mt-1.5 flex items-center justify-between ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
              <span>
                Active global platform default:{' '}
                <strong className={isLight ? 'text-slate-950 font-black' : 'text-white font-black'}>
                  {globalDefaultRate}%
                </strong>
              </span>
              {commissionInput && Number(commissionInput) !== globalDefaultRate && (
                <span className="text-emerald-700 dark:text-emerald-400 font-black">
                  Override Active
                </span>
              )}
            </p>
          </div>

          {/* Modal Actions */}
          <div
            className={`flex items-center justify-between pt-4 border-t ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}
          >
            {commissionInput ? (
              <button
                type="button"
                onClick={handleClearCommissionToGlobal}
                disabled={updateMutation.isPending}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
              >
                <FiRotateCcw className="w-3.5 h-3.5" /> Revert to Global ({globalDefaultRate}%)
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setIsCommissionModalOpen(false)}
                className="font-bold text-xs"
              >
                Cancel
              </Button>
              <Button
                variant={isLight ? 'primary' : 'gradient'}
                size="sm"
                type="submit"
                isLoading={updateMutation.isPending}
                className="font-black text-xs px-5 rounded-xl shadow-md"
              >
                Save Override
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Affiliate Profile"
        size="sm"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isLight ? 'bg-rose-100 text-rose-600' : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              <FiTrash2 className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className={`text-sm font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Confirm Permanent Deletion
              </h4>
              <p className={`text-xs font-semibold leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Are you sure you want to completely delete this affiliate? This action cannot be undone.
              </p>
            </div>
          </div>

          <div
            className={`flex items-center justify-end gap-3 pt-4 border-t ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}
          >
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="font-bold text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              isLoading={deleteMutation.isPending}
              onClick={handleConfirmDelete}
              className="font-black text-xs px-5 rounded-xl text-rose-600 border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
