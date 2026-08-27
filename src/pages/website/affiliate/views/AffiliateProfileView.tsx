import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiInfo, FiSmartphone, FiBriefcase, FiLoader } from 'react-icons/fi';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { useToast } from '../../../../components/ui/Toast';
import { useAffiliateProfile, useUpdateAffiliateProfile } from '../../../../hooks/useAffiliate';
import { updateAffiliateProfileSchema, type UpdateAffiliateProfileDTO } from '../../../../schemas/affiliate';

export const AffiliateProfileView: React.FC = () => {
  const { data: profile, isLoading } = useAffiliateProfile();
  const updateMutation = useUpdateAffiliateProfile();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateAffiliateProfileDTO>({
    resolver: zodResolver(updateAffiliateProfileSchema),
    defaultValues: {
      paymentChannel: 'MOBILE_MONEY',
    }
  });

  const paymentChannel = watch('paymentChannel');

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.user?.name || '',
        businessName: profile.businessName || '',
        phoneNumber: profile.phoneNumber || '',
        location: profile.location || '',
        paymentChannel: profile.paymentChannel || 'MOBILE_MONEY',
        network: profile.network || '',
        bankName: profile.bankName || '',
        bankCode: profile.bankCode || '',
        accountNumber: profile.accountNumber || '',
        accountName: profile.accountName || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: UpdateAffiliateProfileDTO) => {
    try {
      // Remove empty passwords to prevent validation errors if they didn't type anything
      if (!data.oldPassword && !data.newPassword) {
        delete data.oldPassword;
        delete data.newPassword;
      }
      
      await updateMutation.mutateAsync(data);
      addToast({ title: 'Success', message: 'Profile updated successfully', type: 'success' });
      
      // Clear password fields after success
      setValue('oldPassword', '');
      setValue('newPassword', '');
    } catch (error: any) {
      addToast({ title: 'Error', message: error.response?.data?.message || 'Failed to update profile', type: 'error' });
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }
  const userName = profile.user?.name || 'User';
  const userEmail = profile.user?.email || '';
  const initials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] font-bold text-[#0A2540] tracking-tight font-serif">Profile Settings</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal information and payout account details.
        </p>
      </div>

      {/* Hero Banner */}
      <div className="bg-primary rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#4ade80]/20 border border-[#4ade80]/30 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
            {initials}
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-white tracking-tight">{userName}</h3>
            <p className="text-[#a7f3d0] text-sm font-medium mb-3">{userEmail}</p>
            <div className="flex items-center gap-3">
              <span className="bg-[#dcfce7] text-[#166534] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                {profile.status}
              </span>
              <span className="text-[#fcd34d] text-xs font-semibold font-mono tracking-wider">{profile.affiliateCode}</span>
            </div>
          </div>
        </div>

        {profile.ussdCode && (
          <div className="bg-primary border border-[#4ade80]/30 rounded-xl p-4 md:w-64 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
            <p className="text-[#a7f3d0] text-[10px] font-semibold uppercase tracking-widest mb-1.5 opacity-90 relative z-10">
              YOUR USSD EXTENSION
            </p>
            <p className="text-[#fef3c7] text-2xl font-bold font-mono tracking-tight relative z-10">
              {profile.ussdCode}
            </p>
          </div>
        )}
      </div>

      {/* Alert Banner */}
      <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 flex gap-3 shadow-sm">
        <FiInfo className="text-[#d97706] w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-[#92400e]">Platform Managed Fields</h4>
          <p className="text-xs text-[#b45309] font-medium mt-1">
            Your USSD extension code, commission rates, and application status are managed by the platform administration.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Form Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-[#0A2540] mb-6 font-serif">Personal & Business Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Full Name</label>
              <Input {...register('name')} error={errors.name?.message} forceLight />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Business Name</label>
              <Input {...register('businessName')} error={errors.businessName?.message} forceLight />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Phone Number</label>
              <Input {...register('phoneNumber')} error={errors.phoneNumber?.message} forceLight />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Location</label>
              <Input {...register('location')} error={errors.location?.message} forceLight />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-[#0A2540] mt-8 mb-6 font-serif">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Old Password</label>
              <Input type="password" {...register('oldPassword')} error={errors.oldPassword?.message} forceLight />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">New Password</label>
              <Input type="password" {...register('newPassword')} error={errors.newPassword?.message} forceLight />
            </div>
          </div>
        </div>

        {/* Payout Account Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-[#0A2540] font-serif">Payout Account Details</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Specify where you would like your commission earnings paid out.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <button 
              type="button"
              onClick={() => setValue('paymentChannel', 'MOBILE_MONEY', { shouldValidate: true })}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border ${paymentChannel === 'MOBILE_MONEY' ? 'border-[#1a472a] bg-[#f0fdf4] text-[#1a472a]' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'} font-semibold text-sm shadow-sm transition-colors`}
            >
              <FiSmartphone className={paymentChannel === 'MOBILE_MONEY' ? 'text-[#1a472a]' : ''} /> Mobile Money
            </button>
            <button 
              type="button"
              onClick={() => setValue('paymentChannel', 'BANK', { shouldValidate: true })}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border ${paymentChannel === 'BANK' ? 'border-[#1a472a] bg-[#f0fdf4] text-[#1a472a]' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'} font-semibold text-sm shadow-sm transition-colors`}
            >
              <FiBriefcase className={paymentChannel === 'BANK' ? 'text-[#1a472a]' : ''} /> Bank Account
            </button>
          </div>

          {paymentChannel === 'MOBILE_MONEY' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">MoMo Network</label>
                <select {...register('network')} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
                  <option value="">Select Network</option>
                  <option value="MTN">MTN Mobile Money</option>
                  <option value="VODAFONE">Telecel Cash</option>
                  <option value="AIRTELTIGO">AT Money</option>
                </select>
                {errors.network && <p className="text-red-500 text-xs mt-1">{errors.network.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">MoMo Phone Number</label>
                <Input {...register('accountNumber')} error={errors.accountNumber?.message} forceLight />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Account Name</label>
                <Input {...register('accountName')} error={errors.accountName?.message} forceLight />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Bank Name</label>
                <Input {...register('bankName')} error={errors.bankName?.message} forceLight />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Bank Code / Branch</label>
                <Input {...register('bankCode')} error={errors.bankCode?.message} forceLight />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Account Number</label>
                <Input {...register('accountNumber')} error={errors.accountNumber?.message} forceLight />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Account Name</label>
                <Input {...register('accountName')} error={errors.accountName?.message} forceLight />
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <Button type="submit" isLoading={isSubmitting} className="bg-[#1a472a] hover:bg-[#11321e] text-white px-6 font-semibold shadow-md">
              Save Profile Settings
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
