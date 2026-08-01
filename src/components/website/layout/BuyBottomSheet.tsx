import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiBookOpen, FiFileText } from 'react-icons/fi';

interface BuyBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const BuyBottomSheet: React.FC<BuyBottomSheetProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleBECE = () => {
    onClose();
    navigate('/purchase?type=bece');
  };

  const handleWASSCE = () => {
    onClose();
    navigate('/purchase?type=wassce');
  };

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Buy a voucher">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out translate-y-0">
        <div className="flex items-center justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>
        <div className="px-6 pb-8 pt-2">
          <h3 className="text-lg font-bold text-text-primary text-center mb-1">Buy a Voucher</h3>
          <p className="text-sm text-text-secondary text-center mb-6">What would you like to buy?</p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleBECE}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-warm hover:border-secondary/40 hover:shadow-md transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                <FiBookOpen className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-text-primary">BECE</p>
                <p className="text-xs text-text-secondary">BECE Voucher</p>
              </div>
              <FiX className="w-5 h-5 text-text-secondary rotate-45" />
            </button>

            <button
              type="button"
              onClick={handleWASSCE}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-warm hover:border-accent/40 hover:shadow-md transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                <FiFileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-text-primary">WASSCE / NOVDEC</p>
                <p className="text-xs text-text-secondary">WASSCE / NOVDEC Voucher</p>
              </div>
              <FiX className="w-5 h-5 text-text-secondary rotate-45" />
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full mt-4 py-3 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyBottomSheet;
