import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Badge } from '../../ui/Badge';
import { Pagination } from '../../ui/Pagination';
import type { SmsLog } from './types';
import { FiSearch, FiInbox } from 'react-icons/fi';

interface SmsHistoryTableProps {
  logs: SmsLog[];
  isLoading: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const SmsHistoryTable: React.FC<SmsHistoryTableProps> = ({
  logs,
  isLoading,
  pagination,
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  onPageChange,
  onLimitChange,
}) => {
  const { isLight } = useAdminTheme();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-4 ${
      isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
    }`}>
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className={`text-base font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
            SMS Transmission & Blast History
          </h3>
          <p className={`text-xs font-semibold mt-0.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Complete record of all broadcasted bulk campaigns and direct client notifications.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search */}
          <div className="relative w-full sm:w-60">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search phone or message..."
              className={`w-full rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none border transition-all ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500'
              }`}
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className={`rounded-2xl px-3 py-2 text-xs font-bold border focus:outline-none ${
              isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500'
            }`}
          >
            <option value="">All Dispatch Types</option>
            <option value="BULK">Bulk Broadcasts</option>
            <option value="SINGLE">Single Direct SMS</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className={`rounded-2xl px-3 py-2 text-xs font-bold border focus:outline-none ${
              isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500'
            }`}
          >
            <option value="">All Categories</option>
            <option value="GLOBAL">Global</option>
            <option value="BECE">BECE</option>
            <option value="WASSCE_NOVDEC">WASSCE / NOVDEC</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[11px] uppercase font-black ${
              isLight ? 'border-slate-300 bg-slate-100/90 text-slate-700' : 'border-slate-800 bg-slate-950/50 text-slate-400'
            }`}>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Log Ref</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Type</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Target Cohort / Recipient</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Message Copy Snippet</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Recipients</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Dispatched At</th>
              <th className="py-2.5 px-3.5 text-right whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-semibold ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3 px-3.5"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" /></td>
                  <td className="py-3 px-3.5"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-12" /></td>
                  <td className="py-3 px-3.5"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28" /></td>
                  <td className="py-3 px-3.5"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-48" /></td>
                  <td className="py-3 px-3.5"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-12" /></td>
                  <td className="py-3 px-3.5"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" /></td>
                  <td className="py-3 px-3.5 text-right"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16 ml-auto" /></td>
                </tr>
              ))
            ) : logs.length > 0 ? (
              logs.map((item) => (
                <tr key={item.id} className={`transition-colors ${isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-950/40'}`}>
                  <td className={`py-2.5 px-3.5 whitespace-nowrap font-mono font-black ${
                    isLight ? 'text-[#0B2545]' : 'text-teal-400'
                  }`}>
                    {item.id}
                  </td>

                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      item.type === 'BULK'
                        ? 'bg-purple-100 text-purple-900 dark:bg-purple-950/70 dark:text-purple-300'
                        : 'bg-cyan-100 text-cyan-900 dark:bg-cyan-950/70 dark:text-cyan-300'
                    }`}>
                      {item.type}
                    </span>
                  </td>

                  <td className={`py-2.5 px-3.5 whitespace-nowrap font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    {item.type === 'SINGLE'
                      ? item.recipientPhone || 'Single Recipient'
                      : `${item.category || 'GLOBAL'} (${item.statusFilter || 'ALL'})`}
                  </td>

                  <td className={`py-2.5 px-3.5 font-semibold max-w-xs truncate ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    {item.message}
                  </td>

                  <td className={`py-2.5 px-3.5 whitespace-nowrap font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    {(item.recipientCount || 1).toLocaleString()}
                  </td>

                  <td className={`py-2.5 px-3.5 whitespace-nowrap font-bold text-xs ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    {formatDate(item.createdAt)}
                  </td>

                  <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                    <Badge variant="success" className="text-[10px] font-black uppercase px-2.5 py-0.5">
                      ● Delivered
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-500 font-semibold space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 text-lg">
                    <FiInbox />
                  </div>
                  <p>No SMS dispatch logs found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={`pt-3 border-t ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={onPageChange}
          onItemsPerPageChange={onLimitChange}
        />
      </div>
    </div>
  );
};
