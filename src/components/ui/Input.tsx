import React, { type InputHTMLAttributes, type ReactNode, useContext } from 'react';
import { AdminThemeContext } from '../../contexts/AdminThemeContext';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  prefix?: string;
  forceLight?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  prefix,
  forceLight = false,
  className = '',
  id,
  ...props
}) => {
  const adminTheme = useContext(AdminThemeContext);
  const isLight = forceLight || (adminTheme?.isLight ?? false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
          {label}
        </label>
      )}

      <div className={`relative flex items-center rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/20 transition-all duration-200 ${
        isLight
          ? 'bg-white border border-slate-200 focus-within:border-teal-500 shadow-sm'
          : 'bg-slate-900/90 border border-slate-800 focus-within:border-teal-500'
      }`}>
        {prefix && (
          <span className={`pl-3 py-2.5 text-sm font-semibold select-none border-r ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-600'
              : 'bg-slate-850 border-slate-800 text-slate-400'
          }`}>
            {prefix}
          </span>
        )}
        
        {leftIcon && !prefix && (
          <div className={`pl-3.5 flex items-center pointer-events-none ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          className={`w-full bg-transparent px-3.5 py-2.5 text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
            isLight ? 'text-slate-900 placeholder-slate-400' : 'text-slate-100 placeholder-slate-500'
          } ${
            leftIcon && !prefix ? 'pl-2' : ''
          } ${rightIcon ? 'pr-10' : ''} ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className={`absolute right-3.5 flex items-center ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};
