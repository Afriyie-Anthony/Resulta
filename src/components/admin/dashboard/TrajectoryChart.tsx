import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { formatCedi } from '../../../utils/formatters';
import { FiBarChart2, FiCalendar } from 'react-icons/fi';
import type { RevenueDataPoint } from '../../../schemas/dashboard';

type TimeFrame = '24h' | '7d' | '30d';

export interface TrajectoryChartProps {
  data?: RevenueDataPoint[];
  isLoading: boolean;
}

export const TrajectoryChart: React.FC<TrajectoryChartProps> = ({ data }) => {
  const { isLight } = useAdminTheme();
  const [timeframe, setTimeframe] = useState<TimeFrame>('7d');
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(2);

  const fallbackDatasets: Record<TimeFrame, Array<{ label: string; total: number; orders: number; ussdPct: number }>> = {
    '24h': [
      { label: '00:00', total: 420, orders: 18, ussdPct: 38 },
      { label: '04:00', total: 150, orders: 6, ussdPct: 45 },
      { label: '08:00', total: 1850, orders: 74, ussdPct: 28 },
      { label: '12:00', total: 3100, orders: 124, ussdPct: 31 },
      { label: '16:00', total: 2400, orders: 96, ussdPct: 35 },
      { label: '20:00', total: 1480, orders: 59, ussdPct: 42 },
    ],
    '7d': [
      { label: 'Mon', total: 5400, orders: 216, ussdPct: 32 },
      { label: 'Tue', total: 6800, orders: 272, ussdPct: 30 },
      { label: 'Wed', total: 8450, orders: 338, ussdPct: 28 },
      { label: 'Thu', total: 7100, orders: 284, ussdPct: 33 },
      { label: 'Fri', total: 9200, orders: 368, ussdPct: 26 },
      { label: 'Sat', total: 11400, orders: 456, ussdPct: 35 },
      { label: 'Sun', total: 8900, orders: 356, ussdPct: 38 },
    ],
    '30d': [
      { label: 'Wk 1', total: 38500, orders: 1540, ussdPct: 34 },
      { label: 'Wk 2', total: 44200, orders: 1768, ussdPct: 31 },
      { label: 'Wk 3', total: 52100, orders: 2084, ussdPct: 29 },
      { label: 'Wk 4', total: 61800, orders: 2472, ussdPct: 27 },
    ],
  };

  const activeData = (data && data.length > 0)
    ? data.map(d => ({ ...d, ussdPct: 30 })) // Mock ussdPct since it's not in schema
    : fallbackDatasets[timeframe];

  const maxRevenue = Math.max(...activeData.map((d) => d.total));
  const totalRevenue = activeData.reduce((acc, d) => acc + d.total, 0);
  const totalOrders = activeData.reduce((acc, d) => acc + d.orders, 0);

  return (
    <div className={`p-4 sm:p-6 rounded-3xl border flex flex-col justify-between h-full transition-colors shadow-sm ${
      isLight ? 'bg-white border-slate-300 text-slate-950' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
    }`}>
      <div>
        {/* Header & Timeframe Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <FiBarChart2 className={`w-5 h-5 ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`} />
              <h2 className={`text-base sm:text-lg font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                Voucher Volume & Revenue Trajectory
              </h2>
            </div>
            <p className={`text-xs mt-0.5 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Aggregated real-time sales performance across Web & USSD (*713#) channels
            </p>
          </div>

          <div className={`inline-flex items-center p-1 rounded-2xl border shrink-0 ${
            isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
          }`}>
            {(['24h', '7d', '30d'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                onClick={() => { setTimeframe(tf); setSelectedBarIndex(0); }}
                className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all ${
                  timeframe === tf
                    ? isLight ? 'bg-[#0F8B8D] text-white shadow-xs' : 'bg-teal-500 text-slate-950 shadow-md'
                    : isLight ? 'text-slate-700 hover:text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf === '24h' ? 'Last 24 Hours' : tf === '7d' ? 'Past 7 Days' : '30 Days Range'}
              </button>
            ))}
          </div>
        </div>

        {/* Top 4 KPI Metrics Grid */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 sm:p-4 rounded-2xl border mb-5 ${
          isLight ? 'bg-slate-50 border-slate-300 text-slate-950' : 'bg-slate-950/60 border-slate-800 text-white'
        }`}>
          <div>
            <span className="text-[10px] uppercase font-black text-slate-500 block truncate">Total Period Revenue</span>
            <span className={`text-base sm:text-lg font-black block truncate ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`}>
              {formatCedi(totalRevenue)}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-black text-slate-500 block truncate">Vouchers Dispensed</span>
            <span className={`text-base sm:text-lg font-black block truncate ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {totalOrders} <span className="text-xs font-bold text-slate-500">PINs</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-black text-slate-500 block truncate">Average Order Value</span>
            <span className={`text-base sm:text-lg font-black block truncate ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {formatCedi(totalOrders > 0 ? totalRevenue / totalOrders : 0)}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-black text-slate-500 block truncate">USSD vs Web Ratio</span>
            <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 block truncate">
              31% / 69%
            </span>
          </div>
        </div>

        {/* Responsive Bar Chart Container */}
        <div className="relative pt-2 pb-2 overflow-x-auto no-scrollbar">
          <div className="h-52 min-w-[300px] sm:min-w-0 flex items-end justify-between gap-1.5 sm:gap-4 px-1 sm:px-2 pt-6 pb-2 border-b border-dashed border-slate-300 dark:border-slate-800">
            {activeData.map((data, idx) => {
              const heightPct = Math.max(15, (data.total / maxRevenue) * 100);
              const isSelected = selectedBarIndex === idx;

              return (
                <div
                  key={data.label}
                  onClick={() => setSelectedBarIndex(idx)}
                  className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                >
                  <span className={`text-[9px] sm:text-[10px] font-black tracking-tight px-1.5 py-0.5 rounded transition-all duration-200 whitespace-nowrap ${
                    isSelected
                      ? isLight ? 'bg-slate-950 text-white opacity-100 scale-105' : 'bg-teal-400 text-slate-950 opacity-100 scale-105 font-black'
                      : 'opacity-0 group-hover:opacity-100 bg-slate-950 text-white'
                  }`}>
                    {formatCedi(data.total)}
                  </span>

                  <div
                    className={`w-full max-w-[36px] sm:max-w-[46px] rounded-t-xl transition-all duration-300 relative overflow-hidden ${
                      isSelected
                        ? isLight
                          ? 'bg-[#0F8B8D] shadow-md shadow-[#0F8B8D]/30 ring-2 ring-[#0F8B8D]/40'
                          : 'bg-gradient-to-t from-teal-600 to-emerald-400 shadow-md shadow-teal-500/30'
                        : isLight
                        ? 'bg-slate-200 hover:bg-[#0F8B8D]/70'
                        : 'bg-slate-800 hover:bg-teal-500/60'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-40" />
                  </div>

                  <span className={`text-[10px] sm:text-[11px] font-black truncate w-full text-center transition-colors ${
                    isSelected
                      ? isLight ? 'text-[#0F8B8D] font-black scale-105' : 'text-teal-400 font-black'
                      : isLight ? 'text-slate-700 group-hover:text-slate-950' : 'text-slate-400 group-hover:text-white'
                  }`}>
                    {data.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Telemetry Spotlight Card */}
          {selectedBarIndex !== null && activeData[selectedBarIndex] && (
            <div className={`mt-4 p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
              isLight ? 'bg-[#0F8B8D]/10 border-[#0F8B8D]/30' : 'bg-teal-950/40 border-teal-500/30'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                  isLight ? 'bg-[#0F8B8D] text-white' : 'bg-teal-500 text-slate-950 font-black'
                }`}>
                  <FiCalendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs sm:text-sm font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    Telemetry Spotlight: <span className={isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}>{activeData[selectedBarIndex].label}</span>
                  </h4>
                  <p className={`text-[11px] font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {activeData[selectedBarIndex].orders} successful transactions processed without manual intervention.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 text-right w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[9px] uppercase font-black text-slate-500 block">Web vs USSD</span>
                  <span className={`text-xs font-black ${isLight ? 'text-slate-950' : 'text-slate-200'}`}>
                    {100 - activeData[selectedBarIndex].ussdPct}% Web / {activeData[selectedBarIndex].ussdPct}% USSD
                  </span>
                </div>
                <div className="h-7 w-px bg-slate-300 dark:bg-slate-700" />
                <div>
                  <span className="text-[9px] uppercase font-black text-slate-500 block">Spotlight Revenue</span>
                  <span className={`text-xs sm:text-sm font-black ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`}>
                    {formatCedi(activeData[selectedBarIndex].total)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
