import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { formatCedi } from '../../../utils/formatters';
import {
  FiDollarSign,
  FiTrendingUp,
  FiShoppingBag,
  FiCheckCircle,
} from 'react-icons/fi';
import type { ReportsAnalyticsData } from './types';

interface ReportsKpiGridProps {
  summary?: ReportsAnalyticsData['summary'];
  isLoading?: boolean;
}

export const ReportsKpiGrid: React.FC<ReportsKpiGridProps> = ({
  summary,
  isLoading = false,
}) => {
  const { isLight } = useAdminTheme();

  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`p-4 rounded-2xl animate-pulse space-y-3 border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="w-7 h-7 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
            <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const growthFormatted =
    summary.growthPercentage >= 0
      ? `+${summary.growthPercentage.toFixed(1)}%`
      : `${summary.growthPercentage.toFixed(1)}%`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Gross Revenue */}
      <div className={`p-3.5 rounded-2xl border border-t-4 transition-all shadow-2xs ${
        isLight ? 'bg-white border-slate-300 border-t-emerald-500' : 'bg-slate-900/90 border-slate-800 border-t-emerald-500'
      }`}>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            Gross Revenue
          </span>
          <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center text-xs">
            <FiDollarSign className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className="text-xl font-black tracking-tight text-emerald-700 dark:text-emerald-400">
          {formatCedi(summary.grossRevenue)}
        </p>
        <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1">
          <FiTrendingUp className="w-3 h-3" /> {growthFormatted} vs previous period
        </p>
      </div>

      {/* 2. WASSCE Volume */}
      <div className={`p-3.5 rounded-2xl border border-t-4 transition-all shadow-2xs ${
        isLight ? 'bg-white border-slate-300 border-t-cyan-500' : 'bg-slate-900/90 border-slate-800 border-t-cyan-500'
      }`}>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            WASSCE 2026 Volume
          </span>
          <div className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-800 dark:bg-teal-500/20 dark:text-teal-400 flex items-center justify-center text-xs">
            <FiShoppingBag className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
          {summary.wassceVolume.vouchers.toLocaleString()} <span className="text-xs font-bold text-slate-500">vouchers</span>
        </p>
        <p className={`text-[11px] font-bold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
          Gross: {formatCedi(summary.wassceVolume.gross)}
        </p>
      </div>

      {/* 3. BECE Volume */}
      <div className={`p-3.5 rounded-2xl border border-t-4 transition-all shadow-2xs ${
        isLight ? 'bg-white border-slate-300 border-t-amber-500' : 'bg-slate-900/90 border-slate-800 border-t-amber-500'
      }`}>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            BECE 2026 Volume
          </span>
          <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center text-xs">
            <FiShoppingBag className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className={`text-xl font-black tracking-tight ${isLight ? 'text-amber-950' : 'text-amber-400'}`}>
          {summary.beceVolume.vouchers.toLocaleString()} <span className="text-xs font-bold text-slate-500">vouchers</span>
        </p>
        <p className={`text-[11px] font-bold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
          Gross: {formatCedi(summary.beceVolume.gross)}
        </p>
      </div>

      {/* 4. Total Vouchers Sold */}
      <div className={`p-3.5 rounded-2xl border border-t-4 transition-all shadow-2xs ${
        isLight ? 'bg-white border-slate-300 border-t-purple-500' : 'bg-slate-900/90 border-slate-800 border-t-purple-500'
      }`}>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            Total Vouchers Sold
          </span>
          <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center text-xs">
            <FiCheckCircle className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
          {summary.totalVouchersSold.toLocaleString()} <span className="text-xs font-bold text-slate-500">Units</span>
        </p>
        <p className={`text-[11px] font-bold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
          Avg checkout: {formatCedi(summary.averageCheckoutPerUnit)} / unit
        </p>
      </div>
    </div>
  );
};
