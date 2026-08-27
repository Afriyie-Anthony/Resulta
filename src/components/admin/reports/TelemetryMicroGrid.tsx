import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiClock, FiActivity, FiMapPin, FiUserCheck } from 'react-icons/fi';
import { useCustomerStats } from '../../../hooks/useCustomers';

export const TelemetryMicroGrid: React.FC = () => {
  const { isLight } = useAdminTheme();
  const { data: customerStats, isLoading: isLoadingCustomers } = useCustomerStats();

  const totalCustomers = customerStats?.overview?.totalUniqueCustomers || 0;
  const returningCount = (customerStats?.segments?.RETURNING || 0) + (customerStats?.segments?.VIP || 0);
  const firstTimeCount = customerStats?.segments?.NEW ?? Math.max(0, totalCustomers - returningCount);

  const firstTimePct = totalCustomers > 0 ? ((firstTimeCount / totalCustomers) * 100).toFixed(0) : '0';
  const returningPct = totalCustomers > 0 ? ((returningCount / totalCustomers) * 100).toFixed(0) : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 1. Peak Traffic Hours */}
      <div className={`p-5 rounded-3xl border transition-colors shadow-sm space-y-4 ${
        isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-slate-800">
          <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-slate-950' : 'text-white'}`}>
            <FiClock className="text-[#0F8B8D]" /> Operational Window
          </h3>
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-300">
            24/7 ACTIVE
          </span>
        </div>

        <div className="space-y-3 py-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">USSD Engine (*713#)</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Continuous</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">Instant SMS Dispatch</span>
            <span className="font-semibold text-teal-600 dark:text-teal-400">&lt; 3 seconds</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">Payment Callback Relay</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">99.9% Uptime</span>
          </div>
        </div>

        <p className={`text-[11px] font-medium text-center ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
          High-availability voucher routing across Ghana
        </p>
      </div>

      {/* 2. Payment Gateway Reliability */}
      <div className={`p-5 rounded-3xl border transition-colors shadow-sm space-y-4 ${
        isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-slate-800">
          <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-slate-950' : 'text-white'}`}>
            <FiActivity className="text-emerald-600" /> Gateway Channels
          </h3>
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            ONLINE
          </span>
        </div>

        <div className="space-y-3 text-xs font-medium">
          <div>
            <div className="flex justify-between text-[11px] font-semibold mb-1">
              <span>MTN Mobile Money</span>
              <span className="text-emerald-600 dark:text-emerald-400">Active</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-semibold mb-1">
              <span>Telecel Cash</span>
              <span className="text-teal-600 dark:text-teal-400">Active</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-semibold mb-1">
              <span>AT Money</span>
              <span className="text-blue-600 dark:text-blue-400">Active</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Coverage & Network Availability */}
      <div className={`p-5 rounded-3xl border transition-colors shadow-sm space-y-4 ${
        isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-slate-800">
          <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-slate-950' : 'text-white'}`}>
            <FiMapPin className="text-cyan-600" /> Coverage Scope
          </h3>
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300">
            NATIONWIDE
          </span>
        </div>

        <div className="space-y-2.5 text-xs font-medium">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Telecom Coverage</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">16 Regions in Ghana</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Accepting payments and delivering PINs across all Ghanaian mobile networks without geo-restrictions.
          </p>
        </div>
      </div>

      {/* 4. Customer Cohorts & Retention */}
      <div className={`p-5 rounded-3xl border transition-colors shadow-sm space-y-4 ${
        isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-slate-800">
          <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-slate-950' : 'text-white'}`}>
            <FiUserCheck className="text-purple-600" /> Customer Cohorts
          </h3>
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
            LIVE
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-500 block">First-Time Buyers</span>
              <span className={`text-lg font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                {isLoadingCustomers ? '...' : `${firstTimePct}%`}
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-[#0F8B8D] flex items-center justify-center font-bold text-xs border border-teal-200">
              {isLoadingCustomers ? '...' : firstTimeCount.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-500 block">Returning Buyers</span>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {isLoadingCustomers ? '...' : `${returningPct}%`}
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs border border-purple-200">
              {isLoadingCustomers ? '...' : returningCount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
