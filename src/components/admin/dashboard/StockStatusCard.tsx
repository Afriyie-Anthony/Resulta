import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../ui/Button';
import { FiBox, FiArrowUpRight } from 'react-icons/fi';
import { useInventoryStats } from '../../../hooks/useVouchers';

export const StockStatusCard: React.FC = () => {
  const navigate = useNavigate();
  const { isLight } = useAdminTheme();
  const { data: inventoryStats, isLoading } = useInventoryStats();

  const statsObj = inventoryStats as unknown as
    | Record<string, { available?: number; sold?: number; total?: number; threshold?: number } | undefined>
    | undefined;
  const wassceStats =
    statsObj?.wassce_novdec ||
    statsObj?.wassceNovdec ||
    statsObj?.WASSCE_NOVDEC ||
    statsObj?.wassce ||
    { available: 0, sold: 0, total: 0, threshold: 250 };
  const beceStats =
    statsObj?.bece || statsObj?.BECE || { available: 0, sold: 0, total: 0, threshold: 250 };

  const beceTotal = beceStats.total || ((beceStats.available ?? 0) + (beceStats.sold ?? 0)) || 0;
  const beceAvailable = beceStats.available || 0;
  const beceSold = beceStats.sold || Math.max(0, beceTotal - beceAvailable);
  const beceSoldPct = beceTotal > 0 ? ((beceSold / beceTotal) * 100).toFixed(1) : '0';
  const beceRemainPct = beceTotal > 0 ? ((beceAvailable / beceTotal) * 100).toFixed(1) : '0';
  const beceIsLow = beceAvailable <= (beceStats.threshold || 250);

  const wassceTotal = wassceStats.total || ((wassceStats.available ?? 0) + (wassceStats.sold ?? 0)) || 0;
  const wassceAvailable = wassceStats.available || 0;
  const wassceSold = wassceStats.sold || Math.max(0, wassceTotal - wassceAvailable);
  const wassceSoldPct = wassceTotal > 0 ? ((wassceSold / wassceTotal) * 100).toFixed(1) : '0';
  const wassceRemainPct = wassceTotal > 0 ? ((wassceAvailable / wassceTotal) * 100).toFixed(1) : '0';
  const wassceIsLow = wassceAvailable <= (wassceStats.threshold || 250);

  return (
    <div className={`p-6 rounded-3xl border flex flex-col justify-between h-full transition-colors ${
      isLight ? 'bg-white border-slate-200/90 shadow-md text-primary' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
    }`}>
      <div>
        <div className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-2">
            <FiBox className={`w-5 h-5 ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`} />
            <h3 className={`text-lg font-bold tracking-tight ${isLight ? 'text-[#123B5D]' : 'text-white'}`}>
              Voucher Stock Status
            </h3>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/inventory')} rightIcon={<FiArrowUpRight />}>
            Manage Stock
          </Button>
        </div>
        <p className={`text-xs font-medium mb-6 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Available checker keys and allocation levels
        </p>

        {/* Stock Items List */}
        <div className="space-y-8">
          {/* BECE Checker Keys */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  BECE Checker Keys
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                  beceIsLow
                    ? 'bg-rose-100 text-rose-600 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400'
                }`}>
                  {beceIsLow ? 'LOW STOCK ALERT' : 'HEALTHY STOCK'}
                </span>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {isLoading ? '...' : `${beceAvailable.toLocaleString()} / ${beceTotal.toLocaleString()} left`}
              </span>
            </div>

            {/* Progress Bar Track */}
            <div className={`w-full h-3 rounded-full overflow-hidden p-0.5 border ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800 border-slate-700'
            }`}>
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  beceIsLow ? 'bg-[#F5B014]' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, parseFloat(beceSoldPct)))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-400">{beceSoldPct}% allocated ({beceSold.toLocaleString()} sold)</span>
              <span className={beceIsLow ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-emerald-700 dark:text-emerald-400 font-semibold'}>
                {beceRemainPct}% remaining
              </span>
            </div>
          </div>

          {/* WASSCE / NOVDEC Checker Keys */}
          <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  WASSCE / NOVDEC Checker Keys
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                  wassceIsLow
                    ? 'bg-rose-100 text-rose-600 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400'
                }`}>
                  {wassceIsLow ? 'LOW STOCK ALERT' : 'HEALTHY STOCK'}
                </span>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {isLoading ? '...' : `${wassceAvailable.toLocaleString()} / ${wassceTotal.toLocaleString()} left`}
              </span>
            </div>

            {/* Progress Bar Track */}
            <div className={`w-full h-3 rounded-full overflow-hidden p-0.5 border ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800 border-slate-700'
            }`}>
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  wassceIsLow ? 'bg-[#F5B014]' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, parseFloat(wassceSoldPct)))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-400">{wassceSoldPct}% allocated ({wassceSold.toLocaleString()} sold)</span>
              <span className={wassceIsLow ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-emerald-700 dark:text-emerald-400 font-semibold'}>
                {wassceRemainPct}% remaining
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-6 pt-4 border-t text-xs flex justify-between items-center ${isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
        <span className="font-medium">Auto-replenish threshold is set to 250 keys</span>
        <span className="font-semibold text-teal-600 dark:text-teal-400">Live Inventory Active ●</span>
      </div>
    </div>
  );
};
