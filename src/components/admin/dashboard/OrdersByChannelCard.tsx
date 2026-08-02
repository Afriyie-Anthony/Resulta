import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiLayers } from 'react-icons/fi';

export const OrdersByChannelCard: React.FC = () => {
  const { isLight } = useAdminTheme();

  return (
    <div className={`p-6 rounded-3xl border flex flex-col justify-between h-full transition-colors ${
      isLight ? 'bg-white border-slate-200/90 shadow-md text-primary' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
    }`}>
      <div>
        <div className="flex items-center gap-2">
          <FiLayers className={`w-5 h-5 ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`} />
          <h3 className={`text-lg font-black tracking-tight ${isLight ? 'text-[#123B5D]' : 'text-white'}`}>
            Orders by Channel
          </h3>
        </div>
        <p className={`text-xs mt-1 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Transaction source platform breakdown
        </p>
      </div>

      <div className="py-8 my-auto flex flex-col items-center justify-center">
        {/* Ring Chart with center content */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 160 160">
            {/* Website slice background (Pink) */}
            <circle
              cx="80"
              cy="80"
              r="62"
              stroke="#F472B6"
              strokeWidth="22"
              fill="transparent"
            />
            {/* USSD dominant slice (99% Lime Green) */}
            <circle
              cx="80"
              cy="80"
              r="62"
              stroke="#A3E635"
              strokeWidth="22"
              fill="transparent"
              strokeDasharray={389.5}
              strokeDashoffset={389.5 * 0.01}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>

          {/* Centered Floating Pill Badge */}
          <div className="absolute px-3 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider shadow-lg border border-slate-700/80 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
            USSD DOMINANT
          </div>
        </div>

        {/* Channel Comparison Cards */}
        <div className="w-full grid grid-cols-2 gap-4 mt-8">
          <div className={`p-4 rounded-2xl border text-center transition-colors ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
              <span className="w-3 h-3 rounded-full bg-[#A3E635]" />
              USSD
            </div>
            <span className={`text-2xl font-black mt-1 block ${isLight ? 'text-primary' : 'text-white'}`}>
              6119 <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">(99%)</span>
            </span>
          </div>

          <div className={`p-4 rounded-2xl border text-center transition-colors ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
              <span className="w-3 h-3 rounded-full bg-[#F472B6]" />
              WEBSITE
            </div>
            <span className={`text-2xl font-black mt-1 block ${isLight ? 'text-primary' : 'text-white'}`}>
              62 <span className="text-xs font-bold text-pink-500">(1%)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
