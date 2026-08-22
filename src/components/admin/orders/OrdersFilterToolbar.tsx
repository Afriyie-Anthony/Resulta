import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import type { OrderStats } from './types';
import { FiSearch, FiFilter } from 'react-icons/fi';

interface OrdersFilterToolbarProps {
  stats?: OrderStats;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  productFilter: string;
  onProductChange: (product: string) => void;
}

export const OrdersFilterToolbar: React.FC<OrdersFilterToolbarProps> = ({
  stats,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  productFilter,
  onProductChange,
}) => {
  const { isLight } = useAdminTheme();

  // Count helper using server stats
  const getStatusCount = (st: string) => {
    if (!stats) return 0;
    if (st === 'ALL') return stats.revenueAndVolume.ordersPlaced;
    if (st === 'SUCCESSFUL') return stats.paymentStatuses.successful;
    if (st === 'PENDING') return stats.paymentStatuses.pending;
    if (st === 'FAILED') return stats.paymentStatuses.failed;
    return 0;
  };

  const statusOptions = [
    { id: 'ALL', label: 'All Orders' },
    { id: 'SUCCESSFUL', label: 'Successful' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'FAILED', label: 'Failed' },
  ];

  const productOptions = ['ALL', 'WASSCE_NOVDEC', 'BECE'];

  return (
    <div className={`p-5 rounded-3xl border transition-colors shadow-sm space-y-4 ${
      isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
    }`}>
      {/* Top row: Status pills & Search input */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Status segmented buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          {statusOptions.map((opt) => {
            const count = getStatusCount(opt.id);
            const isSelected = statusFilter === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onStatusChange(opt.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap border ${
                  isSelected
                    ? isLight
                      ? 'bg-[#0F8B8D] text-white border-[#0F8B8D] shadow-xs'
                      : 'bg-teal-500 text-slate-950 border-teal-400 font-black shadow-xs'
                    : isLight
                    ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 font-extrabold shadow-2xs'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{opt.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isSelected
                    ? 'bg-white/25 text-white'
                    : isLight
                    ? 'bg-slate-200 text-slate-900'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full lg:w-80 shrink-0">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search phone, order ref or serial..."
            className={`w-full rounded-xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none transition-colors border ${
              isLight
                ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D] focus:bg-white'
                : 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-teal-500'
            }`}
          />
        </div>
      </div>

      {/* Bottom row: Exam Type product filter (gateways removed) */}
      <div className={`pt-3.5 flex items-center justify-between gap-4 border-t ${
        isLight ? 'border-slate-200' : 'border-slate-800/80'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-black uppercase flex items-center gap-1.5 mr-1 ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>
            <FiFilter className="w-3.5 h-3.5 text-[#0F8B8D] dark:text-teal-400" /> Exam Type:
          </span>
          {productOptions.map((prod) => (
            <button
              key={prod}
              type="button"
              onClick={() => onProductChange(prod)}
              className={`px-3 py-1 rounded-lg text-[11px] font-extrabold transition-all border ${
                productFilter === prod
                  ? isLight
                    ? 'bg-[#0F8B8D] text-white border-[#0F8B8D] shadow-2xs font-black'
                    : 'bg-teal-500/20 text-teal-400 border-teal-500/50 font-black'
                  : isLight
                  ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                  : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {prod === 'ALL' ? 'All Products' : prod.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
