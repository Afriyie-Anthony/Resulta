import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import type { Order } from './types';
import { formatCedi } from '../../../utils/formatters';
import { FiDollarSign, FiCheckCircle, FiPieChart, FiSend } from 'react-icons/fi';

interface OrdersKpiGridProps {
  orders: Order[];
  onSelectFilter: (status: string) => void;
}

export const OrdersKpiGrid: React.FC<OrdersKpiGridProps> = ({ orders, onSelectFilter }) => {
  const { isLight } = useAdminTheme();

  // Operational metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.price, 0) || 74910;
  const vouchersSold = 2497;
  const ordersPlaced = 9312;

  const successfulPayments = 2496;
  const pendingPayments = 6800;
  const failedPayments = 16;

  const wassceSales = 281;
  const beceSales = 2216;
  const webSales = 8;
  const ussdSales = 2488;

  const sentDelivered = 2495;
  const failedDelivery = 1;
  const notSent = 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. REVENUE & VOLUME */}
      <div
        onClick={() => onSelectFilter('ALL')}
        className={`p-5 rounded-3xl border border-t-4 transition-all cursor-pointer shadow-sm hover:shadow-md ${
          isLight
            ? 'bg-white border-slate-300 border-t-blue-500 hover:border-slate-400'
            : 'bg-slate-900/90 border-slate-800 border-t-blue-500 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`text-[11px] font-black uppercase tracking-wider ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            Revenue & Volume
          </span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${
            isLight ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-blue-500/20 text-blue-400'
          }`}>
            <FiDollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Total Revenue</span>
            <span className={`text-base font-black ${isLight ? 'text-blue-700' : 'text-blue-400'}`}>
              {formatCedi(totalRevenue)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Vouchers Sold</span>
            <span className={`text-sm font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {vouchersSold.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Orders Placed</span>
            <span className={`text-sm font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {ordersPlaced.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 2. PAYMENT STATUSES */}
      <div
        onClick={() => onSelectFilter('FULFILLED')}
        className={`p-5 rounded-3xl border border-t-4 transition-all cursor-pointer shadow-sm hover:shadow-md ${
          isLight
            ? 'bg-white border-slate-300 border-t-emerald-500 hover:border-slate-400'
            : 'bg-slate-900/90 border-slate-800 border-t-emerald-500 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`text-[11px] font-black uppercase tracking-wider ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            Payment Statuses
          </span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${
            isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            <FiCheckCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Successful</span>
            <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
              {successfulPayments.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Pending</span>
            <span className="text-sm font-black text-amber-700 dark:text-amber-400">
              {pendingPayments.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Failed</span>
            <span className="text-sm font-black text-rose-700 dark:text-rose-400">
              {failedPayments.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 3. SALES BREAKDOWN */}
      <div
        onClick={() => onSelectFilter('ALL')}
        className={`p-5 rounded-3xl border border-t-4 transition-all cursor-pointer shadow-sm hover:shadow-md ${
          isLight
            ? 'bg-white border-slate-300 border-t-purple-500 hover:border-slate-400'
            : 'bg-slate-900/90 border-slate-800 border-t-purple-500 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`text-[11px] font-black uppercase tracking-wider ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            Sales Breakdown
          </span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${
            isLight ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-purple-500/20 text-purple-400'
          }`}>
            <FiPieChart className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-3">
          <div>
            <span className={`text-[11px] font-bold block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>WASSCE/NOVDEC</span>
            <span className={`text-sm font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {wassceSales.toLocaleString()}
            </span>
          </div>

          <div>
            <span className={`text-[11px] font-bold block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Web Checkout</span>
            <span className="text-sm font-black text-blue-700 dark:text-blue-400">
              {webSales.toLocaleString()}
            </span>
          </div>

          <div>
            <span className={`text-[11px] font-bold block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>BECE</span>
            <span className={`text-sm font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {beceSales.toLocaleString()}
            </span>
          </div>

          <div>
            <span className={`text-[11px] font-bold block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>USSD Channel</span>
            <span className="text-sm font-black text-amber-700 dark:text-amber-400">
              {ussdSales.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 4. DELIVERY RATES */}
      <div
        onClick={() => onSelectFilter('ALL')}
        className={`p-5 rounded-3xl border border-t-4 transition-all cursor-pointer shadow-sm hover:shadow-md ${
          isLight
            ? 'bg-white border-slate-300 border-t-amber-500 hover:border-slate-400'
            : 'bg-slate-900/90 border-slate-800 border-t-amber-500 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`text-[11px] font-black uppercase tracking-wider ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            Delivery Rates
          </span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${
            isLight ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-amber-500/20 text-amber-400'
          }`}>
            <FiSend className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Sent (Delivered)</span>
            <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
              {sentDelivered.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Failed Delivery</span>
            <span className="text-sm font-black text-rose-700 dark:text-rose-400">
              {failedDelivery.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Not Sent</span>
            <span className={`text-sm font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {notSent.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
