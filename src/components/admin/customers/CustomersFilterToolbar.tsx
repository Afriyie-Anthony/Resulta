import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import type { Customer } from './types';
import { FiSearch } from 'react-icons/fi';

interface CustomersFilterToolbarProps {
  customers: Customer[];
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const CustomersFilterToolbar: React.FC<CustomersFilterToolbarProps> = ({
  customers,
  selectedStatus,
  onSelectStatus,
  searchTerm,
  onSearchChange
}) => {
  const { isLight } = useAdminTheme();

  const statuses = [
    { label: 'All Customers', value: 'ALL', count: customers.length },
    { label: 'VIP Buyers', value: 'VIP BUYER', count: customers.filter(c => c.status === 'VIP BUYER').length },
    { label: 'Verified Accounts', value: 'VERIFIED', count: customers.filter(c => c.status === 'VERIFIED').length }
  ];

  return (
    <div className={`p-4 rounded-3xl border transition-colors shadow-sm ${
      isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Primary Status Tabs with Counters */}
        <div className="flex flex-wrap items-center gap-2">
          {statuses.map((s) => {
            const isActive = selectedStatus === s.value;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => onSelectStatus(s.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all border ${
                  isActive
                    ? isLight
                      ? 'bg-[#0F8B8D] text-white border-[#0F8B8D] shadow-xs'
                      : 'bg-teal-500 text-slate-950 border-teal-400 font-black shadow-xs'
                    : isLight
                    ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 font-extrabold shadow-2xs'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{s.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  isActive
                    ? 'bg-white/25 text-white'
                    : isLight
                    ? 'bg-slate-200 text-slate-900'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {s.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Keyword search box */}
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search phone number or customer ID..."
            className={`w-full rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none transition-colors border ${
              isLight
                ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D] focus:bg-white'
                : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500 focus:bg-slate-900'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
