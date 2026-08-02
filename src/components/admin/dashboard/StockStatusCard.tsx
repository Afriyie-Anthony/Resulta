import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../ui/Button';
import { FiBox, FiArrowUpRight } from 'react-icons/fi';

export const StockStatusCard: React.FC = () => {
  const navigate = useNavigate();
  const { isLight } = useAdminTheme();

  return (
    <div className={`p-6 rounded-3xl border flex flex-col justify-between h-full transition-colors ${
      isLight ? 'bg-white border-slate-200/90 shadow-md text-primary' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
    }`}>
      <div>
        <div className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-2">
            <FiBox className={`w-5 h-5 ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`} />
            <h3 className={`text-lg font-black tracking-tight ${isLight ? 'text-[#123B5D]' : 'text-white'}`}>
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
          {/* BECE Checker Keys (Low Stock Alert) */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className={`text-sm font-black ${isLight ? 'text-slate-900 font-extrabold' : 'text-white'}`}>
                  BECE Checker Keys
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-600 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30">
                  LOW STOCK ALERT
                </span>
              </div>
              <span className="text-xs font-bold text-slate-400">
                100 / 1,932 left
              </span>
            </div>

            {/* Progress Bar Track */}
            <div className={`w-full h-4 rounded-full overflow-hidden p-0.5 border ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800 border-slate-700'
            }`}>
              <div
                className="h-full rounded-full bg-[#F5B014] transition-all duration-700 shadow-xs"
                style={{ width: '94.8%' }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">94.8% allocated (sold)</span>
              <span className="text-rose-600 dark:text-rose-400 font-black">5.2% remaining</span>
            </div>
          </div>

          {/* WASSCE / NOVDEC Checker Keys (Healthy Stock) */}
          <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className={`text-sm font-black ${isLight ? 'text-slate-900 font-extrabold' : 'text-white'}`}>
                  WASSCE / NOVDEC Checker Keys
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30">
                  HEALTHY STOCK
                </span>
              </div>
              <span className="text-xs font-bold text-slate-400">
                1,832 / 2,000 left
              </span>
            </div>

            {/* Progress Bar Track */}
            <div className={`w-full h-4 rounded-full overflow-hidden p-0.5 border ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800 border-slate-700'
            }`}>
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-700 shadow-xs"
                style={{ width: '8.4%' }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">8.4% allocated (sold)</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-black">91.6% remaining</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-6 pt-4 border-t text-xs flex justify-between items-center ${isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
        <span className="font-medium">Auto-replenish threshold is set to 250 keys</span>
        <span className="font-bold text-secondary dark:text-teal-400">Webhook Active ●</span>
      </div>
    </div>
  );
};
