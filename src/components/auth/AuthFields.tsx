import React from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  icon: React.ReactNode;
  placeholder?: string;
  error?: string;
  isLight: boolean;
  onChange: (value: string) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ id, label, type, value, icon, placeholder, error, isLight, onChange }) => (
  <div>
    <label htmlFor={id} className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-2xl pl-11 pr-4 py-2.5 text-xs font-bold border focus:outline-none transition-colors ${
          error
            ? 'border-rose-400 bg-rose-50 focus:border-rose-500'
            : isLight
              ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D] focus:bg-white'
              : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-teal-500'
        }`}
      />
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400">
        {icon}
      </span>
    </div>
    {error && <p className="mt-1 text-[11px] font-bold text-rose-500">{error}</p>}
  </div>
);

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  show: boolean;
  icon: React.ReactNode;
  placeholder?: string;
  error?: string;
  isLight: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({ id, label, value, show, icon, placeholder, error, isLight, onChange, onToggle }) => (
  <div>
    <label htmlFor={id} className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-2xl pl-11 pr-11 py-2.5 text-xs font-bold border focus:outline-none transition-colors ${
          error
            ? 'border-rose-400 bg-rose-50 focus:border-rose-500'
            : isLight
              ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D] focus:bg-white'
              : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-teal-500'
        }`}
      />
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400">
        {icon}
      </span>
      <button type="button" onClick={onToggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
        {show ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4 text-[#0F8B8D]" />}
      </button>
    </div>
    {error && <p className="mt-1 text-[11px] font-bold text-rose-500">{error}</p>}
  </div>
);

interface SubmitButtonProps {
  isLoading: boolean;
  isLight: boolean;
  loadingText: string;
  text: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, isLight, loadingText, text }) => (
  <div className="pt-2">
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full py-3 px-6 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
        isLoading ? 'opacity-75 cursor-wait' : 'hover:-translate-y-0.5 active:translate-y-0'
      } ${isLight ? 'bg-[#0F8B8D] text-white hover:bg-[#0B2545] shadow-[#0F8B8D]/20' : 'bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-teal-500/20'}`}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </button>
  </div>
);
