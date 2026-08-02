import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { formatCedi } from '../../../utils/formatters';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import {
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiRefreshCw,
  FiArrowUpRight,
  FiSmartphone,
  FiGlobe,
  FiCheckCircle,
  FiAlertTriangle,
  FiActivity,
  FiServer,
  FiSend,
  FiBarChart2,
  FiCalendar,
  FiDollarSign,
  FiMessageSquare,
  FiFileText
} from 'react-icons/fi';

// Types for interactive data models
type TimeFrame = '24h' | '7d' | '30d';
type OrderStatus = 'ALL' | 'FULFILLED' | 'PENDING' | 'FAILED';

export const DashboardOverviewView: React.FC = () => {
  const navigate = useNavigate();
  const { isLight } = useAdminTheme();
  
  // Interactive states
  const [timeframe, setTimeframe] = useState<TimeFrame>('7d');
  const [orderFilter, setOrderFilter] = useState<OrderStatus>('ALL');
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(2);

  // 8 DYNAMIC KPI METRIC CARDS WITH RICH MEDIUM-LIGHT PASTEL TINTS
  const kpiCards = [
    {
      title: 'TOTAL REVENUE',
      value: 'GH₵ 55,500.00',
      badgeText: '+12.4% from last month',
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
      value: '6,181',
      badgeText: '+8.4% from last week',
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
      title: 'SUCCESSFUL ORDERS',
      value: '1,849',
      badgeText: '96.1% Success Rate',
      badgeType: 'success',
      bgLight: 'bg-[#0F8B8D]/20 border border-[#0F8B8D]/40 hover:bg-[#0F8B8D]/30 shadow-xs',
      bgDark: 'bg-teal-950/40 border border-teal-500/40 hover:border-teal-500/60 text-white',
      titleLight: 'text-[#0A2540] font-extrabold',
      valLight: 'text-[#0A2540]',
      icon: FiCheckCircle,
      iconBgLight: 'bg-[#0F8B8D] text-white shadow-md shadow-[#0F8B8D]/30',
      iconBgDark: 'bg-teal-400 text-slate-950 font-black shadow-md shadow-teal-400/30',
      onClickPath: '/admin/orders',
    },
    {
      title: 'FAILED ORDERS',
      value: '15',
      badgeText: '3.9% Failure Rate',
      badgeType: 'neutral',
      bgLight: 'bg-rose-100 border border-rose-300 hover:bg-rose-200/70 shadow-xs',
      bgDark: 'bg-rose-950/40 border border-rose-500/40 hover:border-rose-500/60 text-white',
      titleLight: 'text-rose-900 font-extrabold',
      valLight: 'text-rose-950',
      icon: FiAlertTriangle,
      iconBgLight: 'bg-rose-600 text-white shadow-md shadow-rose-600/30',
      iconBgDark: 'bg-rose-500 text-white shadow-md shadow-rose-500/30',
      onClickPath: '/admin/orders',
    },
    {
      title: 'VOUCHER STOCK',
      value: '133',
      badgeText: 'BECE Checker is low (14%)',
      badgeType: 'warning',
      bgLight: 'bg-amber-100 border border-amber-300 hover:bg-amber-200/70 shadow-xs',
      bgDark: 'bg-amber-950/40 border border-amber-500/40 hover:border-amber-500/60 text-white',
      titleLight: 'text-amber-950 font-extrabold',
      valLight: 'text-amber-950',
      icon: FiBox,
      iconBgLight: 'bg-amber-600 text-white shadow-md shadow-amber-600/30',
      iconBgDark: 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/30',
      onClickPath: '/admin/inventory',
    },
    {
      title: 'ACTIVE CUSTOMERS',
      value: '4,227',
      badgeText: '+5.2% active check',
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
      title: 'SMS DELIVERED',
      value: '1,848',
      badgeText: '100% Delivery Rate',
      badgeType: 'success',
      bgLight: 'bg-cyan-100 border border-cyan-300 hover:bg-cyan-200/70 shadow-xs',
      bgDark: 'bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-500/60 text-white',
      titleLight: 'text-cyan-950 font-extrabold',
      valLight: 'text-cyan-950',
      icon: FiMessageSquare,
      iconBgLight: 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30',
      iconBgDark: 'bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-400/30',
      onClickPath: '/admin/orders',
    },
    {
      title: 'AVG ORDER VALUE',
      value: 'GH₵ 30.02',
      badgeText: 'Consistent with target',
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

  // Chart dataset based on selected timeframe
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

  // Live Gateway Health status
  const gateways = [
    { name: 'MTN MoMo Gateway', status: 'ONLINE', latency: '24ms', successRate: '99.8%', iconColor: 'text-amber-500 bg-amber-500/10' },
    { name: 'Telecel Cash API', status: 'ONLINE', latency: '38ms', successRate: '98.9%', iconColor: 'text-rose-500 bg-rose-500/10' },
    { name: 'AirtelTigo Money', status: 'DEGRADED', latency: '142ms', successRate: '94.1%', iconColor: 'text-blue-500 bg-blue-500/10' },
    { name: 'WAEC Voucher Engine', status: 'ONLINE', latency: '18ms', successRate: '100%', iconColor: 'text-emerald-500 bg-emerald-500/10' },
  ];

  // Recent orders with network colors and actions
  const allOrders = [
    { id: 'RSL-2026-981A', phone: '+233 24 551 0921', network: 'MTN MoMo', netColor: 'bg-amber-400 text-slate-950', product: 'WASSCE 2026', amount: 25.0, status: 'FULFILLED', time: '1 min ago', latency: '1.2s delivery' },
    { id: 'RSL-2026-981B', phone: '+233 50 182 3310', network: 'Telecel Cash', netColor: 'bg-rose-600 text-white', product: 'BECE 2026', amount: 20.0, status: 'FULFILLED', time: '3 mins ago', latency: '1.8s delivery' },
    { id: 'RSL-2026-981C', phone: '+233 27 409 1192', network: 'AirtelTigo', netColor: 'bg-blue-600 text-white', product: 'WASSCE 2026', amount: 25.0, status: 'PENDING', time: '5 mins ago', latency: 'Waiting SMS' },
    { id: 'RSL-2026-981D', phone: '+233 54 902 4418', network: 'MTN MoMo', netColor: 'bg-amber-400 text-slate-950', product: 'WASSCE 2026', amount: 25.0, status: 'FULFILLED', time: '8 mins ago', latency: '0.9s delivery' },
    { id: 'RSL-2026-981E', phone: '+233 20 448 9912', network: 'Telecel Cash', netColor: 'bg-rose-600 text-white', product: 'BECE 2026', amount: 20.0, status: 'FAILED', time: '14 mins ago', latency: 'Gateway Timeout' },
    { id: 'RSL-2026-981F', phone: '+233 24 110 8943', network: 'MTN MoMo', netColor: 'bg-amber-400 text-slate-950', product: 'WASSCE 2026', amount: 25.0, status: 'FULFILLED', time: '22 mins ago', latency: '1.1s delivery' },
  ];

  const filteredOrders = orderFilter === 'ALL' ? allOrders : allOrders.filter(o => o.status === orderFilter);

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-black uppercase px-2 py-0.5 rounded-md tracking-wider ${
              isLight ? 'bg-primary/10 text-primary' : 'bg-teal-500/20 text-teal-400'
            }`}>
              Live Telemetry & Controls
            </span>
            <span className={`text-xs flex items-center gap-1 font-semibold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" /> All Systems Nominal
            </span>
          </div>
          <h1 className={`text-2xl font-black tracking-tight mt-1 transition-colors ${isLight ? 'text-primary' : 'text-white'}`}>
            Executive Control Center
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" leftIcon={<FiRefreshCw className="w-3.5 h-3.5" />} onClick={() => window.location.reload()}>
            Refresh Telemetry
          </Button>
          <Button variant={isLight ? 'primary' : 'gradient'} size="sm" leftIcon={<FiBox className="w-3.5 h-3.5" />} onClick={() => navigate('/admin/inventory')}>
            Inventory Settings
          </Button>
        </div>
      </div>

      {/* 8 DYNAMIC KPI CARDS GRID (4x2 Layout) WITH RICH VISIBLE BACKGROUND TINTS */}
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
                <div
                  className={`w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center text-lg ${
                    isLight ? card.iconBgLight : card.iconBgDark
                  }`}
                >
                  <Icon />
                </div>
              </div>

              <div className="mt-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold shadow-xs ${
                    card.badgeType === 'success'
                      ? isLight
                        ? 'bg-white text-emerald-950 font-black border border-emerald-300'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : card.badgeType === 'warning'
                      ? isLight
                        ? 'bg-white text-amber-950 font-black border border-amber-300'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : isLight
                      ? 'bg-white text-slate-800 font-black border border-slate-300'
                      : 'bg-slate-800/80 text-slate-300'
                  }`}
                >
                  {card.badgeText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FEATURE SECTION 1: INTERACTIVE REVENUE & ORDER TREND CHART */}
      <div className={`p-6 rounded-3xl border transition-colors ${
        isLight ? 'bg-white border-slate-200/90 shadow-md text-primary' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
      }`}>
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

          {/* Timeframe selector tabs */}
          <div className={`inline-flex items-center p-1 rounded-xl border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            {(['24h', '7d', '30d'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                onClick={() => { setTimeframe(tf); setSelectedBarIndex(0); }}
                className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all ${
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

        {/* Chart Summary Bar */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl border mb-6 ${
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

        {/* Custom Interactive CSS/SVG Bar Chart */}
        <div className="relative pt-4 pb-2">
          {/* Chart visual display */}
          <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 px-2 pt-6 pb-2 border-b border-dashed border-slate-300 dark:border-slate-800">
            {activeData.map((data, idx) => {
              const heightPct = Math.max(15, (data.revenue / maxRevenue) * 100);
              const isSelected = selectedBarIndex === idx;
              
              return (
                <div
                  key={data.label}
                  onClick={() => setSelectedBarIndex(idx)}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                >
                  {/* Hover tooltip hint */}
                  <span className={`text-[10px] font-black tracking-tight px-1.5 py-0.5 rounded transition-all duration-200 ${
                    isSelected
                      ? isLight ? 'bg-primary text-white opacity-100 scale-105' : 'bg-teal-400 text-slate-950 opacity-100 scale-105 font-black'
                      : 'opacity-0 group-hover:opacity-100 bg-slate-800 text-white'
                  }`}>
                    {formatCedi(data.revenue)}
                  </span>

                  {/* Visual column */}
                  <div className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 relative overflow-hidden ${
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
                    {/* Interior gradient highlight */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-40" />
                  </div>

                  {/* X Axis label */}
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

          {/* Detailed Data Focus Panel for clicked bar */}
          {selectedBarIndex !== null && activeData[selectedBarIndex] && (
            <div className={`mt-4 p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn ${
              isLight ? 'bg-[#0F8B8D]/5 border-[#0F8B8D]/20' : 'bg-teal-950/30 border-teal-500/30'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
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

              <div className="flex items-center gap-6 shrink-0 text-right">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Web vs USSD</span>
                  <span className={`text-xs font-black ${isLight ? 'text-primary' : 'text-slate-200'}`}>
                    {100 - activeData[selectedBarIndex].ussdPct}% Web / {activeData[selectedBarIndex].ussdPct}% USSD
                  </span>
                </div>
                <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />
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

      {/* FEATURE SECTION 2: GATEWAY TELEMETRY & LIVE TRANSACTION FEED GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Advanced Live Orders Queue */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border flex flex-col justify-between transition-colors ${
          isLight ? 'bg-white border-slate-200/90 shadow-md text-primary' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
        }`}>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <FiShoppingBag className={`w-5 h-5 ${isLight ? 'text-secondary' : 'text-teal-400'}`} />
                  <h3 className={`text-base font-black ${isLight ? 'text-primary' : 'text-white'}`}>
                    Live Transaction Dispatch Queue
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  Instant SMS PIN dispatch with MoMo network confirmation
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['ALL', 'FULFILLED', 'PENDING', 'FAILED'] as OrderStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all border ${
                      orderFilter === status
                        ? isLight
                          ? 'bg-secondary text-white border-secondary shadow-2xs'
                          : 'bg-teal-500 text-slate-950 border-teal-400 shadow-2xs'
                        : isLight
                        ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[11px] uppercase font-extrabold ${isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
                    <th className="py-3 px-3">Order Ref</th>
                    <th className="py-3 px-3">Customer MoMo</th>
                    <th className="py-3 px-3">Network</th>
                    <th className="py-3 px-3">Product</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Dispatch Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-xs font-medium ${isLight ? 'divide-slate-200/80' : 'divide-slate-800/60'}`}>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className={`transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-950/40'}`}>
                      <td className={`py-3.5 px-3 font-mono font-black ${isLight ? 'text-secondary' : 'text-teal-400'}`}>
                        {order.id}
                        <span className="block text-[10px] font-normal text-slate-400 font-sans">{order.time}</span>
                      </td>
                      <td className={`py-3.5 px-3 font-bold ${isLight ? 'text-primary' : 'text-slate-200'}`}>
                        {order.phone}
                        <span className="block text-[10px] font-medium text-slate-400">{formatCedi(order.amount)} received</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold shadow-2xs ${order.netColor}`}>
                          {order.network}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold">
                        {order.product}
                      </td>
                      <td className="py-3.5 px-3">
                        <Badge
                          variant={order.status === 'FULFILLED' ? 'success' : order.status === 'PENDING' ? 'warning' : 'error'}
                          className="text-[10px] !px-2 font-bold shadow-2xs"
                        >
                          {order.status}
                        </Badge>
                        <span className="block text-[9px] font-semibold text-slate-400 mt-0.5">{order.latency}</span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {order.status === 'FULFILLED' ? (
                          <button
                            onClick={() => alert(`Resent SMS confirmation to ${order.phone} for PIN order ${order.id}.`)}
                            className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-lg border transition-all ${
                              isLight
                                ? 'bg-slate-100 hover:bg-slate-200/80 border-slate-300 text-slate-700'
                                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                            }`}
                          >
                            <FiSend className="w-3 h-3 text-secondary" /> Resend SMS
                          </button>
                        ) : order.status === 'PENDING' ? (
                          <button
                            onClick={() => navigate('/admin/payments')}
                            className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:bg-amber-500/30 transition-all"
                          >
                            Verify MoMo
                          </button>
                        ) : (
                          <button
                            onClick={() => alert(`Initiating MoMo refund check for order ${order.id}.`)}
                            className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-500 border border-rose-500/30 hover:bg-rose-500/30 transition-all"
                          >
                            Refund Check
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                        No transactions match the selected filter ({orderFilter}).
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`mt-6 pt-4 border-t flex justify-between items-center text-xs ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <span className="font-semibold text-slate-500">
              Showing 6 of 338 automated deliveries today
            </span>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')} rightIcon={<FiArrowUpRight />}>
              Open Full Orders Database
            </Button>
          </div>
        </div>

        {/* Right Col: Live MoMo Gateway & Channel Distribution Analytics */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Live MoMo Gateway Telemetry */}
          <div className={`p-6 rounded-3xl border transition-colors ${
            isLight ? 'bg-white border-slate-200/90 shadow-md text-primary' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-base font-black flex items-center gap-2 ${isLight ? 'text-primary' : 'text-white'}`}>
                  <FiServer className={isLight ? 'text-secondary' : 'text-teal-400'} /> Live MoMo Gateways
                </h3>
                <p className="text-xs text-slate-400 font-medium">Real-time API response throughput</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}>
                ● Active
              </span>
            </div>

            <div className="space-y-3">
              {gateways.map((gw) => (
                <div
                  key={gw.name}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                    isLight ? 'bg-slate-50/80 border-slate-200 hover:bg-slate-100' : 'bg-slate-950/70 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${gw.iconColor}`}>
                      <FiActivity />
                    </div>
                    <div>
                      <p className={`text-xs font-black ${isLight ? 'text-primary' : 'text-slate-200'}`}>{gw.name}</p>
                      <p className="text-[10px] font-bold text-slate-400">
                        Latency: <span className={isLight ? 'text-slate-700 font-extrabold' : 'text-slate-300'}>{gw.latency}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`block text-[11px] font-black ${
                      gw.status === 'ONLINE' ? (isLight ? 'text-emerald-700' : 'text-emerald-400') : 'text-amber-500'
                    }`}>
                      {gw.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{gw.successRate} success</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Channel Volume Split & Regional Breakdown */}
          <div className={`p-6 rounded-3xl border transition-colors ${
            isLight ? 'bg-white border-slate-200/90 shadow-md text-primary' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
          }`}>
            <h3 className={`text-base font-black mb-1 flex items-center gap-2 ${isLight ? 'text-primary' : 'text-white'}`}>
              <FiGlobe className={isLight ? 'text-secondary' : 'text-teal-400'} /> Channel & Regional Mix
            </h3>
            <p className="text-xs text-slate-400 mb-5 font-medium">
              Storefront Web vs Offline GSM Feature Phones
            </p>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className={`flex items-center gap-2 ${isLight ? 'text-primary font-bold' : 'text-slate-200'}`}>
                    <FiGlobe className={isLight ? 'text-secondary' : 'text-teal-400'} /> Web HTTPS (Smartphones)
                  </span>
                  <span className={isLight ? 'text-secondary font-black' : 'text-teal-400'}>68.4%</span>
                </div>
                <div className={`w-full h-2.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-slate-800'}`}>
                  <div className={`h-full rounded-full transition-all duration-500 ${isLight ? 'bg-secondary' : 'bg-gradient-to-r from-teal-500 to-emerald-400'}`} style={{ width: '68.4%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className={`flex items-center gap-2 ${isLight ? 'text-primary font-bold' : 'text-slate-200'}`}>
                    <FiSmartphone className={isLight ? 'text-warning' : 'text-amber-400'} /> USSD Code (*882# GSM)
                  </span>
                  <span className={isLight ? 'text-warning font-black' : 'text-amber-400'}>31.6%</span>
                </div>
                <div className={`w-full h-2.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-slate-800'}`}>
                  <div className={`h-full rounded-full transition-all duration-500 ${isLight ? 'bg-warning' : 'bg-amber-400'}`} style={{ width: '31.6%' }} />
                </div>
              </div>

              <div className={`pt-4 border-t grid grid-cols-2 gap-2 text-center text-[11px] font-bold ${
                isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
              }`}>
                <div className={`p-2 rounded-xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-950'}`}>
                  <span className="block font-black text-sm text-secondary dark:text-teal-400">45%</span>
                  Greater Accra
                </div>
                <div className={`p-2 rounded-xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-950'}`}>
                  <span className="block font-black text-sm text-secondary dark:text-teal-400">28%</span>
                  Ashanti Region
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
