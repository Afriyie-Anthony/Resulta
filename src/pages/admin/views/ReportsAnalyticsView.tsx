import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import { formatCedi } from '../../../utils/formatters';
import {
  FiDownload,
  FiTrendingUp,
  FiPieChart,
  FiCalendar
} from 'react-icons/fi';

export const ReportsAnalyticsView: React.FC = () => {
  const { addToast } = useToast();
  const [dateRange, setDateRange] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('WEEKLY');

  const stats = {
    DAILY: { totalRev: 8450.0, wassceVol: 240, beceVol: 98, webCount: 231, ussdCount: 107 },
    WEEKLY: { totalRev: 52180.0, wassceVol: 1510, beceVol: 720, webCount: 1530, ussdCount: 700 },
    MONTHLY: { totalRev: 184500.0, wassceVol: 5400, beceVol: 2475, webCount: 5400, ussdCount: 2475 },
  };

  const current = stats[dateRange];

  const handleExport = (format: 'CSV' | 'PDF') => {
    addToast({
      title: `${format} Report Generated`,
      message: `${dateRange} commercial summary report compiled and initiated for secure download.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Reports & Commercial Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregate revenue performance, product volume attribution, and channel telemetry (Section 41).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" leftIcon={<FiDownload />} onClick={() => handleExport('CSV')}>
            Export CSV
          </Button>
          <Button variant="gradient" size="sm" leftIcon={<FiDownload />} onClick={() => handleExport('PDF')}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <FiCalendar className="text-teal-400 mr-1" />
        <span className="text-xs font-bold text-slate-300 mr-2">Reporting Window:</span>
        {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((range) => (
          <button
            key={range}
            type="button"
            onClick={() => setDateRange(range)}
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              dateRange === range
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {range} SUMMARY
          </button>
        ))}
      </div>

      {/* Analytics Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glass className="p-6 border-slate-800/80">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Gross Revenue Collected</p>
          <p className="text-3xl font-black text-emerald-400 mt-2">{formatCedi(current.totalRev)}</p>
          <div className="mt-3 text-xs text-slate-400 flex items-center gap-1">
            <FiTrendingUp className="text-emerald-400" /> +14.2% higher than previous period
          </div>
        </Card>

        <Card glass className="p-6 border-slate-800/80">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">WASSCE 2026 Volume</p>
          <p className="text-3xl font-black text-white mt-2">{current.wassceVol.toLocaleString()} vouchers</p>
          <span className="text-xs text-teal-400 font-medium block mt-3">Gross: {formatCedi(current.wassceVol * 25.0)}</span>
        </Card>

        <Card glass className="p-6 border-slate-800/80">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">BECE 2026 Volume</p>
          <p className="text-3xl font-black text-amber-400 mt-2">{current.beceVol.toLocaleString()} vouchers</p>
          <span className="text-xs text-amber-300 font-medium block mt-3">Gross: {formatCedi(current.beceVol * 20.0)}</span>
        </Card>
      </div>

      {/* Channel & Affiliate Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card glass className="p-6 border-slate-800/80 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FiPieChart className="text-teal-400" /> Web vs USSD (*882#) Channel Split
            </h3>
            <Badge variant="primary">Telemetry</Badge>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-white">HTTPS Web Portal (Smartphones & Desktop)</span>
                <span className="text-teal-400">{Math.round((current.webCount / (current.webCount + current.ussdCount)) * 100)}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full" style={{ width: `${(current.webCount / (current.webCount + current.ussdCount)) * 100}%` }} />
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">{current.webCount.toLocaleString()} orders fulfilled online</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-white">USSD GSM Feature Phone Portal</span>
                <span className="text-amber-400">{Math.round((current.ussdCount / (current.webCount + current.ussdCount)) * 100)}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(current.ussdCount / (current.webCount + current.ussdCount)) * 100}%` }} />
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">{current.ussdCount.toLocaleString()} orders fulfilled via USSD code</span>
            </div>
          </div>
        </Card>

        <Card glass className="p-6 border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Top Performing Affiliate Networks</h3>
              <Badge variant="success">Active Commissions</Badge>
            </div>
            <p className="text-xs text-slate-400 mb-6">Partners generating highest sales conversion volume during selected reporting window.</p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <span className="font-bold text-white block">Kwaku Frimpong (REF-GH-8823)</span>
                  <span className="text-slate-500 text-[11px]">142 orders generated</span>
                </div>
                <span className="font-black text-emerald-400">{formatCedi(710.0)} earned</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <span className="font-bold text-white block">Esi Ansah (REF-GH-4412)</span>
                  <span className="text-slate-500 text-[11px]">98 orders generated</span>
                </div>
                <span className="font-black text-emerald-400">{formatCedi(490.0)} earned</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-right">
            <span className="text-[11px] text-slate-500">Standard affiliate attribution share: 10% gross</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
