import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import type { OrderStats } from './types';
import { formatCedi } from '../../../utils/formatters';
import { FiDollarSign, FiCheckCircle, FiPieChart, FiSend } from 'react-icons/fi';

interface OrdersKpiGridProps {
  stats?: OrderStats;
  onSelectFilter: (status: string) => void;
}

export const OrdersKpiGrid: React.FC<OrdersKpiGridProps> = ({ stats, onSelectFilter }) => {
  const { isLight } = useAdminTheme();

  // Operational metrics
  const totalRevenue = stats?.revenueAndVolume.totalRevenue || 0;
  const vouchersSold = stats?.revenueAndVolume.vouchersSold || 0;
  const ordersPlaced = stats?.revenueAndVolume.ordersPlaced || 0;

  const successfulPayments = stats?.paymentStatuses.successful || 0;
  const pendingPayments = stats?.paymentStatuses.pending || 0;
  const failedPayments = stats?.paymentStatuses.failed || 0;

  const wassceSales = stats?.salesBreakdown.byVoucherType['WASSCE_NOVDEC'] || 0;
  const beceSales = stats?.salesBreakdown.byVoucherType['BECE'] || 0;
  const webSales = stats?.salesBreakdown.byChannel['WEB'] || 0;
  const ussdSales = stats?.salesBreakdown.byChannel['USSD'] || 0;

  const sentDelivered = stats?.deliveryRates.delivered || 0;
  const failedDelivery = stats?.deliveryRates.failedDelivery || 0;
  const notSent = stats?.deliveryRates.notSent || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. REVENUE & VOLUME */}
      <div
        onClick={() => onSelectFilter('ALL')}
        className={`p-3.5 rounded-2xl border border-t-4 transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
          isLight
            ? 'bg-white border-slate-300 border-t-blue-500 hover:border-slate-400'
            : 'bg-slate-900/90 border-slate-800 border-t-blue-500 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            Revenue & Volume
          </span>
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
            isLight ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-blue-500/20 text-blue-400'
          }`}>
            <FiDollarSign className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="space-y-1.5 text-xs font-bold">
          <div className="flex items-center justify-between">
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Total Revenue</span>
            <span className={`font-black ${isLight ? 'text-blue-700' : 'text-blue-400'}`}>
              {formatCedi(totalRevenue)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Vouchers Sold</span>
            <span className={`font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {vouchersSold.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Orders Placed</span>
            <span className={`font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {ordersPlaced.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 2. PAYMENT STATUSES */}
      <div
        onClick={() => onSelectFilter('SUCCESSFUL')}
        className={`p-3.5 rounded-2xl border border-t-4 transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
          isLight
            ? 'bg-white border-slate-300 border-t-emerald-500 hover:border-slate-400'
            : 'bg-slate-900/90 border-slate-800 border-t-emerald-500 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            Payment Statuses
          </span>
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
            isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            <FiCheckCircle className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="space-y-1.5 text-xs font-bold">
          <div className="flex items-center justify-between">
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Successful</span>
            <span className="font-black text-emerald-700 dark:text-emerald-400">
              {successfulPayments.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Pending</span>
            <span className="font-black text-amber-700 dark:text-amber-400">
              {pendingPayments.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Failed</span>
            <span className="font-black text-rose-700 dark:text-rose-400">
              {failedPayments.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 3. SALES BREAKDOWN */}
      <div
        onClick={() => onSelectFilter('ALL')}
        className={`p-3.5 rounded-2xl border border-t-4 transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
          isLight
            ? 'bg-white border-slate-300 border-t-purple-500 hover:border-slate-400'
            : 'bg-slate-900/90 border-slate-800 border-t-purple-500 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            Sales Breakdown
          </span>
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
            isLight ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-purple-500/20 text-purple-400'
          }`}>
            <FiPieChart className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs">
          <div>
            <span className={`text-[10px] font-bold block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>WASSCE</span>
            <span className={`font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {wassceSales.toLocaleString()}
            </span>
          </div>

          <div>
            <span className={`text-[10px] font-bold block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Web</span>
            <span className="font-black text-blue-700 dark:text-blue-400">
              {webSales.toLocaleString()}
            </span>
          </div>

          <div>
            <span className={`text-[10px] font-bold block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>BECE</span>
            <span className={`font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {beceSales.toLocaleString()}
            </span>
          </div>

          <div>
            <span className={`text-[10px] font-bold block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>USSD</span>
            <span className="font-black text-amber-700 dark:text-amber-400">
              {ussdSales.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 4. DELIVERY RATES */}
      <div
        onClick={() => onSelectFilter('ALL')}
        className={`p-3.5 rounded-2xl border border-t-4 transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
          isLight
            ? 'bg-white border-slate-300 border-t-amber-500 hover:border-slate-400'
            : 'bg-slate-900/90 border-slate-800 border-t-amber-500 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            Delivery Rates
          </span>
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
            isLight ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-amber-500/20 text-amber-400'
          }`}>
            <FiSend className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="space-y-1.5 text-xs font-bold">
          <div className="flex items-center justify-between">
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Sent (Delivered)</span>
            <span className="font-black text-emerald-700 dark:text-emerald-400">
              {sentDelivered.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Failed Delivery</span>
            <span className="font-black text-rose-700 dark:text-rose-400">
              {failedDelivery.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Not Sent</span>
            <span className={`font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {notSent.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
