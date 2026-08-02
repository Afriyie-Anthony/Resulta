import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import type { Customer } from './types';
import { FiSearch, FiFilter } from 'react-icons/fi';

interface CustomersFilterToolbarProps {
  customers: Customer[];
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  selectedNetwork: string;
  onSelectNetwork: (network: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const CustomersFilterToolbar: React.FC<CustomersFilterToolbarProps> = ({
  customers,
  selectedStatus,
  onSelectStatus,
  selectedNetwork,
  onSelectNetwork,
  searchTerm,
  onSearchChange
}) => {
  const { isLight } = useAdminTheme();

  const statuses = [
    { label: 'All Customers', value: 'ALL', count: customers.length },
    { label: 'VIP Buyers', value: 'VIP BUYER', count: customers.filter(c => c.status === 'VIP BUYER').length },
    { label: 'Verified Accounts', value: 'VERIFIED', count: customers.filter(c => c.status === 'VERIFIED').length }
  ];

  const networks = ['ALL', 'MTN MoMo', 'Telecel Cash', 'AirtelTigo'];

  return (
    <div className={`p-4 rounded-3xl border transition-colors ${
      isLight ? 'bg-white border-slate-200/90 shadow-sm' : 'bg-slate-900/90 border-slate-800 shadow-lg'
    }`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Primary Status Tabs with Counters */}
        <div className="flex flex-wrap items-center gap-2">
          {statuses.map((s) => {
            const isActive = selectedStatus === s.value;
            return (
              <button
                key={s.value}
                onClick={() => onSelectStatus(s.value)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? isLight
                      ? 'bg-[#0F8B8D] text-white shadow-md shadow-[#0F8B8D]/20'
                      : 'bg-teal-500 text-slate-950 font-black shadow-lg shadow-teal-500/20'
                    : isLight
                    ? 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <span>{s.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive
                    ? 'bg-black/20 text-white dark:bg-white/20 dark:text-slate-950'
                    : isLight
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {s.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar & Network Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Network Carrier Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-slate-400 mr-1 shrink-0">
              <FiFilter className="w-3.5 h-3.5" />
            </span>
            {networks.map((net) => (
              <button
                key={net}
                onClick={() => onSelectNetwork(net)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-colors shrink-0 ${
                  selectedNetwork === net
                    ? isLight
                      ? 'bg-secondary text-white'
                      : 'bg-slate-200 text-slate-950 font-black'
                    : isLight
                    ? 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                    : 'bg-slate-950/80 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {net === 'ALL' ? 'All Carriers' : net}
              </button>
            ))}
          </div>

          {/* Keyword search box */}
          <div className="relative min-w-[220px]">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search phone, ID, or tag..."
              className={`w-full rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold transition-all focus:outline-none border ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-primary focus:border-[#0F8B8D] focus:bg-white'
                  : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500 focus:bg-slate-900'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
