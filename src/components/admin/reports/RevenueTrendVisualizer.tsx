import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { formatCedi } from '../../../utils/formatters';
import { FiBarChart2 } from 'react-icons/fi';
import type { TrendDataPoint, ChartMetricType } from './types';

interface RevenueTrendVisualizerProps {
  trendData: TrendDataPoint[];
  peakRevenueDay?: { label: string; date?: string; revenue: number } | null;
  period: string;
  totalOrders: number;
  isLoading?: boolean;
}

export const RevenueTrendVisualizer: React.FC<RevenueTrendVisualizerProps> = ({
  trendData = [],
  peakRevenueDay,
  period,
  totalOrders,
  isLoading = false,
}) => {
  const { isLight } = useAdminTheme();
  const [activeMetric, setActiveMetric] = useState<ChartMetricType>('REVENUE');

  if (isLoading) {
    return (
      <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-5 animate-pulse ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-56 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
      </div>
    );
  }

  // Calculate maximum values for relative bar height
  const maxRevenue = Math.max(...trendData.map((d) => d.revenue), 1);
  const maxOrders = Math.max(...trendData.map((d) => d.ordersCount), 1);
  const maxValue = activeMetric === 'REVENUE' ? maxRevenue : maxOrders;

  return (
    <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-5 ${
      isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h2 className={`text-base font-black flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
            <FiBarChart2 className="text-[#0F8B8D] dark:text-teal-400" /> Revenue & Order Trend Visualizer
          </h2>
          <p className={`text-xs font-semibold mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Commercial trajectory across the active {period.toLowerCase()} reporting window.
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMetric('REVENUE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeMetric === 'REVENUE'
                ? isLight ? 'bg-[#0F8B8D] text-white shadow-xs' : 'bg-teal-500 text-slate-950 font-black shadow-xs'
                : isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Revenue (GH₵)
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('ORDERS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeMetric === 'ORDERS'
                ? isLight ? 'bg-[#0F8B8D] text-white shadow-xs' : 'bg-teal-500 text-slate-950 font-black shadow-xs'
                : isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Orders Count
          </button>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="pt-4">
        {trendData.length > 0 ? (
          <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2">
            {trendData.map((item, idx) => {
              const currentVal = activeMetric === 'REVENUE' ? item.revenue : item.ordersCount;
              const heightPercent = Math.round((currentVal / maxValue) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                  {/* Tooltip on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-14 z-20 pointer-events-none bg-slate-950 text-white text-[10px] font-black px-3 py-2 rounded-xl shadow-xl border border-slate-800 whitespace-nowrap text-center">
                    <div>{item.label} {item.date ? `(${item.date})` : ''}</div>
                    <div className="text-emerald-400 font-mono text-xs">{formatCedi(item.revenue)}</div>
                    <div className="text-slate-400 text-[10px]">{item.ordersCount.toLocaleString()} orders</div>
                  </div>

                  {/* Visual Bar */}
                  <div
                    className={`w-full max-w-[48px] rounded-t-2xl transition-all duration-500 group-hover:brightness-110 shadow-2xs ${
                      isLight
                        ? 'bg-gradient-to-t from-[#0B2545] to-[#0F8B8D]'
                        : 'bg-gradient-to-t from-teal-600 to-emerald-400'
                    }`}
                    style={{ height: `${Math.max(heightPercent, 10)}%` }}
                  />

                  {/* X-Axis Label */}
                  <span className={`text-[10px] sm:text-[11px] font-black uppercase mt-1 truncate max-w-[50px] text-center ${
                    isLight ? 'text-slate-800' : 'text-slate-300'
                  }`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-56 flex items-center justify-center text-slate-500 text-xs font-semibold">
            No time series data available for this timeframe.
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className={`pt-4 border-t flex flex-wrap items-center justify-between text-xs font-semibold ${
        isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800 text-slate-400'
      }`}>
        {peakRevenueDay ? (
          <span>
            Peak Revenue Period: <strong>{peakRevenueDay.label} ({formatCedi(peakRevenueDay.revenue)})</strong>
          </span>
        ) : (
          <span>Standard Distribution</span>
        )}
        <span>
          Total Fulfilled Volume: <strong className="text-emerald-600 dark:text-emerald-400">{totalOrders.toLocaleString()} Orders</strong>
        </span>
      </div>
    </div>
  );
};
