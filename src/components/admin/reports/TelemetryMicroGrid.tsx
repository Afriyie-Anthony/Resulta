import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiClock, FiActivity, FiMapPin, FiUserCheck } from 'react-icons/fi';

export const TelemetryMicroGrid: React.FC = () => {
  const { isLight } = useAdminTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 1. Hourly Peak Traffic */}
      <div className={`p-5 rounded-3xl border transition-colors shadow-sm space-y-4 ${
        isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-slate-800">
          <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-slate-950' : 'text-white'}`}>
            <FiClock className="text-[#0F8B8D]" /> Hourly Peak Traffic
          </h3>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-300">
            24H WAVE
          </span>
        </div>

        <div className="h-32 flex items-end justify-between gap-1.5 px-1 pt-2">
          {[].map((slot, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <div
                className="w-full bg-gradient-to-t from-teal-600 to-cyan-400 rounded-t-lg transition-all duration-300 group-hover:brightness-125"
                style={{ height: `${slot.val}%` }}
                title={`${slot.time} GMT: ${slot.val}% traffic volume`}
              />
              <span className="text-[9px] font-mono font-bold text-slate-500">{slot.time}</span>
            </div>
          ))}
        </div>
        <p className={`text-[11px] font-bold text-center ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
          Peak Window: <strong>12:00 - 16:00 GMT</strong>
        </p>
      </div>

      {/* 2. Payment Gateway Reliability */}
      <div className={`p-5 rounded-3xl border transition-colors shadow-sm space-y-4 ${
        isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-slate-800">
          <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-slate-950' : 'text-white'}`}>
            <FiActivity className="text-emerald-600" /> Payment Reliability
          </h3>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            GATEWAYS
          </span>
        </div>

        <div className="space-y-3 text-xs font-semibold">
          <div>
            <div className="flex justify-between text-[11px] font-black mb-1">
              <span>MoMo USSD (*713#)</span>
              <span className="text-emerald-600 dark:text-emerald-400">99.4%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '99.4%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-black mb-1">
              <span>Web Card Payments</span>
              <span className="text-teal-600 dark:text-teal-400">96.8%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: '96.8%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-black mb-1">
              <span>Bank Direct Transfer</span>
              <span className="text-amber-600 dark:text-amber-400">92.1%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '92.1%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Regional Sales & Demand */}
      <div className={`p-5 rounded-3xl border transition-colors shadow-sm space-y-4 ${
        isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-slate-800">
          <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-slate-950' : 'text-white'}`}>
            <FiMapPin className="text-cyan-600" /> Regional Demand
          </h3>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300">
            GHANA
          </span>
        </div>

        <div className="space-y-2.5 text-xs font-semibold">
          <div>
            <div className="flex justify-between text-[11px] font-black mb-1">
              <span>Greater Accra</span>
              <span>42%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: '42%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-black mb-1">
              <span>Ashanti (Kumasi)</span>
              <span>28%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800">
              <div className="h-full bg-[#0F8B8D] rounded-full" style={{ width: '28%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-black mb-1">
              <span>Central & Western</span>
              <span>18%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '18%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Customer Cohorts & Retention */}
      <div className={`p-5 rounded-3xl border transition-colors shadow-sm space-y-4 ${
        isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-slate-800">
          <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-slate-950' : 'text-white'}`}>
            <FiUserCheck className="text-purple-600" /> Customer Cohorts
          </h3>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
            RETENTION
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-500 block">First-Time Buyers</span>
              <span className={`text-lg font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>64%</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-[#0F8B8D] flex items-center justify-center font-black text-xs border border-teal-200">
              4,850
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-500 block">Returning Buyers</span>
              <span className="text-lg font-black text-purple-600 dark:text-purple-400">36%</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-xs border border-purple-200">
              2,720
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
