import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/Toast';
import { Button } from '../ui/Button';
import {
  useRequestResetOtp,
  useResetPassword,
} from '../../hooks/usePasswordReset';
import {
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
} from '../../schemas/auth';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiKey,
  FiCheckCircle,
  FiArrowLeft,
  FiX,
  FiAlertCircle,
  FiClock,
} from 'react-icons/fi';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLight?: boolean;
  initialEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  isLight = true,
  initialEmail = '',
}) => {
  const { addToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(900); // 15 minutes = 900s

  const requestOtpMutation = useRequestResetOtp();
  const resetPasswordMutation = useResetPassword();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setEmail(initialEmail);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage('');
      setCountdown(900);
    }
  }, [isOpen, initialEmail]);

  // Countdown timer for 15-minute OTP validity
  useEffect(() => {
    let timer: any;
    if (isOpen && step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => Math.max(prev - 1, 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, step, countdown]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Step 1: Request OTP handler
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const validation = forgotPasswordRequestSchema.safeParse({ email: email.trim() });
    if (!validation.success) {
      setErrorMessage(validation.error.issues[0].message);
      return;
    }

    try {
      await requestOtpMutation.mutateAsync({ email: email.trim() });
      addToast({
        title: 'Verification Code Dispatched',
        message: `A 6-digit OTP code has been sent to ${email.trim()}.`,
        type: 'success',
        duration: 4000,
      });
      setCountdown(900); // 15 min
      setStep(2);
    } catch (err: any) {
      const serverMessage = err.response?.data?.message || err.response?.data?.error;
      const status = err.response?.status;
      let msg = serverMessage;
      if (!msg) {
        if (status === 404) {
          msg = `No account found with email "${email.trim()}". Please check the address or create an account.`;
        } else if (status === 500) {
          msg = 'The email dispatch service encountered an issue. Please try again later or contact support.';
        } else {
          msg = err.message || 'Failed to dispatch password reset code. Please check the email address.';
        }
      }
      setErrorMessage(msg);
    }
  };

  // Step 2: Reset Password handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const payload = {
      email: email.trim(),
      otp: otp.trim(),
      newPassword,
      confirmPassword,
    };

    const validation = resetPasswordRequestSchema.safeParse(payload);
    if (!validation.success) {
      setErrorMessage(validation.error.issues[0].message);
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync(payload);
      addToast({
        title: 'Password Reset Successful',
        message: 'Your account credentials have been updated securely.',
        type: 'success',
        duration: 4000,
      });
      setStep(3);
    } catch (err: any) {
      const serverMessage = err.response?.data?.message || err.response?.data?.error;
      const msg = serverMessage || err.message || 'Failed to reset password. Please verify your OTP code.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative z-10 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-300 text-slate-950 shadow-slate-900/20'
            : 'bg-slate-900 border-slate-800 text-white shadow-black/80'
        }`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-xl transition-colors ${
            isLight ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-700' : 'text-slate-500 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* ── STEP 1: Request OTP ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3.5">
              <div className={`p-3 rounded-2xl ${
                isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/20 text-teal-400'
              }`}>
                <FiShield className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  Reset Your Password
                </h3>
                <p className={`text-xs font-semibold mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Step 1 of 2: Request Security Verification OTP
                </p>
              </div>
            </div>

            <p className={`text-xs leading-relaxed font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Enter your registered account email address. We'll send a 6-digit numeric verification code valid for 15 minutes.
            </p>

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-black flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Account Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="e.g. admin@resulta.com.gh"
                    className={`w-full rounded-2xl pl-11 pr-4 py-3 text-xs font-bold border focus:outline-none transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D] focus:bg-white'
                        : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-teal-500'
                    }`}
                  />
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="font-bold text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={isLight ? 'primary' : 'gradient'}
                  disabled={requestOtpMutation.isPending}
                  className="font-black text-xs h-11 px-6 rounded-2xl shadow-md"
                >
                  {requestOtpMutation.isPending ? 'Sending OTP...' : 'Send Verification Code →'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ── STEP 2: Verify OTP & Reset Password ── */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400">
                <FiKey className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  Verify Code & Set Password
                </h3>
                <p className={`text-xs font-semibold mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Step 2 of 2: Enter 6-digit OTP & New Password
                </p>
              </div>
            </div>

            <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
              isLight ? 'bg-slate-50 border-slate-300 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
            }`}>
              <div className="truncate max-w-[260px]">
                OTP sent to: <strong className={isLight ? 'text-slate-950' : 'text-white'}>{email}</strong>
              </div>
              <div className="flex items-center gap-1 font-mono font-black text-emerald-600 dark:text-emerald-400 shrink-0">
                <FiClock className="w-3.5 h-3.5" />
                <span>{formatTime(countdown)}</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-black flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* 6-Digit OTP Code */}
              <div>
                <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ''));
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="123456"
                  className={`w-full rounded-2xl px-4 py-3 text-center text-lg font-mono font-black tracking-widest border focus:outline-none transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D] focus:bg-white'
                      : 'bg-slate-950 border-slate-800 text-teal-400 focus:border-teal-500'
                  }`}
                />
              </div>

              {/* New Password */}
              <div>
                <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 chars)..."
                    className={`w-full rounded-2xl pl-11 pr-11 py-2.5 text-xs font-bold border focus:outline-none transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D] focus:bg-white'
                        : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500'
                    }`}
                  />
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password..."
                    className={`w-full rounded-2xl pl-11 pr-11 py-2.5 text-xs font-bold border focus:outline-none transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D] focus:bg-white'
                        : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500'
                    }`}
                  />
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`text-xs font-bold flex items-center gap-1 ${
                    isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FiArrowLeft className="w-3 h-3" /> Change email
                </button>

                <Button
                  type="submit"
                  variant={isLight ? 'primary' : 'gradient'}
                  disabled={resetPasswordMutation.isPending}
                  className="font-black text-xs h-11 px-6 rounded-2xl shadow-md"
                >
                  {resetPasswordMutation.isPending ? 'Updating...' : 'Update Password & Finish'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ── STEP 3: Success Confirmation ── */}
        {step === 3 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-md">
              <FiCheckCircle />
            </div>
            <div>
              <h3 className={`text-xl font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                Password Reset Complete!
              </h3>
              <p className={`text-xs font-semibold mt-1 max-w-sm mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Your credentials have been updated successfully. You can now sign in using your new password.
              </p>
            </div>
            <div className="pt-3">
              <Button
                type="button"
                variant={isLight ? 'primary' : 'gradient'}
                onClick={onClose}
                className="font-black text-xs h-11 px-8 rounded-2xl shadow-md w-full"
              >
                Return to Sign In &rarr;
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
