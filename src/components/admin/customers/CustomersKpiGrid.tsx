import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import type { CustomerStats } from './types';
import { formatCedi } from '../../../utils/formatters';
import { FiUsers, FiAward, FiTrendingUp, FiRepeat } from 'react-icons/fi';

interface CustomersKpiGridProps {
  stats: CustomerStats | undefined;
  isLoading?: boolean;
  onSelectFilter: (segment: string) => void;
}

const SkeletonCard: React.FC<{ isLight: boolean }> = ({ isLight }) => (
  <div className={`p-3.5 rounded-2xl border border-t-4 animate-pulse ${
    isLight ? 'bg-white border-slate-300 border-t-slate-300' : 'bg-slate-900/90 border-slate-800 border-t-slate-700'
  }`}>
    <div className={`h-3 rounded-full mb-3 w-24 ${isLight ? 'bg-slate-200' : 'bg-slate-700'}`} />
    <div className={`h-6 rounded-full mb-2 w-20 ${isLight ? 'bg-slate-200' : 'bg-slate-700'}`} />
    <div className={`h-2.5 rounded-full w-32 ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`} />
  </div>
);

export const CustomersKpiGrid: React.FC<CustomersKpiGridProps> = ({
  stats,
  isLoading = false,
  onSelectFilter,
}) => {
  const { isLight } = useAdminTheme();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} isLight={isLight} />)}
      </div>
    );
  }

  const { overview, segments } = stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* 1. Total Unique Customers */}
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
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
            isLight ? 'bg-cyan-100/80 text-cyan-800 border border-cyan-200' : 'bg-teal-500/20 text-teal-400'
          }`}>
            <FiUsers className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
          {overview.totalUniqueCustomers.toLocaleString()}
        </p>
        <div className="mt-1.5 flex items-center justify-between text-[11px] font-semibold">
          <span className={isLight ? 'text-slate-700 font-bold' : 'text-slate-400'}>Unique phone accounts</span>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
            isLight ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-emerald-500/15 text-emerald-300'
          }`}>
            Live
          </span>
        </div>
      </div>

      {/* 2. VIP Buyers */}
      <div
        onClick={() => onSelectFilter('VIP')}
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
            VIP Buyers
          </span>
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
            isLight ? 'bg-amber-100/80 text-amber-800 border border-amber-200' : 'bg-amber-500/20 text-amber-400'
          }`}>
            <FiAward className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className={`text-xl font-black tracking-tight ${isLight ? 'text-amber-900' : 'text-amber-400'}`}>
          {segments.VIP.toLocaleString()} Accounts
        </p>
        <div className="mt-1.5 flex items-center justify-between text-[11px] font-bold">
          <span className={isLight ? 'text-slate-700' : 'text-slate-400'}>
            {segments.RETURNING.toLocaleString()} returning
          </span>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
            isLight ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-amber-500/15 text-amber-300'
          }`}>
            Priority Tier
          </span>
        </div>
      </div>

      {/* 3. Average CLV */}
      <div
        onClick={() => onSelectFilter('ALL')}
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
            Avg. Lifetime Value
          </span>
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
            isLight ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            <FiTrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-emerald-400'}`}>
          {formatCedi(overview.averageCustomerLifetimeValue)}
        </p>
        <div className="mt-1.5 flex items-center justify-between text-[11px] font-bold">
          <span className={isLight ? 'text-slate-700' : 'text-slate-400'}>Per unique account</span>
          <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-300">
            Strong LTV
          </span>
        </div>
      </div>

      {/* 4. Repeat Customer Rate */}
      <div
        onClick={() => onSelectFilter('RETURNING')}
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
            Repeat Rate
          </span>
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
            isLight ? 'bg-purple-100/80 text-purple-800 border border-purple-200' : 'bg-purple-500/20 text-purple-400'
          }`}>
            <FiRepeat className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
          {overview.repeatCustomerRate.toFixed(1)}%
        </p>
        <div className="mt-1.5 flex items-center justify-between text-[11px] font-bold">
          <span className={isLight ? 'text-slate-700' : 'text-slate-400'}>Returning buyers</span>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
            isLight ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-purple-500/15 text-purple-300'
          }`}>
            Repeat Rate
          </span>
        </div>
      </div>

    </div>
  );
};
