import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Modal } from '../../ui/Modal';
import { useToast } from '../../ui/Toast';
import { formatCedi } from '../../../utils/formatters';
import {
  FiArrowLeft,
  FiMail,
  FiSmartphone,
  FiMapPin,
  FiCreditCard,
  FiCheckCircle
} from 'react-icons/fi';

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  ussdCode?: string;
  location?: string;
  totalSales: number;
  totalCommission: number;
  availableBalance?: number;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  appliedDate: string;
}

interface AffiliateDetailsViewProps {
  affiliate: Affiliate;
  onBack: () => void;
  onApprove: (id: string, name: string) => void;
  onSuspend: (id: string, name: string) => void;
  onDeactivate: (id: string, name: string) => void;
  onDelete: (id: string, name: string) => void;
  onUpdateUssdCode: (id: string, newCode: string) => void;
}

export const AffiliateDetailsView: React.FC<AffiliateDetailsViewProps> = ({
  affiliate,
  onBack,
  onApprove,
  onSuspend,
  onDeactivate,
  onDelete,
  onUpdateUssdCode
}) => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();

  const [isEditUssdOpen, setIsEditUssdOpen] = useState(false);
  const [ussdInput, setUssdInput] = useState(affiliate.ussdCode || `*713*${affiliate.id.replace('AFF-', '59') || '5912'}*1#`);

  const initials = affiliate.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleSaveUssd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ussdInput.trim()) return;
    onUpdateUssdCode(affiliate.id, ussdInput.trim());
    setIsEditUssdOpen(false);
    addToast({
      title: 'USSD Code Updated',
      message: `Assigned shortcode ${ussdInput.trim()} to ${affiliate.name}.`,
      type: 'success',
      duration: 3500
    });
  };

  const isApproved = affiliate.status === 'ACTIVE';
  const isPending = affiliate.status === 'PENDING';
  const isSuspended = affiliate.status === 'SUSPENDED';

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
            <Button
              variant={isLight ? 'primary' : 'gradient'}
              size="sm"
              onClick={() => onApprove(affiliate.id, affiliate.name)}
              leftIcon={<FiCheckCircle />}
              className="font-black text-xs h-9 px-4 rounded-xl shadow-md"
            >
              Approve Partner Application
            </Button>
          )}

          {isApproved && (
            <button
              type="button"
              onClick={() => onSuspend(affiliate.id, affiliate.name)}
              className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 text-slate-950 hover:bg-amber-600 shadow-xs transition-all"
            >
              Suspend Account
            </button>
          )}

          {isSuspended && (
            <button
              type="button"
              onClick={() => onApprove(affiliate.id, affiliate.name)}
              className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-all"
            >
              Re-Activate Account
            </button>
          )}

          <button
            type="button"
            onClick={() => onDeactivate(affiliate.id, affiliate.name)}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
              isLight
                ? 'bg-slate-800 text-white border-slate-800 hover:bg-slate-900'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            Deactivate Account
          </button>

          <button
            type="button"
            onClick={() => onDelete(affiliate.id, affiliate.name)}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
              isLight
                ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100 hover:border-rose-400'
                : 'bg-rose-950/40 border-rose-900/50 text-rose-400 hover:bg-rose-900/60'
            }`}
          >
            Delete Profile
          </button>
        </div>
      </div>

      {/* Main Banner Card */}
      <div className={`p-6 rounded-3xl border transition-all shadow-sm ${
        isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Partner Info Left */}
          <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-md ${
              isApproved
                ? 'bg-emerald-800 text-white'
                : isPending
                ? 'bg-amber-500 text-slate-950'
                : 'bg-rose-800 text-white'
            }`}>
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className={`text-2xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  {affiliate.name}
                </h1>
                <Badge
                  variant={isApproved ? 'success' : isPending ? 'warning' : 'error'}
                  className="font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs"
                >
                  {isApproved ? 'APPROVED' : affiliate.status}
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
                  <FiSmartphone className="text-[#0F8B8D] dark:text-teal-400" /> {affiliate.phone}
                </span>
                <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <FiMapPin className="text-[#0F8B8D] dark:text-teal-400" /> {affiliate.location || 'Accra, Ghana'}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned USSD Code Box Right */}
          <div className={`p-4 rounded-2xl border min-w-[240px] flex flex-col items-center justify-center text-center ${
            isLight ? 'bg-emerald-50/70 border-emerald-300' : 'bg-emerald-950/20 border-emerald-500/30'
          }`}>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
              ASSIGNED USSD CODE
            </span>
            <p className="text-xl font-mono font-black text-emerald-950 dark:text-emerald-300 my-1">
              {affiliate.ussdCode || `*713*${affiliate.id.replace('AFF-', '59') || '5912'}*1#`}
            </p>
            <button
              type="button"
              onClick={() => setIsEditUssdOpen(true)}
              className="text-xs font-black text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
            >
              Edit USSD Code →
            </button>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* 1. VOUCHERS SOLD */}
        <div className={`p-5 rounded-3xl border transition-all shadow-sm ${
          isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <span className={`text-[11px] font-black uppercase tracking-wider block mb-2 ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            VOUCHERS SOLD
          </span>
          <p className={`text-3xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
            {affiliate.totalSales || 1}
          </p>
          <p className={`text-xs font-bold mt-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Total vouchers completed
          </p>
        </div>

        {/* 2. TOTAL SALES GENERATED */}
        <div className={`p-5 rounded-3xl border transition-all shadow-sm ${
          isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <span className={`text-[11px] font-black uppercase tracking-wider block mb-2 ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            TOTAL SALES GENERATED
          </span>
          <p className="text-3xl font-black tracking-tight text-emerald-700 dark:text-emerald-400">
            {formatCedi(affiliate.totalSales > 0 ? affiliate.totalSales * 30 : 30)}
          </p>
          <p className={`text-xs font-bold mt-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Revenue via USSD channel
          </p>
        </div>

        {/* 3. AVAILABLE BALANCE */}
        <div className={`p-5 rounded-3xl border transition-all shadow-sm ${
          isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <span className={`text-[11px] font-black uppercase tracking-wider block mb-2 ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            AVAILABLE BALANCE
          </span>
          <p className="text-3xl font-black tracking-tight text-amber-600 dark:text-amber-400">
            {formatCedi(affiliate.availableBalance || 0)}
          </p>
          <p className={`text-xs font-bold mt-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Commission available for payout
          </p>
        </div>
      </div>

      {/* 2 Detail Grid Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal & Business Details */}
        <div className={`p-6 rounded-3xl border transition-all shadow-sm space-y-4 ${
          isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <h3 className={`text-base font-black tracking-tight border-b pb-3 ${
            isLight ? 'border-slate-200 text-slate-950' : 'border-slate-800 text-white'
          }`}>
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
              <span className={`font-black block mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{affiliate.phone}</span>
            </div>

            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Location / City</span>
              <span className={`font-black block mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{affiliate.location || 'Accra, Ghana'}</span>
            </div>

            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Registered On</span>
              <span className={`font-black block mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{affiliate.appliedDate}</span>
            </div>
          </div>
        </div>

        {/* Payout Accounts */}
        <div className={`p-6 rounded-3xl border transition-all shadow-sm space-y-4 ${
          isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <h3 className={`text-base font-black tracking-tight border-b pb-3 ${
            isLight ? 'border-slate-200 text-slate-950' : 'border-slate-800 text-white'
          }`}>
            Payout Accounts
          </h3>

          <div className={`p-4 rounded-2xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                <FiCreditCard /> Mobile Money Payout Account
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                ACTIVE ROUTING
              </span>
            </div>
            <p className={`text-base font-mono font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {affiliate.phone}
            </p>
            <p className={`text-xs font-bold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              Account Holder: {affiliate.name}
            </p>
          </div>
        </div>
      </div>

      {/* Edit USSD Code Modal */}
      <Modal isOpen={isEditUssdOpen} onClose={() => setIsEditUssdOpen(false)} title="Configure Partner USSD Shortcode">
        <form onSubmit={handleSaveUssd} className="space-y-4">
          <div>
            <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
              USSD Shortcode Pattern
            </label>
            <input
              type="text"
              required
              value={ussdInput}
              onChange={(e) => setUssdInput(e.target.value)}
              placeholder="*713*5912*1#"
              className={`w-full rounded-2xl px-4 py-2.5 text-xs font-mono font-bold border focus:outline-none ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
              }`}
            />
          </div>
          <div className={`flex items-center justify-end gap-3 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsEditUssdOpen(false)} className="font-bold text-xs">
              Cancel
            </Button>
            <Button variant={isLight ? 'primary' : 'gradient'} size="sm" type="submit" className="font-black text-xs px-5 rounded-xl">
              Save USSD Code
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
