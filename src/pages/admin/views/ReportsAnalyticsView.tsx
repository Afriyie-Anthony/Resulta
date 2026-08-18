import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useToast } from '../../../components/ui/Toast';
import { formatCedi } from '../../../utils/formatters';
import {
  FiDownload,
  FiTrendingUp,
  FiPieChart,
  FiCalendar,
  FiBarChart2,
  FiDollarSign,
  FiShoppingBag,
  FiSmartphone,
  FiGlobe,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiActivity,
  FiMapPin,
  FiUserCheck
} from 'react-icons/fi';

export const ReportsAnalyticsView: React.FC = () => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();
  const [dateRange, setDateRange] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('WEEKLY');
  const [activeChartTab, setActiveChartTab] = useState<'REVENUE' | 'CHANNELS' | 'PRODUCTS'>('REVENUE');

  const statsData = {
    DAILY: {
      totalRev: 8450.0,
      wassceVol: 240,
      beceVol: 98,
      webCount: 231,
      ussdCount: 107,
      growth: '+8.4%',
      trendData: [
        { label: '00:00', rev: 450, count: 18 },
        { label: '04:00', rev: 320, count: 12 },
        { label: '08:00', rev: 1450, count: 58 },
        { label: '12:00', rev: 2200, count: 88 },
        { label: '16:00', rev: 2450, count: 98 },
        { label: '20:00', rev: 1580, count: 64 },
      ]
    },
    WEEKLY: {
      totalRev: 52180.0,
      wassceVol: 1510,
      beceVol: 720,
      webCount: 1530,
      ussdCount: 700,
      growth: '+14.2%',
      trendData: [
        { label: 'Mon', rev: 6200, count: 260 },
        { label: 'Tue', rev: 7400, count: 310 },
        { label: 'Wed', rev: 6900, count: 290 },
        { label: 'Thu', rev: 8100, count: 340 },
        { label: 'Fri', rev: 9800, count: 420 },
        { label: 'Sat', rev: 11200, count: 480 },
        { label: 'Sun', rev: 7580, count: 330 },
      ]
    },
    MONTHLY: {
      totalRev: 184500.0,
      wassceVol: 5400,
      beceVol: 2475,
      webCount: 5400,
      ussdCount: 2475,
      growth: '+22.8%',
      trendData: [
        { label: 'Week 1', rev: 38200, count: 1650 },
        { label: 'Week 2', rev: 44500, count: 1920 },
        { label: 'Week 3', rev: 49800, count: 2150 },
        { label: 'Week 4', rev: 52000, count: 2285 },
      ]
    },
    YEARLY: {
      totalRev: 1420500.0,
      wassceVol: 41200,
      beceVol: 18900,
      webCount: 41000,
      ussdCount: 19100,
      growth: '+38.5%',
      trendData: [
        { label: 'Q1', rev: 280000, count: 12000 },
        { label: 'Q2', rev: 350000, count: 14800 },
        { label: 'Q3', rev: 420500, count: 17800 },
        { label: 'Q4', rev: 370000, count: 15500 },
      ]
    }
  };

  const current = statsData[dateRange];
  const totalVolume = current.wassceVol + current.beceVol;

  const handleExport = (format: 'CSV' | 'PDF') => {
    addToast({
      title: `${format} Report Exported`,
      message: `${dateRange} commercial summary report compiled and initiated for secure download.`,
      type: 'success',
      duration: 3500
    });
  };

  // Calculate maximum revenue for dynamic chart height scaling
  const maxTrendRev = Math.max(...current.trendData.map((d) => d.rev));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className={`p-2.5 rounded-2xl ${
            isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/20 text-teal-400'
          }`}>
            <FiBarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Reports & Commercial Analytics
            </h1>
            <p className={`text-xs sm:text-sm font-semibold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Aggregate revenue performance, examination product volume attribution, and USSD/Web channel telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant={isLight ? 'outline' : 'secondary'}
            size="md"
            leftIcon={<FiDownload />}
            onClick={() => handleExport('CSV')}
            className="font-black text-xs h-11 px-4 rounded-2xl"
          >
            Export CSV
          </Button>
          <Button
            variant={isLight ? 'primary' : 'gradient'}
            size="md"
            leftIcon={<FiDownload />}
            onClick={() => handleExport('PDF')}
            className="font-black text-xs h-11 px-5 rounded-2xl shadow-md"
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Reporting Window Selector */}
      <div className={`p-3 rounded-3xl border transition-colors shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <FiCalendar className="text-[#0F8B8D] dark:text-teal-400 w-4 h-4" />
          <span className={`text-xs font-black uppercase ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
            Reporting Window:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
                dateRange === range
                  ? isLight
                    ? 'bg-[#0F8B8D] text-white shadow-xs'
                    : 'bg-teal-500 text-slate-950 font-black shadow-xs'
                  : isLight
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-extrabold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Gross Revenue */}
        <div className={`p-3.5 rounded-2xl border border-t-4 transition-all shadow-2xs ${
          isLight ? 'bg-white border-slate-300 border-t-emerald-500' : 'bg-slate-900/90 border-slate-800 border-t-emerald-500'
        }`}>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              Gross Revenue
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center text-xs">
              <FiDollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black tracking-tight text-emerald-700 dark:text-emerald-400">
            {formatCedi(current.totalRev)}
          </p>
          <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <FiTrendingUp className="w-3 h-3" /> {current.growth} vs previous period
          </p>
        </div>

        {/* 2. WASSCE Volume */}
        <div className={`p-3.5 rounded-2xl border border-t-4 transition-all shadow-2xs ${
          isLight ? 'bg-white border-slate-300 border-t-cyan-500' : 'bg-slate-900/90 border-slate-800 border-t-cyan-500'
        }`}>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              WASSCE 2026 Volume
            </span>
            <div className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-800 dark:bg-teal-500/20 dark:text-teal-400 flex items-center justify-center text-xs">
              <FiShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
            {current.wassceVol.toLocaleString()} <span className="text-xs font-bold text-slate-500">vouchers</span>
          </p>
          <p className={`text-[11px] font-bold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            Gross: {formatCedi(current.wassceVol * 25.0)}
          </p>
        </div>

        {/* 3. BECE Volume */}
        <div className={`p-3.5 rounded-2xl border border-t-4 transition-all shadow-2xs ${
          isLight ? 'bg-white border-slate-300 border-t-amber-500' : 'bg-slate-900/90 border-slate-800 border-t-amber-500'
        }`}>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              BECE 2026 Volume
            </span>
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center text-xs">
              <FiShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className={`text-xl font-black tracking-tight ${isLight ? 'text-amber-950' : 'text-amber-400'}`}>
            {current.beceVol.toLocaleString()} <span className="text-xs font-bold text-slate-500">vouchers</span>
          </p>
          <p className={`text-[11px] font-bold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            Gross: {formatCedi(current.beceVol * 20.0)}
          </p>
        </div>

        {/* 4. Total Vouchers Sold */}
        <div className={`p-3.5 rounded-2xl border border-t-4 transition-all shadow-2xs ${
          isLight ? 'bg-white border-slate-300 border-t-purple-500' : 'bg-slate-900/90 border-slate-800 border-t-purple-500'
        }`}>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              Total Vouchers Sold
            </span>
            <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center text-xs">
              <FiCheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
            {totalVolume.toLocaleString()} <span className="text-xs font-bold text-slate-500">Units</span>
          </p>
          <p className={`text-[11px] font-bold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            Avg checkout: {formatCedi(current.totalRev / (totalVolume || 1))} / unit
          </p>
        </div>
      </div>

      {/* Row 1 Charts: Revenue Trend Bar Visualizer + Channel Split & Market Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Chart 1: Interactive Bar Trend Chart (2 cols width) */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border transition-colors shadow-sm space-y-5 ${
          isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-200 dark:border-slate-800">
            <div>
              <h2 className={`text-base font-black flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                <FiBarChart2 className="text-[#0F8B8D] dark:text-teal-400" /> Revenue & Order Trend Visualizer
              </h2>
              <p className={`text-xs font-semibold mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Commercial revenue trajectory across the selected {dateRange.toLowerCase()} timeframe.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveChartTab('REVENUE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeChartTab === 'REVENUE'
                    ? isLight ? 'bg-[#0F8B8D] text-white' : 'bg-teal-500 text-slate-950'
                    : isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Revenue (GH₵)
              </button>
              <button
                type="button"
                onClick={() => setActiveChartTab('PRODUCTS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeChartTab === 'PRODUCTS'
                    ? isLight ? 'bg-[#0F8B8D] text-white' : 'bg-teal-500 text-slate-950'
                    : isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Orders Count
              </button>
            </div>
          </div>

          {/* Interactive Bar Chart Visualization */}
          <div className="pt-4">
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-4 px-2">
              {current.trendData.map((item, idx) => {
                const heightPercent = Math.round((item.rev / maxTrendRev) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                    {/* Tooltip on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 pointer-events-none bg-slate-950 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl shadow-lg border border-slate-800 whitespace-nowrap">
                      <div>{item.label}</div>
                      <div className="text-emerald-400">{formatCedi(item.rev)}</div>
                      <div className="text-slate-400">{item.count} orders</div>
                    </div>

                    {/* Bar Height */}
                    <div
                      className={`w-full max-w-[48px] rounded-t-2xl transition-all duration-500 group-hover:brightness-110 shadow-2xs ${
                        isLight
                          ? 'bg-gradient-to-t from-[#0B2545] to-[#0F8B8D]'
                          : 'bg-gradient-to-t from-teal-600 to-emerald-400'
                      }`}
                      style={{ height: `${Math.max(heightPercent, 12)}%` }}
                    />

                    {/* X-Axis Label */}
                    <span className={`text-[11px] font-black uppercase mt-1 ${
                      isLight ? 'text-slate-800' : 'text-slate-300'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`pt-4 border-t flex flex-wrap items-center justify-between text-xs font-semibold ${
            isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800 text-slate-400'
          }`}>
            <span>Peak Revenue Day: <strong>Saturday ({formatCedi(11200)})</strong></span>
            <span>Total Fulfilled Orders: <strong className="text-emerald-600 dark:text-emerald-400">{totalVolume.toLocaleString()} Orders</strong></span>
          </div>
        </div>

        {/* Visual Chart 2: Channel Split & Product Attribution (1 col width) */}
        <div className="space-y-6">
          {/* Channel Telemetry Split */}
          <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-5 ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className={`text-base font-black flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                <FiPieChart className="text-[#0F8B8D]" /> Web vs USSD Channel Split
              </h3>
              <Badge variant="primary" className="text-[10px] font-black uppercase">
                TELEMETRY
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Web Channel */}
              <div>
                <div className="flex justify-between text-xs font-black mb-1.5">
                  <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    <FiGlobe className="text-[#0F8B8D]" /> Web Portal (Online)
                  </span>
                  <span className="text-[#0F8B8D] dark:text-teal-400 font-mono font-black">
                    {Math.round((current.webCount / (current.webCount + current.ussdCount)) * 100)}%
                  </span>
                </div>
                <div className={`w-full h-3 rounded-full overflow-hidden border ${
                  isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div
                    className="h-full bg-gradient-to-r from-[#0B2545] to-[#0F8B8D] rounded-full transition-all duration-700"
                    style={{ width: `${(current.webCount / (current.webCount + current.ussdCount)) * 100}%` }}
                  />
                </div>
                <span className={`text-[11px] font-semibold block mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {current.webCount.toLocaleString()} orders fulfilled online
                </span>
              </div>

              {/* USSD Channel */}
              <div>
                <div className="flex justify-between text-xs font-black mb-1.5">
                  <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    <FiSmartphone className="text-amber-600" /> USSD Feature Phone (*713#)
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-mono font-black">
                    {Math.round((current.ussdCount / (current.webCount + current.ussdCount)) * 100)}%
                  </span>
                </div>
                <div className={`w-full h-3 rounded-full overflow-hidden border ${
                  isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-700"
                    style={{ width: `${(current.ussdCount / (current.webCount + current.ussdCount)) * 100}%` }}
                  />
                </div>
                <span className={`text-[11px] font-semibold block mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {current.ussdCount.toLocaleString()} orders fulfilled via USSD
                </span>
              </div>
            </div>
          </div>

          {/* Exam Product Share Donut Visual */}
          <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-4 ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <h3 className={`text-base font-black border-b pb-3 ${isLight ? 'border-slate-200 text-slate-950' : 'border-slate-800 text-white'}`}>
              Exam Checker Market Share
            </h3>

            <div className="flex items-center gap-4">
              {/* Visual Ring / Donut */}
              <div className="w-20 h-20 rounded-full border-8 border-cyan-500 border-t-amber-500 flex items-center justify-center shrink-0 shadow-inner">
                <span className="text-xs font-black text-slate-950 dark:text-white">100%</span>
              </div>

              <div className="space-y-2 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-500 shrink-0" />
                  <span className={isLight ? 'text-slate-900' : 'text-slate-200'}>WASSCE (68% Share)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                  <span className={isLight ? 'text-slate-900' : 'text-slate-200'}>BECE (32% Share)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 Charts: 4 Additional Distinct Analytics Visualizers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Visual Chart 3: Peak Checkout Hours Distribution Histogram */}
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
            {[
              { time: '00-04', val: 15 },
              { time: '04-08', val: 28 },
              { time: '08-12', val: 78 },
              { time: '12-16', val: 95 },
              { time: '16-20', val: 82 },
              { time: '20-24', val: 40 },
            ].map((slot, i) => (
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

        {/* Visual Chart 4: Payment Provider Reliability Success Rate */}
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

        {/* Visual Chart 5: Regional Sales & Demand Distribution */}
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

        {/* Visual Chart 6: Customer Cohort Retention Ratio */}
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

      {/* Top Affiliate Sales Attribution Table */}
      <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-4 ${
        isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className={`text-base font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Top Performing Affiliate Partner Networks
            </h3>
            <p className={`text-xs font-semibold mt-0.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Partners generating the highest sales conversion volume during the selected reporting window.
            </p>
          </div>
          <Badge variant="success" className="text-xs font-black uppercase px-3 py-1">
            Active Commission Routing
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] uppercase font-black ${
                isLight ? 'border-slate-300 bg-slate-100/90 text-slate-700' : 'border-slate-800 bg-slate-950/50 text-slate-400'
              }`}>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Partner Name</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Referral Code</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Orders Generated</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Gross Sales Generated</th>
                <th className="py-2.5 px-3.5 text-right whitespace-nowrap">Commission Earned</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-semibold ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
              <tr className={`transition-colors ${isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-950/40'}`}>
                <td className="py-2.5 px-3.5 whitespace-nowrap">
                  <div className={`font-black text-sm flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    <FiUsers className="text-[#0F8B8D]" /> Kwaku Frimpong
                  </div>
                </td>
                <td className={`py-2.5 px-3.5 whitespace-nowrap font-mono font-black ${isLight ? 'text-[#0B2545]' : 'text-teal-400'}`}>
                  REF-GH-8823
                </td>
                <td className={`py-2.5 px-3.5 whitespace-nowrap font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  142 orders
                </td>
                <td className={`py-2.5 px-3.5 whitespace-nowrap font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  {formatCedi(3550.0)}
                </td>
                <td className="py-2.5 px-3.5 text-right whitespace-nowrap font-black text-sm text-emerald-700 dark:text-emerald-400">
                  {formatCedi(710.0)}
                </td>
              </tr>

              <tr className={`transition-colors ${isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-950/40'}`}>
                <td className="py-2.5 px-3.5 whitespace-nowrap">
                  <div className={`font-black text-sm flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    <FiUsers className="text-[#0F8B8D]" /> Esi Ansah
                  </div>
                </td>
                <td className={`py-2.5 px-3.5 whitespace-nowrap font-mono font-black ${isLight ? 'text-[#0B2545]' : 'text-teal-400'}`}>
                  REF-GH-4412
                </td>
                <td className={`py-2.5 px-3.5 whitespace-nowrap font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  98 orders
                </td>
                <td className={`py-2.5 px-3.5 whitespace-nowrap font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  {formatCedi(2450.0)}
                </td>
                <td className="py-2.5 px-3.5 text-right whitespace-nowrap font-black text-sm text-emerald-700 dark:text-emerald-400">
                  {formatCedi(490.0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
