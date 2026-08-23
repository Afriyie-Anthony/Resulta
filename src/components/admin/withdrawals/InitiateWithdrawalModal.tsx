import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { useBankCodes, useInitiateWithdrawal } from '../../../hooks/useWithdrawals';
import { initiateWithdrawalRequestSchema, type InitiateWithdrawalRequest } from '../../../schemas/withdrawals';
import { FiSend, FiInfo } from 'react-icons/fi';

interface InitiateWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InitiateWithdrawalModal: React.FC<InitiateWithdrawalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();
  
  const { data: bankCodes = [], isLoading: isLoadingBanks } = useBankCodes();
  const initiateMutation = useInitiateWithdrawal();

  const [formData, setFormData] = useState<Partial<InitiateWithdrawalRequest>>({
    channel: 'MOBILE_MONEY',
    amount: 0,
    network: 'MTN',
    phoneNumber: '',
    accountName: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof InitiateWithdrawalRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleChannelChange = (channel: 'MOBILE_MONEY' | 'BANK') => {
    setFormData({
      channel,
      amount: formData.amount,
      accountName: formData.accountName,
      description: formData.description,
      // Reset specific fields
      network: channel === 'MOBILE_MONEY' ? 'MTN' : undefined,
      phoneNumber: channel === 'MOBILE_MONEY' ? '' : undefined,
      bankCode: channel === 'BANK' ? '' : undefined,
      bankName: channel === 'BANK' ? '' : undefined,
      accountNumber: channel === 'BANK' ? '' : undefined,
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = initiateWithdrawalRequestSchema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        newErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    try {
      await initiateMutation.mutateAsync(result.data);
      addToast({
        title: 'Payout Initiated',
        message: 'The withdrawal payout has been successfully initiated.',
        type: 'success',
      });
      onClose();
    } catch (err: any) {
      addToast({
        title: 'Failed to Initiate Payout',
        message: err.response?.data?.message || 'An error occurred while initiating the payout.',
        type: 'error',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Initiate Payout">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Channel Selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleChannelChange('MOBILE_MONEY')}
            className={`py-2 px-3 text-sm font-bold rounded-xl border transition-colors ${
              formData.channel === 'MOBILE_MONEY'
                ? isLight
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : 'bg-emerald-900/20 border-emerald-500 text-emerald-400'
                : isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Mobile Money
          </button>
          <button
            type="button"
            onClick={() => handleChannelChange('BANK')}
            className={`py-2 px-3 text-sm font-bold rounded-xl border transition-colors ${
              formData.channel === 'BANK'
                ? isLight
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-blue-900/20 border-blue-500 text-blue-400'
                : isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Bank Transfer
          </button>
        </div>

        {/* Dynamic Fields based on Channel */}
        <div className={`p-4 rounded-xl border space-y-4 ${
          isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
        }`}>
          {formData.channel === 'MOBILE_MONEY' ? (
            <>
              <div>
                <label className={`block text-xs font-black uppercase mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Network</label>
                <select
                  value={formData.network || ''}
                  onChange={(e) => handleInputChange('network', e.target.value)}
                  className={`w-full text-sm p-2.5 rounded-lg border focus:outline-none focus:ring-2 ${
                    isLight ? 'bg-white border-slate-300 focus:ring-emerald-500/20 focus:border-emerald-500' : 'bg-slate-950 border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500'
                  }`}
                >
                  <option value="MTN">MTN</option>
                  <option value="VODAFONE">Vodafone / Telecel</option>
                  <option value="AIRTELTIGO">AirtelTigo</option>
                </select>
                {errors.network && <p className="text-rose-500 text-xs mt-1">{errors.network}</p>}
              </div>
              <div>
                <label className={`block text-xs font-black uppercase mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. 0244123456"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={`w-full text-sm p-2.5 rounded-lg border focus:outline-none focus:ring-2 ${
                    isLight ? 'bg-white border-slate-300 focus:ring-emerald-500/20 focus:border-emerald-500' : 'bg-slate-950 border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500'
                  }`}
                />
                {errors.phoneNumber && <p className="text-rose-500 text-xs mt-1">{errors.phoneNumber}</p>}
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={`block text-xs font-black uppercase mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Bank Name</label>
                <select
                  value={formData.bankCode || ''}
                  onChange={(e) => {
                    const selectedCode = e.target.value;
                    const selectedBank = bankCodes.find(b => b.code === selectedCode);
                    handleInputChange('bankCode', selectedCode);
                    if (selectedBank) {
                      handleInputChange('bankName', selectedBank.name);
                    }
                  }}
                  disabled={isLoadingBanks}
                  className={`w-full text-sm p-2.5 rounded-lg border focus:outline-none focus:ring-2 ${
                    isLight ? 'bg-white border-slate-300 focus:ring-blue-500/20 focus:border-blue-500' : 'bg-slate-950 border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                >
                  <option value="">Select a Bank...</option>
                  {bankCodes.filter(b => b.isActive).map(bank => (
                    <option key={bank.id} value={bank.code}>{bank.name}</option>
                  ))}
                </select>
                {errors.bankCode && <p className="text-rose-500 text-xs mt-1">{errors.bankCode}</p>}
              </div>
              <div>
                <label className={`block text-xs font-black uppercase mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Account Number</label>
                <input
                  type="text"
                  placeholder="e.g. 1011130001"
                  value={formData.accountNumber || ''}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  className={`w-full text-sm p-2.5 rounded-lg border focus:outline-none focus:ring-2 ${
                    isLight ? 'bg-white border-slate-300 focus:ring-blue-500/20 focus:border-blue-500' : 'bg-slate-950 border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
                {errors.accountNumber && <p className="text-rose-500 text-xs mt-1">{errors.accountNumber}</p>}
              </div>
            </>
          )}
          
          <div>
            <label className={`block text-xs font-black uppercase mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Account Name</label>
            <input
              type="text"
              placeholder="e.g. Kwame Mensah"
              value={formData.accountName || ''}
              onChange={(e) => handleInputChange('accountName', e.target.value)}
              className={`w-full text-sm p-2.5 rounded-lg border focus:outline-none focus:ring-2 ${
                isLight ? 'bg-white border-slate-300 focus:ring-slate-500/20 focus:border-slate-500' : 'bg-slate-950 border-slate-700 focus:ring-slate-500/20 focus:border-slate-500'
              }`}
            />
            {errors.accountName && <p className="text-rose-500 text-xs mt-1">{errors.accountName}</p>}
          </div>
        </div>

        {/* Amount & Description */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className={`block text-xs font-black uppercase mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Amount (GHC)</label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={formData.amount || ''}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
              className={`w-full text-sm p-2.5 rounded-lg border focus:outline-none focus:ring-2 ${
                isLight ? 'bg-white border-slate-300 focus:ring-amber-500/20 focus:border-amber-500' : 'bg-slate-950 border-slate-700 focus:ring-amber-500/20 focus:border-amber-500'
              }`}
            />
            {errors.amount && <p className="text-rose-500 text-xs mt-1">{errors.amount}</p>}
          </div>
        </div>

        <div>
          <label className={`block text-xs font-black uppercase mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Description / Note</label>
          <input
            type="text"
            placeholder="Optional payout note"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={`w-full text-sm p-2.5 rounded-lg border focus:outline-none focus:ring-2 ${
              isLight ? 'bg-white border-slate-300 focus:ring-slate-500/20 focus:border-slate-500' : 'bg-slate-950 border-slate-700 focus:ring-slate-500/20 focus:border-slate-500'
            }`}
          />
        </div>

        <div className={`flex items-center gap-2 p-3 rounded-xl text-[11px] font-bold ${
          isLight ? 'bg-amber-50 text-amber-800' : 'bg-amber-900/20 text-amber-400'
        }`}>
          <FiInfo className="w-4 h-4 shrink-0" />
          <span>This action will immediately dispatch funds via the Hubtel Direct Send API.</span>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={initiateMutation.isPending}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            leftIcon={<FiSend />}
            isLoading={initiateMutation.isPending}
            disabled={initiateMutation.isPending}
            className="font-black"
          >
            Initiate Payout
          </Button>
        </div>
      </form>
    </Modal>
  );
};
