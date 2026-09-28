import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { useBankCodes, useInitiateWithdrawal } from '../../../hooks/useWithdrawals';
import { initiateWithdrawalRequestSchema, type InitiateWithdrawalRequest } from '../../../schemas/withdrawals';
import { requestFinancialOtp, getWallets } from '../../../services/financial-security.service';
import type { WalletRecord } from '../../../schemas/financial-security';
import { OtpVerificationModal } from '../security/OtpVerificationModal';
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

  const [wallets, setWallets] = useState<WalletRecord[]>([]);
  const [isLoadingWallets, setIsLoadingWallets] = useState(false);
  const [useSavedWallet, setUseSavedWallet] = useState(true);

  // OTP Modal State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);

  const [formData, setFormData] = useState<Partial<InitiateWithdrawalRequest>>({
    channel: 'MOBILE_MONEY',
    amount: 0,
    network: 'MTN',
    phoneNumber: '',
    accountName: '',
    description: '',
    walletId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      loadWallets();
    }
  }, [isOpen]);

  const loadWallets = async () => {
    setIsLoadingWallets(true);
    try {
      const data = await getWallets();
      setWallets(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, walletId: data[0].id }));
      }
    } catch (error) {
      console.error('Failed to load wallets:', error);
    } finally {
      setIsLoadingWallets(false);
    }
  };

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
      walletId: '',
      network: channel === 'MOBILE_MONEY' ? 'MTN' : undefined,
      phoneNumber: channel === 'MOBILE_MONEY' ? '' : undefined,
      bankCode: channel === 'BANK' ? '' : undefined,
      bankName: channel === 'BANK' ? '' : undefined,
      accountNumber: channel === 'BANK' ? '' : undefined,
    });
    setErrors({});
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setOtpError('');

    const payload = useSavedWallet 
      ? { walletId: formData.walletId, amount: formData.amount, description: formData.description }
      : formData;

    const result = initiateWithdrawalRequestSchema.safeParse(payload);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        newErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setIsRequestingOtp(true);
    try {
      await requestFinancialOtp('WITHDRAWAL_INITIATE', {
        walletId: formData.walletId,
        amount: formData.amount,
      });
      setIsOtpModalOpen(true);
    } catch (err: any) {
      addToast({
        title: 'Failed to request Security Code',
        message: err.response?.data?.message || 'Rate limit reached or server error.',
        type: 'error',
      });
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleConfirmOtp = async (otpCode: string) => {
    setOtpError('');
    
    const payload = useSavedWallet 
      ? { walletId: formData.walletId, amount: formData.amount, description: formData.description, otp: otpCode }
      : { ...formData, otp: otpCode };

    const result = initiateWithdrawalRequestSchema.safeParse(payload);
    if (!result.success) return; // Should already be validated

    try {
      await initiateMutation.mutateAsync(result.data);
      addToast({
        title: 'Payout Initiated',
        message: 'The withdrawal payout has been successfully initiated.',
        type: 'success',
      });
      setIsOtpModalOpen(false);
      onClose();
    } catch (err: any) {
      if (err.response?.status === 400) {
        setOtpError(err.response?.data?.message || 'Invalid or expired OTP.');
      } else {
        setOtpError('Failed to initiate payout. Please try again.');
      }
      throw err; // Re-throw to keep modal loading state consistent if needed, though we handled it
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Initiate Payout">
        <form onSubmit={handleInitialSubmit} className="space-y-4">
          
          <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => { setUseSavedWallet(true); setErrors({}); }}
              className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors ${useSavedWallet ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}
            >
              Saved Wallets
            </button>
            <button
              type="button"
              onClick={() => { setUseSavedWallet(false); setErrors({}); }}
              className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors ${!useSavedWallet ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}
            >
              Manual Entry
            </button>
          </div>

          <div className={`p-4 rounded-xl border space-y-4 ${isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-slate-900/50 border-slate-800'}`}>
            
            {useSavedWallet ? (
              <div>
                <label className={`block text-xs font-black uppercase mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Select Payout Wallet</label>
                <select
                  value={formData.walletId || ''}
                  onChange={(e) => handleInputChange('walletId', e.target.value)}
                  disabled={isLoadingWallets}
                  className={`w-full text-sm p-2.5 rounded-lg border focus:outline-none focus:ring-2 ${isLight ? 'bg-white border-slate-300 focus:ring-blue-500/20' : 'bg-slate-950 border-slate-700'}`}
                >
                  <option value="">-- Choose Destination Wallet --</option>
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.label} ({w.channel === 'MOBILE_MONEY' ? `${w.network} - ${w.phoneNumber}` : `${w.bankName} - ${w.accountNumber}`})
                    </option>
                  ))}
                </select>
                {errors.walletId && <p className="text-rose-500 text-xs mt-1">{errors.walletId}</p>}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => handleChannelChange('MOBILE_MONEY')}
                    className={`py-2 px-3 text-sm font-bold rounded-xl border transition-colors ${formData.channel === 'MOBILE_MONEY' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700'}`}
                  >
                    Mobile Money
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChannelChange('BANK')}
                    className={`py-2 px-3 text-sm font-bold rounded-xl border transition-colors ${formData.channel === 'BANK' ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700'}`}
                  >
                    Bank Transfer
                  </button>
                </div>

                {formData.channel === 'MOBILE_MONEY' ? (
                  <>
                    <div>
                      <label className={`block text-xs font-black uppercase mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Network</label>
                      <select
                        value={formData.network || ''}
                        onChange={(e) => handleInputChange('network', e.target.value)}
                        className={`w-full text-sm p-2.5 rounded-lg border focus:outline-none focus:ring-2 ${isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-700'}`}
                      >
                        <option value="MTN">MTN</option>
                        <option value="VODAFONE">Vodafone / Telecel</option>
                        <option value="AIRTELTIGO">AirtelTigo</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-xs font-black uppercase mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Phone Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 0244123456"
                        value={formData.phoneNumber || ''}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className={`w-full text-sm p-2.5 rounded-lg border focus:outline-none focus:ring-2 ${isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-700'}`}
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
                          if (selectedBank) handleInputChange('bankName', selectedBank.name);
                        }}
                        className={`w-full text-sm p-2.5 rounded-lg border focus:outline-none focus:ring-2 ${isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-700'}`}
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
                        className={`w-full text-sm p-2.5 rounded-lg border focus:outline-none focus:ring-2 ${isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-700'}`}
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
                    className={`w-full text-sm p-2.5 rounded-lg border focus:outline-none focus:ring-2 ${isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-700'}`}
                  />
                  {errors.accountName && <p className="text-rose-500 text-xs mt-1">{errors.accountName}</p>}
                </div>
              </>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className={`block text-xs font-black uppercase mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Amount (GHC)</label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={formData.amount || ''}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
                className={`w-full text-sm p-2.5 rounded-lg border focus:outline-none focus:ring-2 ${isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-700'}`}
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
              className={`w-full text-sm p-2.5 rounded-lg border focus:outline-none focus:ring-2 ${isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-700'}`}
            />
          </div>

          <div className={`flex items-center gap-2 p-3 rounded-xl text-[11px] font-bold ${isLight ? 'bg-amber-50 text-amber-800' : 'bg-amber-900/20 text-amber-400'}`}>
            <FiInfo className="w-4 h-4 shrink-0" />
            <span>This action requires financial security authorization.</span>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isRequestingOtp}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              leftIcon={<FiSend />}
              isLoading={isRequestingOtp}
              disabled={isRequestingOtp}
              className="font-black"
            >
              Proceed
            </Button>
          </div>
        </form>
      </Modal>

      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onConfirm={handleConfirmOtp}
        errorMsg={otpError}
      />
    </>
  );
};
