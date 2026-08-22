import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiZap, FiRadio, FiCheckCircle } from 'react-icons/fi';

interface SmsKpiGridProps {
  totalDispatchedLogs?: number;
}

export const SmsKpiGrid: React.FC<SmsKpiGridProps> = ({ totalDispatchedLogs = 0 }) => {
  const { isLight } = useAdminTheme();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 1. Available Credits */}
      <div className={`p-3.5 rounded-2xl border border-t-4 transition-all shadow-2xs ${
        isLight ? 'bg-white border-slate-300 border-t-emerald-500' : 'bg-slate-900/90 border-slate-800 border-t-emerald-500'
      }`}>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            Available SMS Gateway
          </span>
          <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center text-xs">
            <FiZap className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
          Direct Tier-1 <span className="text-xs font-bold text-slate-500">Route</span>
        </p>
        <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1">
          <FiCheckCircle className="w-3 h-3" /> Arkesel & Hubtel Gateways Live
        </p>
      </div>

      {/* 2. Registered Sender ID */}
      <div className={`p-3.5 rounded-2xl border border-t-4 transition-all shadow-2xs ${
        isLight ? 'bg-white border-slate-300 border-t-cyan-500' : 'bg-slate-900/90 border-slate-800 border-t-cyan-500'
      }`}>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            Registered Sender ID
          </span>
          <div className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-800 dark:bg-teal-500/20 dark:text-teal-400 flex items-center justify-center text-xs">
            <FiRadio className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className={`text-xl font-mono font-black tracking-wider ${isLight ? 'text-[#0B2545]' : 'text-teal-400'}`}>
          RESULTA
        </p>
        <p className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400 mt-1">
          NCA & Telco Verified Alphanumeric ID
        </p>
      </div>

      {/* 3. Delivery Rate / Total Campaigns */}
      <div className={`p-3.5 rounded-2xl border border-t-4 transition-all shadow-2xs ${
        isLight ? 'bg-white border-slate-300 border-t-purple-500' : 'bg-slate-900/90 border-slate-800 border-t-purple-500'
      }`}>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            Campaign Broadcast History
          </span>
          <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center text-xs">
            <FiCheckCircle className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
          {totalDispatchedLogs} <span className="text-xs font-bold text-slate-500">Transmissions</span>
        </p>
        <p className="text-[11px] font-bold text-purple-700 dark:text-purple-400 mt-1">
          99.94% Delivery success rate
        </p>
      </div>
    </div>
  );
};
