import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiPieChart } from 'react-icons/fi';
import { useInventoryStats } from '../../../hooks/useVouchers';

export const SalesByTypeCard: React.FC = () => {
  const { isLight } = useAdminTheme();
  const { data: inventoryStats, isLoading } = useInventoryStats();

  const statsObj = inventoryStats as unknown as
    | Record<string, { sold?: number; total?: number } | undefined>
    | undefined;
  const wassceStats =
    statsObj?.wassce_novdec ||
    statsObj?.wassceNovdec ||
    statsObj?.WASSCE_NOVDEC ||
    statsObj?.wassce ||
    { sold: 0, total: 0 };
  const beceStats =
    statsObj?.bece || statsObj?.BECE || { sold: 0, total: 0 };

  const wassceSold = wassceStats.sold || 0;
  const beceSold = beceStats.sold || 0;
  const totalSold = wassceSold + beceSold;

  const becePct = totalSold > 0 ? (beceSold / totalSold) * 100 : 50;

  // Circumference for r=58 is 2 * PI * 58 = ~364.42
  const circumference = 364.42;
  const beceOffset = circumference * (1 - becePct / 100);

  return (
    <div className={`p-6 rounded-3xl border flex flex-col justify-between h-full transition-colors ${
      isLight ? 'bg-white border-slate-200/90 shadow-md text-primary' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
    }`}>
      <div>
        <div className="flex items-center gap-2">
          <FiPieChart className={`w-5 h-5 ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`} />
          <h3 className={`text-lg font-bold tracking-tight ${isLight ? 'text-[#123B5D]' : 'text-white'}`}>
            Voucher Sales by Type
          </h3>
        </div>
        <p className={`text-xs mt-1 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Distribution across major exams
        </p>
      </div>

      {/* Donut Chart Visual */}
      <div className="py-6 flex items-center justify-center relative">
        <svg className="w-52 h-52 transform -rotate-90 drop-shadow-sm" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="58"
            stroke="currentColor"
            strokeWidth="16"
            fill="transparent"
            className="text-purple-500 dark:text-purple-400"
          />
          <circle
            cx="80"
            cy="80"
            r="58"
            stroke="currentColor"
            strokeWidth="16"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={beceOffset}
            strokeLinecap="round"
            className="text-[#F5B014] transition-all duration-1000"
          />
        </svg>
        {/* Centered Total Indicator */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">TOTAL VOUCHERS SOLD</span>
          <span className={`text-xl font-bold ${isLight ? 'text-primary' : 'text-white'}`}>
            {isLoading ? '...' : `${totalSold.toLocaleString()} Sold`}
          </span>
        </div>
      </div>

      {/* Legend Below */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
        <div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500 uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
            WASSCE / NOVDEC
          </div>
          <span className={`text-base font-bold mt-1 block ${isLight ? 'text-primary' : 'text-white'}`}>
            {isLoading ? '...' : wassceSold.toLocaleString()}
          </span>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500 uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5B014] shrink-0" />
            BECE
          </div>
          <span className={`text-base font-bold mt-1 block ${isLight ? 'text-primary' : 'text-white'}`}>
            {isLoading ? '...' : beceSold.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
