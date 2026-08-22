import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiCalendar } from 'react-icons/fi';
import type { ReportPeriod } from './types';

interface ReportsPeriodFilterProps {
  period: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
}

export const ReportsPeriodFilter: React.FC<ReportsPeriodFilterProps> = ({
  period,
  onPeriodChange,
}) => {
  const { isLight } = useAdminTheme();

  const periods: ReportPeriod[] = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];

  return (
    <div className={`p-3 rounded-3xl border transition-colors shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 ${
      isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
    }`}>
      <div className="flex items-center gap-2">
        <FiCalendar className="text-[#0F8B8D] dark:text-teal-400 w-4 h-4" />
        <span className={`text-xs font-black uppercase ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
          Reporting Window:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {periods.map((range) => (
          <button
            key={range}
            type="button"
            onClick={() => onPeriodChange(range)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
              period === range
                ? isLight
                  ? 'bg-[#0F8B8D] text-white shadow-xs'
                  : 'bg-teal-500 text-slate-950 font-black shadow-xs'
                : isLight
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-extrabold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
};
