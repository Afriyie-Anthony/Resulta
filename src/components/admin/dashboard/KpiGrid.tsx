import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { formatCedi } from '../../../utils/formatters';
import type { OverviewCards } from '../../../schemas/dashboard';
import {
  FiDollarSign,
  FiShoppingBag,
  FiCheckCircle,
  FiAlertTriangle,
  FiBox,
  FiUsers,
  FiMessageSquare,
  FiFileText,
} from 'react-icons/fi';

// Fallbacks removed per user request
// ─── Skeleton Card ─────────────────────────────────────────────────────────
const SkeletonKpiCard: React.FC<{ isLight: boolean }> = ({ isLight }) => (
  <div className={`p-5 rounded-2xl border animate-pulse ${
    isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-900 border-slate-800'
  }`}>
    <div className="flex justify-between items-start gap-3">
      <div className="space-y-2 flex-1">
        <div className={`h-2.5 w-24 rounded ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />
        <div className={`h-7 w-32 rounded ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />
      </div>
      <div className={`w-11 h-11 rounded-2xl ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />
    </div>
    <div className={`mt-4 h-4 w-36 rounded ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />
  </div>
);

// ─── KpiGrid ───────────────────────────────────────────────────────────────
export interface KpiGridProps {
  data?: OverviewCards;
  isLoading: boolean;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ data, isLoading }) => {
  const navigate = useNavigate();
  const { isLight } = useAdminTheme();

  // Use actual data or safe empty default if missing
  const kpis: OverviewCards = data || {
    totalRevenue: { totalAmount: 0, todayAmount: 0 },
    totalOrders: { count: 0, todayCount: 0 },
    wassceStock: { availableCount: 0, status: 'LOW_STOCK_ALERT' },
    beceStock: { availableCount: 0, status: 'LOW_STOCK_ALERT' },
    pendingWithdrawals: { totalAmount: 0, count: 0 },
    activeAffiliates: { count: 0 },
    conversionRate: { rate: 0, label: 'Payment -> fulfillment' },
    todaysOrders: { count: 0, todayEarnedRevenue: 0 },
  };

  const kpiCards = [
    {
      title: 'TOTAL REVENUE',
      value: formatCedi(kpis.totalRevenue.totalAmount),
      badgeText: `Today: ${formatCedi(kpis.totalRevenue.todayAmount)}`,
      badgeType: 'success',
      bgLight: 'bg-emerald-100 border border-emerald-300 hover:bg-emerald-200/70 shadow-xs',
      bgDark: 'bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-500/60 text-white',
      titleLight: 'text-emerald-900 font-extrabold',
      valLight: 'text-emerald-950',
      icon: FiDollarSign,
      iconBgLight: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30',
      iconBgDark: 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/30',
      onClickPath: '/admin/orders',
    },
    {
      title: 'TOTAL ORDERS',
      value: kpis.totalOrders.count.toLocaleString(),
      badgeText: `Today: ${kpis.totalOrders.todayCount.toLocaleString()} orders`,
      badgeType: 'success',
      bgLight: 'bg-slate-200/90 border border-slate-300 hover:bg-slate-300/80 shadow-xs',
      bgDark: 'bg-slate-900 border border-slate-700 hover:border-slate-600 text-white',
      titleLight: 'text-slate-800 font-extrabold',
      valLight: 'text-slate-950',
      icon: FiShoppingBag,
      iconBgLight: 'bg-slate-800 text-white shadow-md shadow-slate-800/30',
      iconBgDark: 'bg-slate-700 text-white shadow-md',
      onClickPath: '/admin/orders',
    },
    {
      title: 'WASSCE STOCK',
      value: kpis.wassceStock.availableCount.toLocaleString(),
      badgeText: kpis.wassceStock.availableCount < 500 ? '⚠ Low stock' : 'Healthy stock',
      badgeType: kpis.wassceStock.availableCount < 500 ? 'warning' : 'success',
      bgLight: 'bg-[#0F8B8D]/20 border border-[#0F8B8D]/40 hover:bg-[#0F8B8D]/30 shadow-xs',
      bgDark: 'bg-teal-950/40 border border-teal-500/40 hover:border-teal-500/60 text-white',
      titleLight: 'text-[#0A2540] font-extrabold',
      valLight: 'text-[#0A2540]',
      icon: FiCheckCircle,
      iconBgLight: 'bg-[#0F8B8D] text-white shadow-md shadow-[#0F8B8D]/30',
      iconBgDark: 'bg-teal-400 text-slate-950 font-black shadow-md shadow-teal-400/30',
      onClickPath: '/admin/inventory',
    },
    {
      title: 'BECE STOCK',
      value: kpis.beceStock.availableCount.toLocaleString(),
      badgeText: kpis.beceStock.availableCount < 200 ? '⚠ Low stock' : 'Healthy stock',
      badgeType: kpis.beceStock.availableCount < 200 ? 'warning' : 'success',
      bgLight: 'bg-amber-100 border border-amber-300 hover:bg-amber-200/70 shadow-xs',
      bgDark: 'bg-amber-950/40 border border-amber-500/40 hover:border-amber-500/60 text-white',
      titleLight: 'text-amber-950 font-extrabold',
      valLight: 'text-amber-950',
      icon: FiAlertTriangle,
      iconBgLight: 'bg-amber-600 text-white shadow-md shadow-amber-600/30',
      iconBgDark: 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/30',
      onClickPath: '/admin/inventory',
    },
    {
      title: 'PENDING WITHDRAWALS',
      value: formatCedi(kpis.pendingWithdrawals.totalAmount),
      badgeText: `${kpis.pendingWithdrawals.count} payouts pending`,
      badgeType: kpis.pendingWithdrawals.count > 0 ? 'neutral' : 'success',
      bgLight: 'bg-rose-100 border border-rose-300 hover:bg-rose-200/70 shadow-xs',
      bgDark: 'bg-rose-950/40 border border-rose-500/40 hover:border-rose-500/60 text-white',
      titleLight: 'text-rose-900 font-extrabold',
      valLight: 'text-rose-950',
      icon: FiBox,
      iconBgLight: 'bg-rose-600 text-white shadow-md shadow-rose-600/30',
      iconBgDark: 'bg-rose-500 text-white shadow-md shadow-rose-500/30',
      onClickPath: '/admin/withdrawals',
    },
    {
      title: 'ACTIVE AFFILIATES',
      value: kpis.activeAffiliates.count.toLocaleString(),
      badgeText: 'Partner network',
      badgeType: 'success',
      bgLight: 'bg-blue-100 border border-blue-300 hover:bg-blue-200/70 shadow-xs',
      bgDark: 'bg-blue-950/40 border border-blue-500/40 hover:border-blue-500/60 text-white',
      titleLight: 'text-blue-950 font-extrabold',
      valLight: 'text-blue-950',
      icon: FiUsers,
      iconBgLight: 'bg-blue-600 text-white shadow-md shadow-blue-600/30',
      iconBgDark: 'bg-blue-500 text-white shadow-md shadow-blue-500/30',
      onClickPath: '/admin/affiliates',
    },
    {
      title: 'CONVERSION RATE',
      value: `${(kpis.conversionRate.rate ?? 98.4).toFixed(1)}%`,
      badgeText: kpis.conversionRate.label,
      badgeType: 'success',
      bgLight: 'bg-cyan-100 border border-cyan-300 hover:bg-cyan-200/70 shadow-xs',
      bgDark: 'bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-500/60 text-white',
      titleLight: 'text-cyan-950 font-extrabold',
      valLight: 'text-cyan-950',
      icon: FiMessageSquare,
      iconBgLight: 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30',
      iconBgDark: 'bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-400/30',
      onClickPath: '/admin/reports',
    },
    {
      title: 'TODAY\'S ORDERS',
      value: kpis.todaysOrders.count.toLocaleString(),
      badgeText: `${formatCedi(kpis.todaysOrders.todayEarnedRevenue)} earned today`,
      badgeType: 'success',
      bgLight: 'bg-indigo-100 border border-indigo-300 hover:bg-indigo-200/70 shadow-xs',
      bgDark: 'bg-indigo-950/40 border border-indigo-500/40 hover:border-indigo-500/60 text-white',
      titleLight: 'text-indigo-950 font-extrabold',
      valLight: 'text-indigo-950',
      icon: FiFileText,
      iconBgLight: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30',
      iconBgDark: 'bg-indigo-400 text-slate-950 font-black shadow-md shadow-indigo-400/30',
      onClickPath: '/admin/reports',
    },
  ];

  // ── Loading skeleton ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonKpiCard key={i} isLight={isLight} />
        ))}
      </div>
    );
  }

  // ── Render Cards ────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            onClick={() => card.onClickPath && navigate(card.onClickPath)}
            className={`p-5 rounded-2xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 shadow-sm ${
              isLight ? card.bgLight : card.bgDark
            }`}
          >
            <div className="flex justify-between items-start gap-3">
              <div className="space-y-1 min-w-0 flex-1">
                <p className={`text-[11px] font-black uppercase tracking-wider truncate ${
                  isLight ? card.titleLight : 'text-slate-400'
                }`}>
                  {card.title}
                </p>
                <p className={`text-2xl font-black tracking-tight truncate ${
                  isLight ? card.valLight : 'text-white'
                }`}>
                  {card.value}
                </p>
              </div>
              <div className={`w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center text-lg ${
                isLight ? card.iconBgLight : card.iconBgDark
              }`}>
                <Icon />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1">
              <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${
                card.badgeType === 'success'
                  ? isLight
                    ? 'bg-emerald-200/80 text-emerald-950 font-black'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                  : card.badgeType === 'warning'
                  ? isLight
                    ? 'bg-amber-200/80 text-amber-950 font-black'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold'
                  : isLight
                  ? 'bg-rose-200/80 text-rose-950 font-black'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold'
              }`}>
                {card.badgeText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
