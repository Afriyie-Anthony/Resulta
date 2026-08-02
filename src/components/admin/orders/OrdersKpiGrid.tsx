import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import type { Order } from './types';
import { formatCedi } from '../../../utils/formatters';
import { FiDollarSign, FiCheckCircle, FiAlertTriangle, FiPieChart } from 'react-icons/fi';

interface OrdersKpiGridProps {
  orders: Order[];
  onSelectFilter: (status: string, network: string) => void;
}

export const OrdersKpiGrid: React.FC<OrdersKpiGridProps> = ({ orders, onSelectFilter }) => {
  const { isLight } = useAdminTheme();

  // Calculate statistics
  const totalVolume = orders.reduce((sum, order) => sum + order.price, 0);
  const fulfilledCount = orders.filter(o => o.status === 'FULFILLED').length;
  const fulfillmentRate = orders.length > 0 ? ((fulfilledCount / orders.length) * 100).toFixed(1) : '100';
  const exceptionCount = orders.filter(o => o.status !== 'FULFILLED').length;

  // Network counts
  const mtnCount = orders.filter(o => o.network === 'MTN MoMo').length;
  const telecelCount = orders.filter(o => o.network === 'Telecel Cash').length;
  const atCount = orders.filter(o => o.network === 'AirtelTigo').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Daily Gross Volume (Subtle Cyan / Teal Tint) */}
      <div
        onClick={() => onSelectFilter('ALL', 'ALL')}
        className={`p-5 rounded-3xl border transition-all cursor-pointer transform hover:scale-[1.02] active:scale-100 shadow-sm ${
          isLight
            ? 'bg-cyan-50/50 border-cyan-200/70 hover:bg-cyan-50/80 hover:border-cyan-300'
            : 'bg-teal-950/20 border-teal-500/30 hover:border-teal-500/50'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-black uppercase tracking-wider ${
            isLight ? 'text-cyan-900/80' : 'text-slate-400'
          }`}>
            Total Gross Volume
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
            isLight ? 'bg-cyan-600/15 text-cyan-800' : 'bg-teal-500/20 text-teal-400 font-black'
          }`}>
            <FiDollarSign className="w-4 h-4" />
          </div>
        </div>
        <p className={`text-2xl font-black tracking-tight ${isLight ? 'text-cyan-950' : 'text-white'}`}>
          {formatCedi(totalVolume)}
        </p>
        <div className="mt-2.5 flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>Across {orders.length} transactions</span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
            isLight ? 'bg-white/80 text-emerald-700 border border-emerald-200' : 'bg-emerald-500/10 text-emerald-400'
          }`}>
            Live
          </span>
        </div>
      </div>

      {/* 2. Fulfillment Rate (Subtle Emerald / Mint Tint) */}
      <div
        onClick={() => onSelectFilter('FULFILLED', 'ALL')}
        className={`p-5 rounded-3xl border transition-all cursor-pointer transform hover:scale-[1.02] active:scale-100 shadow-sm ${
          isLight
            ? 'bg-emerald-50/50 border-emerald-200/70 hover:bg-emerald-50/80 hover:border-emerald-300'
            : 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-black uppercase tracking-wider ${
            isLight ? 'text-emerald-900/80' : 'text-slate-400'
          }`}>
            Fulfillment Rate
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
            isLight ? 'bg-emerald-600/15 text-emerald-800' : 'bg-emerald-500/20 text-emerald-400 font-black'
          }`}>
            <FiCheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <p className={`text-2xl font-black tracking-tight ${isLight ? 'text-emerald-950' : 'text-emerald-400'}`}>
            {fulfillmentRate}%
          </p>
          <span className="text-xs font-bold text-slate-400">({fulfilledCount} instant)</span>
        </div>
        {/* Progress Bar */}
        <div className={`w-full h-2 rounded-full overflow-hidden mt-3 ${isLight ? 'bg-emerald-100' : 'bg-slate-800'}`}>
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${fulfillmentRate}%` }}
          />
        </div>
      </div>

      {/* 3. Gateway Exceptions (Subtle Amber / Warm Cream Tint) */}
      <div
        onClick={() => onSelectFilter(exceptionCount > 0 ? 'PENDING_MOMO' : 'ALL', 'ALL')}
        className={`p-5 rounded-3xl border transition-all cursor-pointer transform hover:scale-[1.02] active:scale-100 shadow-sm ${
          exceptionCount > 0
            ? isLight
              ? 'bg-amber-50/50 border-amber-200/70 hover:bg-amber-50/80 hover:border-amber-300'
              : 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50'
            : isLight
            ? 'bg-slate-50 border-slate-200/90'
            : 'bg-slate-900/90 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-black uppercase tracking-wider ${
            exceptionCount > 0
              ? isLight ? 'text-amber-900/80' : 'text-amber-300'
              : isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Pending / Exceptions
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
            exceptionCount > 0
              ? isLight ? 'bg-amber-500/15 text-amber-800' : 'bg-amber-500/20 text-amber-400 font-black'
              : isLight ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-slate-400'
          }`}>
            <FiAlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <p className={`text-2xl font-black tracking-tight ${
          exceptionCount > 0
            ? isLight ? 'text-amber-950' : 'text-amber-400'
            : isLight ? 'text-primary' : 'text-white'
        }`}>
          {exceptionCount} {exceptionCount === 1 ? 'Order' : 'Orders'}
        </p>
        <p className={`text-xs font-semibold mt-2.5 ${
          exceptionCount > 0
            ? isLight ? 'text-amber-800/90' : 'text-amber-400'
            : 'text-slate-400'
        }`}>
          {exceptionCount > 0 ? 'Click to inspect pending callbacks' : 'No stalled transactions'}
        </p>
      </div>

      {/* 4. MoMo Network Share (Subtle Sky Blue / Indigo Tint) */}
      <div
        onClick={() => onSelectFilter('ALL', 'ALL')}
        className={`p-5 rounded-3xl border transition-colors shadow-sm flex flex-col justify-between cursor-pointer transform hover:scale-[1.02] active:scale-100 ${
          isLight ? 'bg-blue-50/40 border-blue-200/60 hover:bg-blue-50/70 hover:border-blue-300' : 'bg-blue-950/20 border-blue-500/30 hover:border-blue-500/50'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-[11px] font-black uppercase tracking-wider ${
            isLight ? 'text-blue-900/80' : 'text-slate-400'
          }`}>
            Gateway Market Split
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
            isLight ? 'bg-blue-600/15 text-blue-800' : 'bg-blue-500/20 text-blue-400 font-black'
          }`}>
            <FiPieChart className="w-4 h-4" />
          </div>
        </div>
        <div className="space-y-2 text-xs font-bold">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" /> MTN MoMo
            </span>
            <span className={`font-black ${isLight ? 'text-blue-950' : 'text-white'}`}>{mtnCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" /> Telecel Cash
            </span>
            <span className={`font-black ${isLight ? 'text-blue-950' : 'text-white'}`}>{telecelCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" /> AirtelTigo
            </span>
            <span className={`font-black ${isLight ? 'text-blue-950' : 'text-white'}`}>{atCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
