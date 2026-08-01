import React from 'react';
import { Link } from 'react-router-dom';
import { FiHelpCircle, FiMessageCircle, FiLock, FiFileText, FiRefreshCw } from 'react-icons/fi';

interface MoreBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoreBottomSheet: React.FC<MoreBottomSheetProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const supportLinks = [
    { label: 'Get Help', href: '/help/contact', icon: FiHelpCircle },
    { label: 'FAQs', href: '/help/faq', icon: FiMessageCircle },
    { label: 'Contact Support', href: '/help/contact', icon: FiMessageCircle },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/legal/privacy', icon: FiLock },
    { label: 'Terms & Conditions', href: '/legal/terms', icon: FiFileText },
    { label: 'Refund Policy', href: '/legal/refund', icon: FiRefreshCw },
  ];

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="More options">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out translate-y-0 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>
        <div className="px-6 pb-8 pt-2">
          <h3 className="text-lg font-bold text-text-primary text-center mb-6">More</h3>

          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">Support</p>
            <div className="space-y-1">
              {supportLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-warm transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-text-primary">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">Legal</p>
            <div className="space-y-1">
              {legalLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-warm transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-text-primary">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreBottomSheet;
