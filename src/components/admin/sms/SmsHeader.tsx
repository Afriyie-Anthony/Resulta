import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiMessageSquare } from 'react-icons/fi';

export const SmsHeader: React.FC = () => {
  const { isLight } = useAdminTheme();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className={`p-2.5 rounded-2xl ${
          isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/20 text-teal-400'
        }`}>
          <FiMessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Bulk SMS Module & Communications
          </h1>
          <p className={`text-xs sm:text-sm font-semibold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Broadcast promotional campaigns, announcement alerts, and result release updates. Segment target audiences by transaction status and examination checker type.
          </p>
        </div>
      </div>
    </div>
  );
};
