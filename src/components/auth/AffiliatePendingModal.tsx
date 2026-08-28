import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import {
  FiClock,
  FiMail,
  FiX,
  FiHelpCircle,
  FiAlertCircle,
} from 'react-icons/fi';

interface AffiliatePendingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLight?: boolean;
  email?: string;
  message?: string;
}

export const AffiliatePendingModal: React.FC<AffiliatePendingModalProps> = ({
  isOpen,
  onClose,
  isLight = true,
  email,
  message,
}) => {
  if (!isOpen) return null;

  const displayMessage =
    message ||
    'Your affiliate application is currently pending admin approval. You will receive an SMS and Email once approved.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all animate-in fade-in zoom-in-95 duration-200 ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-900/20'
            : 'bg-slate-900 border-slate-800 text-white shadow-black/80'
        }`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className={`absolute top-5 right-5 p-2 rounded-2xl transition-colors ${
            isLight
              ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
              : 'text-slate-500 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header with status badge */}
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isLight
                  ? 'bg-amber-500/15 text-amber-600 border border-amber-500/20'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              <FiClock className="w-6 h-6 animate-pulse" />
            </div>
            <div className="pr-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  Under Review
                </span>
              </div>
              <h3
                className={`text-xl font-black tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Application Pending Approval
              </h3>
            </div>
          </div>

          {/* Primary Alert / Message Box */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex items-start gap-3.5 ${
              isLight
                ? 'bg-rose-50/80 border-rose-200/90 text-rose-900 shadow-sm'
                : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
            }`}
          >
            <FiAlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
            <p className="text-xs sm:text-sm font-semibold leading-relaxed">
              {displayMessage}
            </p>
          </div>

          {/* Application Details Summary */}
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isLight
                ? 'bg-slate-50 border-slate-200/80 text-slate-700'
                : 'bg-slate-950/60 border-slate-800/90 text-slate-300'
            }`}
          >
            {email && (
              <div className="flex items-center justify-between text-xs font-medium pb-2.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                <span className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <FiMail className="w-3.5 h-3.5" /> Account Email
                </span>
                <span
                  className={`font-mono font-bold truncate max-w-[200px] ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {email}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                Review Status
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                Awaiting Admin Verification
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-medium pt-2.5 border-t border-dashed border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                Turnaround Time
              </span>
              <span
                className={`font-bold ${
                  isLight ? 'text-slate-800' : 'text-slate-200'
                }`}
              >
                Within 24 - 48 hours
              </span>
            </div>
          </div>

          <p
            className={`text-xs leading-relaxed ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Once approved, your unique referral link, USSD distribution code, and
            partner dashboard access will be activated immediately.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/help/contact"
              onClick={onClose}
              className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <FiHelpCircle className="w-3.5 h-3.5" />
              <span>Contact Support</span>
            </Link>

            <Button
              type="button"
              variant={isLight ? 'primary' : 'gradient'}
              onClick={onClose}
              className="w-full sm:flex-1 h-11 rounded-2xl font-black text-xs sm:text-sm shadow-md"
            >
              Got It, Thanks &rarr;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
