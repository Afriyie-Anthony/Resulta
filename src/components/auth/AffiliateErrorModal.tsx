import React from 'react';
import { Button } from '../ui/Button';
import { FiX, FiAlertTriangle } from 'react-icons/fi';

interface AffiliateErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLight?: boolean;
  message?: string;
}

export const AffiliateErrorModal: React.FC<AffiliateErrorModalProps> = ({
  isOpen,
  onClose,
  isLight = true,
  message,
}) => {
  if (!isOpen) return null;

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
        className={`relative z-10 w-full max-w-sm rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all animate-in fade-in zoom-in-95 duration-200 text-center ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-900/20'
            : 'bg-slate-900 border-slate-800 text-white shadow-black/80'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className={`absolute top-4 right-4 p-2 rounded-2xl transition-colors ${
            isLight
              ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
              : 'text-slate-500 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center gap-4 mt-2">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${isLight ? 'bg-rose-100 text-rose-600' : 'bg-rose-500/20 text-rose-400'}`}>
            <FiAlertTriangle className="w-8 h-8" />
          </div>
          
          <div>
            <h3 className={`text-xl font-black tracking-tight mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Login Failed
            </h3>
            <p className={`text-sm font-medium leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {message || 'Invalid email or password. Please try again.'}
            </p>
          </div>
          
          <Button
            type="button"
            variant={isLight ? 'primary' : 'gradient'}
            onClick={onClose}
            className="w-full mt-4 h-11 rounded-2xl font-black text-sm shadow-md"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};
