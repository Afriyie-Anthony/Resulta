import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import type { Order } from './types';
import { FiSearch, FiFilter } from 'react-icons/fi';

interface OrdersFilterToolbarProps {
  orders: Order[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  networkFilter: string;
  onNetworkChange: (network: string) => void;
  productFilter: string;
  onProductChange: (product: string) => void;
}

export const OrdersFilterToolbar: React.FC<OrdersFilterToolbarProps> = ({
  orders,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  networkFilter,
  onNetworkChange,
  productFilter,
  onProductChange,
}) => {
  const { isLight } = useAdminTheme();

  // Count helper
  const getStatusCount = (st: string) => {
    if (st === 'ALL') return orders.length;
    return orders.filter(o => o.status === st).length;
  };

  const statusOptions = [
    { id: 'ALL', label: 'All Orders' },
    { id: 'FULFILLED', label: 'Fulfilled' },
    { id: 'PENDING_MOMO', label: 'Pending MoMo' },
    { id: 'FAILED', label: 'Failed' },
  ];

  const networkOptions = ['ALL', 'MTN MoMo', 'Telecel Cash', 'AirtelTigo'];
  const productOptions = ['ALL', 'WASSCE 2026 Voucher', 'BECE 2026 Voucher'];

  return (
    <div className={`p-5 rounded-3xl border transition-colors shadow-sm space-y-4 ${
      isLight ? 'bg-white border-slate-200/90' : 'bg-slate-900/90 border-slate-800'
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
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  isSelected
                    ? isLight
                      ? 'bg-[#0F8B8D] text-white shadow-sm shadow-[#0F8B8D]/25'
                      : 'bg-teal-500 text-slate-950 shadow-sm shadow-teal-950 font-black'
                    : isLight
                    ? 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{opt.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isSelected
                    ? 'bg-white/25 text-white'
                    : isLight
                    ? 'bg-slate-200 text-slate-700'
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
                ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D] focus:bg-white'
                : 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-teal-500'
            }`}
          />
        </div>
      </div>

      {/* Bottom row: Network & Exam secondary filters */}
      <div className={`pt-3.5 flex flex-wrap items-center justify-between gap-4 border-t ${
        isLight ? 'border-slate-100' : 'border-slate-800/80'
      }`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5 mr-1">
            <FiFilter className="w-3.5 h-3.5 text-[#0F8B8D] dark:text-teal-400" /> Gateway:
          </span>
          {networkOptions.map((net) => (
            <button
              key={net}
              onClick={() => onNetworkChange(net)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all border ${
                networkFilter === net
                  ? isLight
                    ? 'bg-secondary text-white border-secondary shadow-2xs'
                    : 'bg-slate-700 text-white border-slate-600 font-black'
                  : isLight
                  ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {net === 'ALL' ? 'All Operators' : net}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Exam Type:</span>
          {productOptions.map((prod) => (
            <button
              key={prod}
              onClick={() => onProductChange(prod)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all border ${
                productFilter === prod
                  ? isLight
                    ? 'bg-[#0F8B8D] text-white border-[#0F8B8D] shadow-2xs'
                    : 'bg-teal-500/20 text-teal-400 border-teal-500/50 font-black'
                  : isLight
                  ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {prod === 'ALL' ? 'All Products' : prod.replace(' Voucher', '')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
