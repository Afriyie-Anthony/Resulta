import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Badge } from '../../ui/Badge';
import { FiTrendingUp } from 'react-icons/fi';

export const DailyOrdersCard: React.FC = () => {
  const { isLight } = useAdminTheme();

  const dailyData = [
    { day: 'Sun', count: 142, pct: 6 },
    { day: 'Mon', count: 88, pct: 4 },
    { day: 'Tue', count: 91, pct: 4 },
    { day: 'Wed', count: 745, pct: 28 },
    { day: 'Thu', count: 2832, pct: 100, isMax: true },
    { day: 'Fri', count: 1140, pct: 42 },
    { day: 'Sat', count: 290, pct: 11 },
  ];

  return (
    <div className={`p-6 rounded-3xl border flex flex-col justify-between h-full transition-colors ${
      isLight ? 'bg-white border-slate-200/90 shadow-md text-primary' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
    }`}>
      <div>
        <div className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-2">
            <FiTrendingUp className={`w-5 h-5 ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`} />
            <h3 className={`text-lg font-black tracking-tight ${isLight ? 'text-[#123B5D]' : 'text-white'}`}>
              Daily Orders
            </h3>
          </div>
          <Badge variant="info" className="text-[10px] font-bold">Week 31</Badge>
        </div>
        <p className={`text-xs mt-1 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Transaction counts over the current week
        </p>
      </div>

      {/* Bar Chart Container */}
      <div className="pt-6 pb-2 flex gap-4 items-end h-64">
        {/* Y-Axis scale */}
        <div className="flex flex-col justify-between h-52 text-[10px] font-extrabold text-slate-400 pb-5 shrink-0 text-right">
          <span>2832</span>
          <span>1869</span>
          <span>935</span>
          <span>0</span>
        </div>

        {/* Day Columns */}
        <div className="flex-1 flex justify-between items-end gap-2 sm:gap-3 h-52 pt-2 pb-1 border-b border-dashed border-slate-200 dark:border-slate-800">
          {dailyData.map((item) => (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
              {/* Hover Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow absolute top-0 -mt-2 z-20 pointer-events-none whitespace-nowrap">
                {item.count} orders
              </div>

              {/* Track Background */}
              <div className={`w-full max-w-[36px] h-full rounded-2xl flex items-end p-1 transition-all ${
                isLight ? 'bg-slate-100/90 group-hover:bg-slate-200/80' : 'bg-slate-800/50 group-hover:bg-slate-800'
              }`}>
                {/* Purple/Indigo Fill Bar */}
                <div
                  className={`w-full rounded-xl transition-all duration-700 shadow-sm ${
                    item.isMax
                      ? 'bg-[#6355FF] dark:bg-indigo-500 shadow-md shadow-[#6355FF]/30'
                      : 'bg-[#6355FF]/85 dark:bg-indigo-500/80 group-hover:bg-[#6355FF]'
                  }`}
                  style={{ height: `${Math.max(6, item.pct)}%` }}
                />
              </div>

              {/* Day Label */}
              <span className={`text-[11px] font-black tracking-tight ${
                item.isMax ? (isLight ? 'text-[#6355FF]' : 'text-indigo-400') : 'text-slate-500 group-hover:text-primary'
              }`}>
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer summary */}
      <div className={`mt-4 pt-4 border-t text-xs flex justify-between items-center ${isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
        <span className="font-medium">Peak traffic observed on Thursday (2,832 orders)</span>
        <span className="font-black text-emerald-600 dark:text-emerald-400">+18% vs prior week</span>
      </div>
    </div>
  );
};
