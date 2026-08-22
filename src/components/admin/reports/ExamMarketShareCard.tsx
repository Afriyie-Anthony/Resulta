import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiPieChart } from 'react-icons/fi';
import type { ReportsAnalyticsData } from './types';

interface ExamMarketShareCardProps {
  marketShare?: ReportsAnalyticsData['examMarketShare'];
  isLoading?: boolean;
}

export const ExamMarketShareCard: React.FC<ExamMarketShareCardProps> = ({
  marketShare,
  isLoading = false,
}) => {
  const { isLight } = useAdminTheme();

  if (isLoading || !marketShare) {
    return (
      <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-4 animate-pulse ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
        <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
      </div>
    );
  }

  const { wassce, bece } = marketShare;

  return (
    <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-4 ${
      isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
    }`}>
      <h3 className={`text-base font-black border-b pb-3 flex items-center gap-2 ${
        isLight ? 'border-slate-200 text-slate-950' : 'border-slate-800 text-white'
      }`}>
        <FiPieChart className="text-cyan-600" /> Exam Checker Market Share
      </h3>

      <div className="flex items-center gap-4">
        {/* Visual Ring / Donut */}
        <div className="w-20 h-20 rounded-full border-8 border-cyan-500 border-t-amber-500 flex items-center justify-center shrink-0 shadow-inner">
          <span className="text-xs font-black text-slate-950 dark:text-white">100%</span>
        </div>

        <div className="space-y-2 text-xs font-bold flex-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500 shrink-0" />
              <span className={isLight ? 'text-slate-900' : 'text-slate-200'}>WASSCE</span>
            </div>
            <span className="font-black text-cyan-600 dark:text-cyan-400 font-mono">
              {wassce.percentage.toFixed(1)}% ({wassce.vouchers.toLocaleString()})
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
              <span className={isLight ? 'text-slate-900' : 'text-slate-200'}>BECE</span>
            </div>
            <span className="font-black text-amber-600 dark:text-amber-400 font-mono">
              {bece.percentage.toFixed(1)}% ({bece.vouchers.toLocaleString()})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
