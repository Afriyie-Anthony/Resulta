import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import type { Customer } from './types';
import { formatCedi } from '../../../utils/formatters';
import { FiUsers, FiAward, FiTrendingUp, FiPieChart } from 'react-icons/fi';

interface CustomersKpiGridProps {
  customers: Customer[];
  onSelectFilter: (status: string, network: string) => void;
}

export const CustomersKpiGrid: React.FC<CustomersKpiGridProps> = ({ customers, onSelectFilter }) => {
  const { isLight } = useAdminTheme();

  // Calculate statistics from loaded dataset
  const totalSpend = customers.reduce((sum, cust) => sum + cust.spent, 0);
  const vipCount = customers.filter(c => c.status === 'VIP BUYER').length;
  const avgOrders = customers.length > 0 ? (customers.reduce((s, c) => s + c.totalOrders, 0) / customers.length).toFixed(1) : '1.0';

  // Network breakdowns
  const mtnCount = customers.filter(c => c.network === 'MTN MoMo').length;
  const telecelCount = customers.filter(c => c.network === 'Telecel Cash').length;
  const atCount = customers.filter(c => c.network === 'AirtelTigo').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Registered Accounts (Subtle Cyan / Teal Tint) */}
      <div
        onClick={() => onSelectFilter('ALL', 'ALL')}
        className={`p-5 rounded-3xl border transition-all cursor-pointer transform hover:scale-[1.02] active:scale-100 shadow-sm ${
          isLight
            ? 'bg-cyan-50/50 border-cyan-200/70 hover:bg-cyan-50/80 hover:border-cyan-300'
            : 'bg-teal-950/20 border-teal-500/30 hover:border-teal-500/50'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-black uppercase tracking-wider ${
            isLight ? 'text-cyan-900/80' : 'text-slate-400'
          }`}>
            Total Registered Accounts
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
            isLight ? 'bg-cyan-600/15 text-cyan-800' : 'bg-teal-500/20 text-teal-400 font-black'
          }`}>
            <FiUsers className="w-4 h-4" />
          </div>
        </div>
        <p className={`text-2xl font-black tracking-tight ${isLight ? 'text-cyan-950' : 'text-white'}`}>
          4,227 Accounts
        </p>
        <div className="mt-2.5 flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>+342 new this month</span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
            isLight ? 'bg-white/80 text-emerald-700 border border-emerald-200' : 'bg-emerald-500/10 text-emerald-400'
          }`}>
            +8.8%
          </span>
        </div>
      </div>

      {/* 2. VIP & Bulk Purchasers (Subtle Emerald / Mint Tint) */}
      <div
        onClick={() => onSelectFilter('VIP BUYER', 'ALL')}
        className={`p-5 rounded-3xl border transition-all cursor-pointer transform hover:scale-[1.02] active:scale-100 shadow-sm ${
          isLight
            ? 'bg-emerald-50/50 border-emerald-200/70 hover:bg-emerald-50/80 hover:border-emerald-300'
            : 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-black uppercase tracking-wider ${
            isLight ? 'text-emerald-900/80' : 'text-slate-400'
          }`}>
            VIP / Bulk Buyers
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
            isLight ? 'bg-emerald-600/15 text-emerald-800' : 'bg-emerald-500/20 text-emerald-400 font-black'
          }`}>
            <FiAward className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <p className={`text-2xl font-black tracking-tight ${isLight ? 'text-emerald-950' : 'text-emerald-400'}`}>
            {vipCount} {vipCount === 1 ? 'Account' : 'Accounts'}
          </p>
          <span className="text-xs font-bold text-slate-400">High LTV tier</span>
        </div>
        <p className={`text-xs font-semibold mt-2.5 ${isLight ? 'text-emerald-800/90' : 'text-emerald-300/80'}`}>
          Click to filter repeat high-volume buyers
        </p>
      </div>

      {/* 3. Tracked Lifetime Value (Subtle Amber / Warm Cream Tint) */}
      <div
        onClick={() => onSelectFilter('ALL', 'ALL')}
        className={`p-5 rounded-3xl border transition-all cursor-pointer transform hover:scale-[1.02] active:scale-100 shadow-sm ${
          isLight
            ? 'bg-amber-50/50 border-amber-200/70 hover:bg-amber-50/80 hover:border-amber-300'
            : 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-black uppercase tracking-wider ${
            isLight ? 'text-amber-900/80' : 'text-slate-400'
          }`}>
            Sample Cohort Value
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
            isLight ? 'bg-amber-500/15 text-amber-800' : 'bg-amber-500/20 text-amber-400 font-black'
          }`}>
            <FiTrendingUp className="w-4 h-4" />
          </div>
        </div>
        <p className={`text-2xl font-black tracking-tight ${isLight ? 'text-amber-950' : 'text-amber-400'}`}>
          {formatCedi(totalSpend)}
        </p>
        <div className="mt-2.5 flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>Avg {avgOrders} PINs per account</span>
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
            Strong repeat rate
          </span>
        </div>
      </div>

      {/* 4. MoMo Carrier Market Split (Subtle Sky Blue / Indigo Tint) */}
      <div
        onClick={() => onSelectFilter('ALL', 'ALL')}
        className={`p-5 rounded-3xl border transition-colors shadow-sm flex flex-col justify-between cursor-pointer transform hover:scale-[1.02] active:scale-100 ${
          isLight ? 'bg-blue-50/40 border-blue-200/60 hover:bg-blue-50/70 hover:border-blue-300' : 'bg-blue-950/20 border-blue-500/30 hover:border-blue-500/50'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-[11px] font-black uppercase tracking-wider ${
            isLight ? 'text-blue-900/80' : 'text-slate-400'
          }`}>
            Carrier Share
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
            isLight ? 'bg-blue-600/15 text-blue-800' : 'bg-blue-500/20 text-blue-400 font-black'
          }`}>
            <FiPieChart className="w-4 h-4" />
          </div>
        </div>
        <div className="space-y-2 text-xs font-bold">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" /> MTN MoMo
            </span>
            <span className={`font-black ${isLight ? 'text-blue-950' : 'text-white'}`}>{mtnCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" /> Telecel Cash
            </span>
            <span className={`font-black ${isLight ? 'text-blue-950' : 'text-white'}`}>{telecelCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" /> AirtelTigo
            </span>
            <span className={`font-black ${isLight ? 'text-blue-950' : 'text-white'}`}>{atCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
