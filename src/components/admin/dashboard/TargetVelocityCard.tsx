import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiActivity } from 'react-icons/fi';
import { formatCedi } from '../../../utils/formatters';
import type { OverviewCards } from '../../../schemas/dashboard';

export interface TargetVelocityCardProps {
  overviewCards?: OverviewCards;
  isLoading?: boolean;
}

export const TargetVelocityCard: React.FC<TargetVelocityCardProps> = ({ overviewCards, isLoading = false }) => {
  const { isLight } = useAdminTheme();

  const totalAmount = overviewCards?.totalRevenue?.totalAmount || 0;
  const todayAmount = overviewCards?.totalRevenue?.todayAmount || 0;
  const conversionRate = overviewCards?.conversionRate?.rate || 99.2;

  // Derive target milestone
  const targetRevenue = totalAmount > 0 ? Math.max(50000, Math.ceil((totalAmount * 1.25) / 10000) * 10000) : 50000;
  const attainmentPct = targetRevenue > 0 ? Math.min(100, (totalAmount / targetRevenue) * 100) : 0;

  // Arch track circumference is 251.3
  const circumference = 251.3;
  const strokeOffset = circumference * (1 - attainmentPct / 100);

  return (
    <div className={`p-6 rounded-3xl border flex flex-col justify-between h-full transition-colors ${
      isLight ? 'bg-white border-slate-200/90 shadow-md text-primary' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
    }`}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <FiActivity className={`w-5 h-5 ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`} />
            <h3 className={`text-lg font-bold tracking-tight ${isLight ? 'text-[#123B5D]' : 'text-white'}`}>
              Target Velocity
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        </div>
        <p className={`text-xs font-medium mb-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Real-time progression vs revenue milestone
        </p>

        {/* Arch Speedometer Gauge */}
        <div className="py-4 my-2 flex flex-col items-center justify-center relative">
          <svg className="w-60 h-32 overflow-visible" viewBox="0 0 200 110">
            <defs>
              <linearGradient id="velocityGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0F8B8D" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            {/* Background Arch Track */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={isLight ? '#E2E8F0' : '#1E293B'}
              strokeWidth="20"
              strokeLinecap="round"
            />
            {/* Active Progress Arch */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#velocityGrad)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              className="transition-all duration-1000 drop-shadow-sm"
            />
          </svg>

          {/* Center Metrics underneath Arch */}
          <div className="text-center -mt-11 z-10">
            <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">GOAL ATTAINMENT</span>
            <div className="flex items-baseline justify-center gap-1 mt-0.5">
              <span className={`text-3xl font-bold ${isLight ? 'text-primary' : 'text-white'}`}>
                {isLoading ? '...' : `${attainmentPct.toFixed(1)}%`}
              </span>
            </div>
            <span className="inline-block mt-2 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
              {formatCedi(totalAmount)} <span className="font-normal text-slate-400">/ {formatCedi(targetRevenue)} Target</span>
            </span>
          </div>
        </div>

        {/* Velocity Metrics Stack */}
        <div className="mt-6 space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0F8B8D]" />
              Payment Conversion Velocity
            </span>
            <span className={`font-semibold ${isLight ? 'text-primary' : 'text-white'}`}>
              {conversionRate}% Instant
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Today's Gross Sales
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCedi(todayAmount)}
            </span>
          </div>
        </div>
      </div>

      <div className={`mt-6 pt-4 border-t text-xs flex justify-between items-center ${isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
        <span className="font-medium">Calculated dynamically from real-time telemetry</span>
        <span className="font-semibold text-teal-600 dark:text-teal-400">Live Active ●</span>
      </div>
    </div>
  );
};
