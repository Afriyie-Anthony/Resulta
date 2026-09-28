import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (otp: string) => Promise<void>;
  errorMsg?: string;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  errorMsg,
}) => {
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (otpCode.length !== 6) return;
    
    setIsLoading(true);
    try {
      await onConfirm(otpCode);
      // Reset after success if handled by parent closing it, but good to reset anyway
      setOtpCode('');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Financial Security Authorization">
      <div className="flex flex-col items-center p-2">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
          <span className="text-2xl">🛡️</span>
        </div>
        
        <p className="text-sm text-center text-slate-600 dark:text-slate-400 mb-6">
          A 6-digit authorization code has been dispatched to the authorized security email.
          Enter it below to authorize this payout operation.
        </p>

        {errorMsg && (
          <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
            {errorMsg}
          </div>
        )}

        <input
          type="text"
          maxLength={6}
          placeholder="123456"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
          className="w-full text-center text-3xl tracking-[1em] font-mono border rounded-lg py-4 mb-6 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
          autoFocus
        />

        <div className="flex w-full gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setOtpCode('');
              onClose();
            }}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={isLoading || otpCode.length !== 6}
            onClick={handleConfirm}
            isLoading={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white border-transparent"
          >
            {isLoading ? 'Verifying...' : 'Authorize Action'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
