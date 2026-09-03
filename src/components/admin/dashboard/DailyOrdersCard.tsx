import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Badge } from '../../ui/Badge';
import { FiTrendingUp } from 'react-icons/fi';

export interface DailyOrdersCardProps {
  data?: Array<{ day: string; date?: string; revenue: number; ordersCount: number }>;
  isLoading?: boolean;
}

export const DailyOrdersCard: React.FC<DailyOrdersCardProps> = ({ data = [], isLoading = false }) => {
  const { isLight } = useAdminTheme();

  // If no data provided, create empty default 7-day structure
  const defaultDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyData = data.length > 0
    ? data.map((item) => ({
        day: item.day,
        count: item.ordersCount || 0,
        revenue: item.revenue || 0,
      }))
    : defaultDays.map((day) => ({
        day,
        count: 0,
        revenue: 0,
      }));

  const maxOrders = Math.max(...dailyData.map((d) => d.count), 1);
  const totalOrders = dailyData.reduce((sum, d) => sum + d.count, 0);
  const peakDay = dailyData.reduce((max, d) => (d.count > max.count ? d : max), dailyData[0]);

  return (
    <div className={`p-6 rounded-3xl border flex flex-col justify-between h-full transition-colors ${
      isLight ? 'bg-white border-slate-200/90 shadow-md text-primary' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
    }`}>
      <div>
        <div className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-2">
            <FiTrendingUp className={`w-5 h-5 ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`} />
            <h3 className={`text-lg font-bold tracking-tight ${isLight ? 'text-[#123B5D]' : 'text-white'}`}>
              Daily Orders
            </h3>
          </div>
          <Badge variant="info" className="text-[10px] font-medium">
            {isLoading ? 'Loading...' : `${totalOrders.toLocaleString()} Total Orders`}
          </Badge>
        </div>
        <p className={`text-xs mt-1 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Order volume over the past 7 days
        </p>
      </div>

      {/* Bar Chart Container */}
      <div className="pt-6 pb-2 flex gap-4 items-end h-64">
        {/* Y-Axis scale */}
        <div className="flex flex-col justify-between h-52 text-[10px] font-medium text-slate-400 pb-5 shrink-0 text-right">
          <span>{maxOrders}</span>
          <span>{Math.round(maxOrders * 0.66)}</span>
          <span>{Math.round(maxOrders * 0.33)}</span>
          <span>0</span>
        </div>

        {/* Day Columns */}
        <div className="flex-1 flex justify-between items-end gap-2 sm:gap-3 h-52 pt-2 pb-1 border-b border-dashed border-slate-200 dark:border-slate-800">
          {dailyData.map((item) => {
            const pct = maxOrders > 0 ? (item.count / maxOrders) * 100 : 0;
            const isMax = item.count > 0 && item.count === peakDay.count;

            return (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                {/* Hover Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow absolute top-0 -mt-2 z-20 pointer-events-none whitespace-nowrap">
                  {item.count.toLocaleString()} orders
                </div>

                {/* Track Background */}
                <div className={`w-full max-w-[36px] h-full rounded-2xl flex items-end p-1 transition-all ${
                  isLight ? 'bg-slate-100/90 group-hover:bg-slate-200/80' : 'bg-slate-800/50 group-hover:bg-slate-800'
                }`}>
                  {/* Purple/Indigo Fill Bar */}
                  <div
                    className={`w-full rounded-xl transition-all duration-700 shadow-sm ${
                      isMax
                        ? 'bg-[#6355FF] dark:bg-indigo-500 shadow-md shadow-[#6355FF]/30'
                        : 'bg-[#6355FF]/85 dark:bg-indigo-500/80 group-hover:bg-[#6355FF]'
                    }`}
                    style={{ height: `${item.count > 0 ? Math.max(6, pct) : 0}%` }}
                  />
                </div>

                {/* Day Label */}
                <span className={`text-[11px] font-medium tracking-tight ${
                  isMax ? (isLight ? 'text-[#6355FF] font-semibold' : 'text-indigo-400 font-semibold') : 'text-slate-500 group-hover:text-primary'
                }`}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer summary */}
      <div className={`mt-4 pt-4 border-t text-xs flex justify-between items-center ${isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
        <span className="font-medium">
          {peakDay && peakDay.count > 0
            ? `Peak volume observed on ${peakDay.day} (${peakDay.count.toLocaleString()} orders)`
            : 'No transaction activity recorded in current window'}
        </span>
        <span className="font-semibold text-teal-600 dark:text-teal-400">Live Telemetry ●</span>
      </div>
    </div>
  );
};
