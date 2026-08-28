import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useToast } from '../../../components/ui/Toast';
import {
  useAdminAffiliateDetail,
  useUpdateAdminAffiliate
} from '../../../hooks/useAdminAffiliates';
import {
  FiArrowLeft,
  FiUser,
  FiSmartphone,
  FiBriefcase,
  FiMapPin,
  FiHash,
  FiCreditCard,
  FiCheckCircle,
  FiRefreshCw,
  FiPercent
} from 'react-icons/fi';

export const EditAffiliateView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();

  const affiliateId = id || '';
  const { data: affiliate, isLoading, isError } = useAdminAffiliateDetail(affiliateId);
  const updateMutation = useUpdateAdminAffiliate(affiliateId);

  const [formData, setFormData] = useState({
    businessName: '',
    phoneNumber: '',
    location: '',
    ussdCode: '',
    status: 'ACTIVE' as 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'REJECTED',
    paymentChannel: 'MOBILE_MONEY' as 'MOBILE_MONEY' | 'BANK',
    network: 'MTN',
    bankName: '',
    bankCode: '',
    accountNumber: '',
    accountName: '',
  });

  useEffect(() => {
    if (affiliate) {
      setFormData({
        businessName: affiliate.businessName || '',
        phoneNumber: affiliate.phone || '',
        location: affiliate.location || '',
        ussdCode: affiliate.ussdCode || '',
        status: (affiliate.status as any) || 'PENDING',
        paymentChannel: (affiliate.paymentChannel as 'MOBILE_MONEY' | 'BANK') || 'MOBILE_MONEY',
        network: affiliate.network || 'MTN',
        bankName: affiliate.bankName || '',
        bankCode: affiliate.bankCode || '',
        accountNumber: affiliate.accountNumber || affiliate.phone || '',
        accountName: affiliate.accountName || affiliate.name || '',
      });
    }
  }, [affiliate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliateId) return;

    updateMutation.mutate(
      {
        businessName: formData.businessName || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        location: formData.location || undefined,
        ussdCode: formData.ussdCode || undefined,
        status: formData.status,
        paymentChannel: formData.paymentChannel,
        network: formData.paymentChannel === 'MOBILE_MONEY' ? formData.network || undefined : undefined,
        bankName: formData.paymentChannel === 'BANK' ? formData.bankName || undefined : undefined,
        bankCode: formData.paymentChannel === 'BANK' ? formData.bankCode || undefined : undefined,
        accountNumber: formData.accountNumber || undefined,
        accountName: formData.accountName || undefined,
      },
      {
        onSuccess: () => {
          addToast({
            title: 'Profile Updated',
            message: 'Affiliate profile and payout credentials updated successfully.',
            type: 'success',
          });
          navigate('/admin/affiliates');
        },
        onError: (err: any) => {
          addToast({
            title: 'Update Failed',
            message: err.response?.data?.message || 'Could not update affiliate profile.',
            type: 'error',
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div
        className={`p-16 text-center rounded-3xl border transition-colors ${
          isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <FiRefreshCw className="w-8 h-8 mx-auto mb-3 text-teal-500 animate-spin" />
        <p className={`text-sm font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
          Loading affiliate profile...
        </p>
      </div>
    );
  }

  if (isError || !affiliate) {
    return (
      <div
        className={`p-12 text-center rounded-3xl border transition-colors ${
          isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <p className="text-base font-bold text-rose-600 dark:text-rose-400 mb-3">
          Failed to load affiliate details or affiliate not found.
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/affiliates')}>
          &larr; Back to Affiliates
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/admin/affiliates')}
          className={`inline-flex items-center gap-2 text-xs font-black transition-colors ${
            isLight ? 'text-slate-700 hover:text-slate-950' : 'text-slate-300 hover:text-white'
          }`}
        >
          <FiArrowLeft className="w-4 h-4 text-[#0F8B8D] dark:text-teal-400" />
          <span>Back to Affiliates Management</span>
        </button>

        <div className="flex items-center gap-2">
          <Badge
            variant={
              formData.status === 'ACTIVE'
                ? 'success'
                : formData.status === 'PENDING'
                ? 'warning'
                : 'error'
            }
            className="text-xs font-black uppercase px-3 py-1"
          >
            {formData.status}
          </Badge>
          <span className="text-xs font-mono font-bold text-slate-500">{affiliate.id}</span>
        </div>
      </div>

      {/* Main Title Banner */}
      <div
        className={`p-6 rounded-3xl border shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${
              isLight
                ? 'bg-[#0F8B8D]/15 text-[#0F8B8D] border border-[#0F8B8D]/20'
                : 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
            }`}
          >
            <FiUser className="w-7 h-7" />
          </div>
          <div>
            <h1
              className={`text-2xl font-black tracking-tight ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}
            >
              Edit Profile: {affiliate.name}
            </h1>
            <p className={`text-xs font-semibold mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Update personal information, business registration details, and payout routing credentials.
            </p>
          </div>
        </div>

        {/* Note on Commission Separation */}
        <div
          className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 max-w-sm ${
            isLight
              ? 'bg-slate-100 border-slate-300 text-slate-800'
              : 'bg-slate-950/80 border-slate-700 text-slate-200'
          }`}
        >
          <div
            className={`p-1.5 rounded-lg shrink-0 ${
              isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/20 text-teal-400'
            }`}
          >
            <FiPercent className="w-4 h-4" />
          </div>
          <span className="font-semibold">
            Partner commission rates are configured separately under{' '}
            <strong className={isLight ? 'text-slate-950 font-black' : 'text-white font-black'}>
              Commission Override Settings
            </strong>
            .
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal & Business Credentials */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 transition-all ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="border-b pb-4 flex items-center justify-between">
            <div>
              <h2
                className={`text-base font-black tracking-tight flex items-center gap-2 ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}
              >
                <FiBriefcase className="text-[#0F8B8D] dark:text-teal-400" />
                Personal &amp; Business Information
              </h2>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Core profile identifiers and contact credentials for this partner.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name Display */}
            <div>
              <label
                className={`block text-xs font-black uppercase mb-1.5 ${
                  isLight ? 'text-slate-800' : 'text-slate-300'
                }`}
              >
                Partner Full Name
              </label>
              <input
                type="text"
                disabled
                value={affiliate.name}
                className={`w-full px-4 py-2.5 text-xs font-bold border rounded-2xl cursor-not-allowed opacity-75 ${
                  isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-800'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Partner email: {affiliate.email}
              </span>
            </div>

            {/* Referral Code Display */}
            <div>
              <label
                className={`block text-xs font-black uppercase mb-1.5 ${
                  isLight ? 'text-slate-800' : 'text-slate-300'
                }`}
              >
                Referral Code (Fixed)
              </label>
              <input
                type="text"
                disabled
                value={affiliate.referralCode}
                className={`w-full px-4 py-2.5 text-xs font-mono font-black border rounded-2xl cursor-not-allowed opacity-75 ${
                  isLight
                    ? 'bg-slate-100 border-slate-200 text-[#0B2545]'
                    : 'bg-slate-950 border-slate-800 text-teal-400'
                }`}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label
                className={`block text-xs font-black uppercase mb-1.5 ${
                  isLight ? 'text-slate-800' : 'text-slate-300'
                }`}
              >
                <FiSmartphone className="inline mr-1 text-[#0F8B8D]" /> Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="e.g. 0550807914"
                className={`w-full px-4 py-2.5 text-xs font-bold border rounded-2xl focus:outline-none transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-950 focus:border-[#0F8B8D] focus:bg-white'
                    : 'bg-slate-950 border-slate-700 text-white focus:border-teal-400'
                }`}
              />
            </div>

            {/* Business Name */}
            <div>
              <label
                className={`block text-xs font-black uppercase mb-1.5 ${
                  isLight ? 'text-slate-800' : 'text-slate-300'
                }`}
              >
                Business / Enterprise Name
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Anthony's Voucher Hub"
                className={`w-full px-4 py-2.5 text-xs font-bold border rounded-2xl focus:outline-none transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-950 focus:border-[#0F8B8D] focus:bg-white'
                    : 'bg-slate-950 border-slate-700 text-white focus:border-teal-400'
                }`}
              />
            </div>

            {/* Location / Region */}
            <div>
              <label
                className={`block text-xs font-black uppercase mb-1.5 ${
                  isLight ? 'text-slate-800' : 'text-slate-300'
                }`}
              >
                <FiMapPin className="inline mr-1 text-[#0F8B8D]" /> Location / Region
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Kumasi, Ashanti Region"
                className={`w-full px-4 py-2.5 text-xs font-bold border rounded-2xl focus:outline-none transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-950 focus:border-[#0F8B8D] focus:bg-white'
                    : 'bg-slate-950 border-slate-700 text-white focus:border-teal-400'
                }`}
              />
            </div>

            {/* USSD Shortcode */}
            <div>
              <label
                className={`block text-xs font-black uppercase mb-1.5 ${
                  isLight ? 'text-slate-800' : 'text-slate-300'
                }`}
              >
                <FiHash className="inline mr-1 text-[#0F8B8D]" /> USSD Shortcode Extension
              </label>
              <input
                type="text"
                value={formData.ussdCode}
                onChange={(e) => setFormData({ ...formData, ussdCode: e.target.value })}
                placeholder="e.g. *713*123*1#"
                className={`w-full px-4 py-2.5 text-xs font-mono font-bold border rounded-2xl focus:outline-none transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-950 focus:border-[#0F8B8D] focus:bg-white'
                    : 'bg-slate-950 border-slate-700 text-white focus:border-teal-400'
                }`}
              />
            </div>

            {/* Account Status */}
            <div className="sm:col-span-2">
              <label
                className={`block text-xs font-black uppercase mb-1.5 ${
                  isLight ? 'text-slate-800' : 'text-slate-300'
                }`}
              >
                Account Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'REJECTED',
                  })
                }
                className={`w-full px-4 py-2.5 text-xs font-bold border rounded-2xl focus:outline-none transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-950 focus:border-[#0F8B8D] focus:bg-white'
                    : 'bg-slate-950 border-slate-700 text-white focus:border-teal-400'
                }`}
              >
                <option value="ACTIVE">ACTIVE (Approved &amp; Operating)</option>
                <option value="PENDING">PENDING (Awaiting Administrative Review)</option>
                <option value="SUSPENDED">SUSPENDED (Temporarily Blocked from Earning)</option>
                <option value="REJECTED">REJECTED (Declined Application)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Payout Destination & Routing */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 transition-all ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="border-b pb-4 flex items-center justify-between">
            <div>
              <h2
                className={`text-base font-black tracking-tight flex items-center gap-2 ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}
              >
                <FiCreditCard className="text-[#0F8B8D] dark:text-teal-400" />
                Payout Destination &amp; Routing
              </h2>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Configure the destination bank or mobile money wallet for commission disbursements.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Payment Channel */}
            <div>
              <label
                className={`block text-xs font-black uppercase mb-1.5 ${
                  isLight ? 'text-slate-800' : 'text-slate-300'
                }`}
              >
                Payment Channel
              </label>
              <select
                value={formData.paymentChannel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentChannel: e.target.value as 'MOBILE_MONEY' | 'BANK',
                  })
                }
                className={`w-full px-4 py-2.5 text-xs font-bold border rounded-2xl focus:outline-none transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-950 focus:border-[#0F8B8D] focus:bg-white'
                    : 'bg-slate-950 border-slate-700 text-white focus:border-teal-400'
                }`}
              >
                <option value="MOBILE_MONEY">Mobile Money</option>
                <option value="BANK">Bank Transfer</option>
              </select>
            </div>

            {/* Network or Bank Name */}
            {formData.paymentChannel === 'MOBILE_MONEY' ? (
              <div>
                <label
                  className={`block text-xs font-black uppercase mb-1.5 ${
                    isLight ? 'text-slate-800' : 'text-slate-300'
                  }`}
                >
                  MoMo Network
                </label>
                <select
                  value={formData.network}
                  onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                  className={`w-full px-4 py-2.5 text-xs font-bold border rounded-2xl focus:outline-none transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-950 focus:border-[#0F8B8D] focus:bg-white'
                      : 'bg-slate-950 border-slate-700 text-white focus:border-teal-400'
                  }`}
                >
                  <option value="MTN">MTN MoMo</option>
                  <option value="VODAFONE">Telecel Cash</option>
                  <option value="AIRTELTIGO">AirtelTigo (AT Money)</option>
                </select>
              </div>
            ) : (
              <div>
                <label
                  className={`block text-xs font-black uppercase mb-1.5 ${
                    isLight ? 'text-slate-800' : 'text-slate-300'
                  }`}
                >
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="e.g. GCB Bank, Ecobank Ghana"
                  className={`w-full px-4 py-2.5 text-xs font-bold border rounded-2xl focus:outline-none transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-950 focus:border-[#0F8B8D] focus:bg-white'
                      : 'bg-slate-950 border-slate-700 text-white focus:border-teal-400'
                  }`}
                />
              </div>
            )}

            {/* Bank Code (Only for Bank) */}
            {formData.paymentChannel === 'BANK' && (
              <div>
                <label
                  className={`block text-xs font-black uppercase mb-1.5 ${
                    isLight ? 'text-slate-800' : 'text-slate-300'
                  }`}
                >
                  Bank Sort / Routing Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.bankCode}
                  onChange={(e) => setFormData({ ...formData, bankCode: e.target.value })}
                  placeholder="e.g. 040100"
                  className={`w-full px-4 py-2.5 text-xs font-bold border rounded-2xl focus:outline-none transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-950 focus:border-[#0F8B8D] focus:bg-white'
                      : 'bg-slate-950 border-slate-700 text-white focus:border-teal-400'
                  }`}
                />
              </div>
            )}

            {/* Account / Mobile Number */}
            <div>
              <label
                className={`block text-xs font-black uppercase mb-1.5 ${
                  isLight ? 'text-slate-800' : 'text-slate-300'
                }`}
              >
                Account / Mobile Number
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="e.g. 0550807914"
                className={`w-full px-4 py-2.5 text-xs font-bold border rounded-2xl focus:outline-none transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-950 focus:border-[#0F8B8D] focus:bg-white'
                    : 'bg-slate-950 border-slate-700 text-white focus:border-teal-400'
                }`}
              />
            </div>

            {/* Account Holder Name */}
            <div>
              <label
                className={`block text-xs font-black uppercase mb-1.5 ${
                  isLight ? 'text-slate-800' : 'text-slate-300'
                }`}
              >
                Account Holder Name
              </label>
              <input
                type="text"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                placeholder="e.g. Anthony Afriyie"
                className={`w-full px-4 py-2.5 text-xs font-bold border rounded-2xl focus:outline-none transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-950 focus:border-[#0F8B8D] focus:bg-white'
                    : 'bg-slate-950 border-slate-700 text-white focus:border-teal-400'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Action Bar Footer */}
        <div
          className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between gap-4 transition-all ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <button
            type="button"
            onClick={() => navigate('/admin/affiliates')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
              isLight
                ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            Cancel &amp; Discard
          </button>

          <Button
            variant={isLight ? 'primary' : 'gradient'}
            size="md"
            type="submit"
            isLoading={updateMutation.isPending}
            leftIcon={<FiCheckCircle />}
            className="font-black text-xs h-11 px-8 rounded-2xl shadow-md"
          >
            {updateMutation.isPending ? 'Saving Changes...' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};
