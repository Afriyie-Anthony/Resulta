import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { formatCedi } from '../../../utils/formatters';
import { FiBarChart2, FiCalendar } from 'react-icons/fi';

type TimeFrame = '24h' | '7d' | '30d';

export const TrajectoryChart: React.FC = () => {
  const { isLight } = useAdminTheme();
  const [timeframe, setTimeframe] = useState<TimeFrame>('7d');
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(2);

  const chartDatasets: Record<TimeFrame, Array<{ label: string; revenue: number; orders: number; ussdPct: number }>> = {
    '24h': [
      { label: '00:00', revenue: 420, orders: 18, ussdPct: 38 },
      { label: '04:00', revenue: 150, orders: 6, ussdPct: 45 },
      { label: '08:00', revenue: 1850, orders: 74, ussdPct: 28 },
      { label: '12:00', revenue: 3100, orders: 124, ussdPct: 31 },
      { label: '16:00', revenue: 2400, orders: 96, ussdPct: 35 },
      { label: '20:00', revenue: 1480, orders: 59, ussdPct: 42 },
    ],
    '7d': [
      { label: 'Mon', revenue: 5400, orders: 216, ussdPct: 32 },
      { label: 'Tue', revenue: 6800, orders: 272, ussdPct: 30 },
      { label: 'Wed (Today)', revenue: 8450, orders: 338, ussdPct: 28 },
      { label: 'Thu', revenue: 7100, orders: 284, ussdPct: 33 },
      { label: 'Fri', revenue: 9200, orders: 368, ussdPct: 26 },
      { label: 'Sat', revenue: 11400, orders: 456, ussdPct: 35 },
      { label: 'Sun', revenue: 8900, orders: 356, ussdPct: 38 },
    ],
    '30d': [
      { label: 'Wk 1', revenue: 38500, orders: 1540, ussdPct: 34 },
      { label: 'Wk 2', revenue: 44200, orders: 1768, ussdPct: 31 },
      { label: 'Wk 3', revenue: 52100, orders: 2084, ussdPct: 29 },
      { label: 'Wk 4', revenue: 61800, orders: 2472, ussdPct: 27 },
    ],
  };

  const activeData = chartDatasets[timeframe];
  const maxRevenue = Math.max(...activeData.map((d) => d.revenue));
  const totalRevenue = activeData.reduce((acc, d) => acc + d.revenue, 0);
  const totalOrders = activeData.reduce((acc, d) => acc + d.orders, 0);

  return (
    <div className={`p-6 rounded-3xl border flex flex-col justify-between h-full transition-colors ${
      isLight ? 'bg-white border-slate-200/90 shadow-md text-primary' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
    }`}>
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <FiBarChart2 className={`w-5 h-5 ${isLight ? 'text-secondary' : 'text-teal-400'}`} />
              <h2 className={`text-lg font-black tracking-tight ${isLight ? 'text-primary' : 'text-white'}`}>
                Voucher Volume & Revenue Trajectory
              </h2>
            </div>
            <p className={`text-xs mt-1 ${isLight ? 'text-slate-500 font-semibold' : 'text-slate-400'}`}>
              Aggregated real-time sales performance across HTTPS Web & USSD (*882#) channels
            </p>
          </div>

          <div className={`inline-flex items-center p-1 rounded-xl border shrink-0 ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            {(['24h', '7d', '30d'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                onClick={() => { setTimeframe(tf); setSelectedBarIndex(0); }}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                  timeframe === tf
                    ? isLight ? 'bg-primary text-white shadow-sm' : 'bg-teal-500 text-slate-950 shadow-md shadow-teal-950'
                    : isLight ? 'text-slate-600 hover:text-primary' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf === '24h' ? 'Last 24 Hours' : tf === '7d' ? 'Past 7 Days' : '30 Days Range'}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid grid-cols-2 xl:grid-cols-4 gap-3.5 p-4 rounded-2xl border mb-6 ${
          isLight ? 'bg-slate-50/80 border-slate-200 text-primary' : 'bg-slate-950/60 border-slate-800 text-white'
        }`}>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Period Revenue</span>
            <span className={`text-xl font-black ${isLight ? 'text-secondary' : 'text-teal-400'}`}>{formatCedi(totalRevenue)}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Vouchers Dispensed</span>
            <span className={`text-xl font-black ${isLight ? 'text-primary' : 'text-white'}`}>{totalOrders} <span className="text-xs font-normal">PINS</span></span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Average Order Value</span>
            <span className={`text-xl font-black ${isLight ? 'text-primary' : 'text-white'}`}>{formatCedi(totalOrders > 0 ? totalRevenue / totalOrders : 0)}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">USSD vs Web Ratio</span>
            <span className={`text-xl font-black ${isLight ? 'text-warning' : 'text-amber-400'}`}>31% / 69%</span>
          </div>
        </div>

        <div className="relative pt-4 pb-2">
          <div className="h-56 flex items-end justify-between gap-2.5 sm:gap-5 px-2 pt-6 pb-2 border-b border-dashed border-slate-300 dark:border-slate-800">
            {activeData.map((data, idx) => {
              const heightPct = Math.max(15, (data.revenue / maxRevenue) * 100);
              const isSelected = selectedBarIndex === idx;
              
              return (
                <div
                  key={data.label}
                  onClick={() => setSelectedBarIndex(idx)}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                >
                  <span className={`text-[10px] font-black tracking-tight px-1.5 py-0.5 rounded transition-all duration-200 ${
                    isSelected
                      ? isLight ? 'bg-primary text-white opacity-100 scale-105' : 'bg-teal-400 text-slate-950 opacity-100 scale-105 font-black'
                      : 'opacity-0 group-hover:opacity-100 bg-slate-800 text-white'
                  }`}>
                    {formatCedi(data.revenue)}
                  </span>

                  <div className={`w-full max-w-[46px] rounded-t-xl transition-all duration-300 relative overflow-hidden ${
                    isSelected
                      ? isLight
                        ? 'bg-secondary shadow-lg shadow-secondary/30 ring-2 ring-secondary/40'
                        : 'bg-gradient-to-t from-teal-600 to-emerald-400 shadow-lg shadow-teal-500/30'
                      : isLight
                      ? 'bg-slate-200 hover:bg-secondary/70'
                      : 'bg-slate-800 hover:bg-teal-500/60'
                  }`}
                  style={{ height: `${heightPct}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-40" />
                  </div>

                  <span className={`text-[11px] font-extrabold truncate w-full text-center transition-colors ${
                    isSelected
                      ? isLight ? 'text-secondary font-black scale-105' : 'text-teal-400 font-black'
                      : isLight ? 'text-slate-600 group-hover:text-primary' : 'text-slate-400 group-hover:text-white'
                  }`}>
                    {data.label}
                  </span>
                </div>
              );
            })}
          </div>

          {selectedBarIndex !== null && activeData[selectedBarIndex] && (
            <div className={`mt-4 p-4 rounded-2xl border flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 animate-fadeIn ${
              isLight ? 'bg-[#0F8B8D]/5 border-[#0F8B8D]/20' : 'bg-teal-950/30 border-teal-500/30'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                  isLight ? 'bg-secondary text-white' : 'bg-teal-500 text-slate-950 font-black'
                }`}>
                  <FiCalendar />
                </div>
                <div>
                  <h4 className={`text-sm font-black ${isLight ? 'text-primary' : 'text-white'}`}>
                    Telemetry Spotlight: <span className={isLight ? 'text-secondary' : 'text-teal-400'}>{activeData[selectedBarIndex].label}</span>
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {activeData[selectedBarIndex].orders} successful transactions processed without manual intervention.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 shrink-0 text-right">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Web vs USSD</span>
                  <span className={`text-xs font-black ${isLight ? 'text-primary' : 'text-slate-200'}`}>
                    {100 - activeData[selectedBarIndex].ussdPct}% Web / {activeData[selectedBarIndex].ussdPct}% USSD
                  </span>
                </div>
                <div className="hidden sm:block h-8 w-px bg-slate-300 dark:bg-slate-700" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Spotlight Revenue</span>
                  <span className={`text-base font-black ${isLight ? 'text-secondary' : 'text-teal-400'}`}>
                    {formatCedi(activeData[selectedBarIndex].revenue)}
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
