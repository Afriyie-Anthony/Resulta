import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Badge } from '../../ui/Badge';
import { FiPieChart, FiGlobe, FiSmartphone } from 'react-icons/fi';
import type { ReportsAnalyticsData } from './types';

interface ChannelSplitCardProps {
  channelSplit?: ReportsAnalyticsData['channelSplit'];
  isLoading?: boolean;
}

export const ChannelSplitCard: React.FC<ChannelSplitCardProps> = ({
  channelSplit,
  isLoading = false,
}) => {
  const { isLight } = useAdminTheme();

  if (isLoading || !channelSplit) {
    return (
      <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-4 animate-pulse ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
        <div className="h-10 bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
        <div className="h-10 bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
      </div>
    );
  }

  const { web, ussd } = channelSplit;

  return (
    <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-5 ${
      isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
    }`}>
      <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
        <h3 className={`text-base font-black flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
          <FiPieChart className="text-[#0F8B8D]" /> Web vs USSD Channel Split
        </h3>
        <Badge variant="primary" className="text-[10px] font-black uppercase">
          TELEMETRY
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Web Channel */}
        <div>
          <div className="flex justify-between text-xs font-black mb-1.5">
            <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-950' : 'text-white'}`}>
              <FiGlobe className="text-[#0F8B8D]" /> Web Portal (Online)
            </span>
            <span className="text-[#0F8B8D] dark:text-teal-400 font-mono font-black">
              {web.percentage.toFixed(1)}%
            </span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden border ${
            isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
          }`}>
            <div
              className="h-full bg-gradient-to-r from-[#0B2545] to-[#0F8B8D] rounded-full transition-all duration-700"
              style={{ width: `${Math.min(web.percentage, 100)}%` }}
            />
          </div>
          <span className={`text-[11px] font-semibold block mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {web.orders.toLocaleString()} orders fulfilled online
          </span>
        </div>

        {/* USSD Channel */}
        <div>
          <div className="flex justify-between text-xs font-black mb-1.5">
            <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-950' : 'text-white'}`}>
              <FiSmartphone className="text-amber-600" /> USSD Feature Phone (*713#)
            </span>
            <span className="text-amber-600 dark:text-amber-400 font-mono font-black">
              {ussd.percentage.toFixed(1)}%
            </span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden border ${
            isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
          }`}>
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(ussd.percentage, 100)}%` }}
            />
          </div>
          <span className={`text-[11px] font-semibold block mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {ussd.orders.toLocaleString()} orders fulfilled via USSD
          </span>
        </div>
      </div>
    </div>
  );
};
