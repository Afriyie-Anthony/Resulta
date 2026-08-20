import React, { useEffect, useContext } from 'react';
import type { BaseComponentProps } from '../../types/ui';
import { AdminThemeContext } from '../../contexts/AdminThemeContext';

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  forceLight?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className = '',
  forceLight = false,
}) => {
  const adminTheme = useContext(AdminThemeContext);
  const isLight = forceLight || (adminTheme?.isLight ?? false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeMap: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full ${sizeMap[size]} ${
          isLight
            ? 'bg-white border border-slate-200/90 shadow-2xl text-slate-900'
            : 'bg-slate-900 border border-slate-800 shadow-2xl text-white'
        } rounded-3xl overflow-hidden z-10 animate-scale-up ${className}`}
      >
        {/* Header */}
        {(title || description) && (
          <div className={`flex items-start justify-between px-6 py-4 border-b ${
            isLight ? 'border-slate-200/80' : 'border-slate-800'
          }`}>
            <div>
              {title && <h3 className={`text-lg font-black tracking-tight ${isLight ? 'text-primary' : 'text-white'}`}>{title}</h3>}
              {description && <p className={`text-xs font-medium mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{description}</p>}
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-colors ${
                isLight
                  ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
};
