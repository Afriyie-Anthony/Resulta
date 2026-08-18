import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import type { Customer } from './types';
import { formatCedi } from '../../../utils/formatters';
import { FiUsers, FiAward, FiTrendingUp, FiShoppingBag } from 'react-icons/fi';

interface CustomersKpiGridProps {
  customers: Customer[];
  onSelectFilter: (status: string) => void;
}

export const CustomersKpiGrid: React.FC<CustomersKpiGridProps> = ({ customers, onSelectFilter }) => {
  const { isLight } = useAdminTheme();

  const totalSpend = customers.reduce((sum, cust) => sum + cust.spent, 0);
  const vipCount = customers.filter(c => c.status === 'VIP BUYER').length;
  const avgOrders = customers.length > 0 ? (customers.reduce((s, c) => s + c.totalOrders, 0) / customers.length).toFixed(1) : '5.6';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Registered Accounts */}
      <div
        onClick={() => onSelectFilter('ALL')}
        className={`p-3.5 rounded-2xl border border-t-4 transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
          isLight
            ? 'bg-white border-slate-300 border-t-cyan-500 hover:border-slate-400'
            : 'bg-slate-900/90 border-slate-800 border-t-cyan-500 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            Total Accounts
          </span>
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
            isLight ? 'bg-cyan-100/80 text-cyan-800 border border-cyan-200' : 'bg-teal-500/20 text-teal-400 font-black'
          }`}>
            <FiUsers className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
          4,227
        </p>
        <div className="mt-1.5 flex items-center justify-between text-[11px] font-semibold">
          <span className={isLight ? 'text-slate-700 font-bold' : 'text-slate-400'}>+342 this month</span>
          <span className={`text-[10px] font-black px-2 py-0.2 rounded-full ${
            isLight ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-emerald-500/15 text-emerald-300'
          }`}>
            +8.8%
          </span>
        </div>
      </div>

      {/* 2. VIP & Bulk Purchasers */}
      <div
        onClick={() => onSelectFilter('VIP BUYER')}
        className={`p-3.5 rounded-2xl border border-t-4 transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
          isLight
            ? 'bg-white border-slate-300 border-t-emerald-500 hover:border-slate-400'
            : 'bg-slate-900/90 border-slate-800 border-t-emerald-500 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            VIP Buyers
          </span>
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
            isLight ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200' : 'bg-emerald-500/20 text-emerald-400 font-black'
          }`}>
            <FiAward className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className={`text-xl font-black tracking-tight ${isLight ? 'text-emerald-950' : 'text-emerald-400'}`}>
          {vipCount} Accounts
        </p>
        <div className="mt-1.5 flex items-center justify-between text-[11px] font-bold">
          <span className={isLight ? 'text-slate-700' : 'text-slate-400'}>High LTV tier</span>
          <span className={`text-[10px] font-black px-2 py-0.2 rounded-full ${
            isLight ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-amber-500/15 text-amber-300'
          }`}>
            Priority Tier
          </span>
        </div>
      </div>

      {/* 3. Sample Cohort Value */}
      <div
        onClick={() => onSelectFilter('ALL')}
        className={`p-3.5 rounded-2xl border border-t-4 transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
          isLight
            ? 'bg-white border-slate-300 border-t-amber-500 hover:border-slate-400'
            : 'bg-slate-900/90 border-slate-800 border-t-amber-500 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            Cohort Value
          </span>
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
            isLight ? 'bg-amber-100/80 text-amber-800 border border-amber-200' : 'bg-amber-500/20 text-amber-400 font-black'
          }`}>
            <FiTrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-amber-400'}`}>
          {formatCedi(totalSpend)}
        </p>
        <div className="mt-1.5 flex items-center justify-between text-[11px] font-bold">
          <span className={isLight ? 'text-slate-700' : 'text-slate-400'}>Tracked cohort spend</span>
          <span className="text-[10px] font-black text-amber-800 dark:text-amber-300">
            Strong LTV
          </span>
        </div>
      </div>

      {/* 4. Average Voucher Volume */}
      <div
        onClick={() => onSelectFilter('ALL')}
        className={`p-3.5 rounded-2xl border border-t-4 transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
          isLight
            ? 'bg-white border-slate-300 border-t-purple-500 hover:border-slate-400'
            : 'bg-slate-900/90 border-slate-800 border-t-purple-500 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            Avg Order Volume
          </span>
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
            isLight ? 'bg-purple-100/80 text-purple-800 border border-purple-200' : 'bg-purple-500/20 text-purple-400 font-black'
          }`}>
            <FiShoppingBag className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
          {avgOrders} Vouchers
        </p>
        <div className="mt-1.5 flex items-center justify-between text-[11px] font-bold">
          <span className={isLight ? 'text-slate-700' : 'text-slate-400'}>Per registered account</span>
          <span className={`text-[10px] font-black px-2 py-0.2 rounded-full ${
            isLight ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-purple-500/15 text-purple-300'
          }`}>
            Repeat Rate
          </span>
        </div>
      </div>
    </div>
  );
};
