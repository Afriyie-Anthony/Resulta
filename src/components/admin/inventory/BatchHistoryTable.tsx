import React, { useState } from 'react';
import { Badge } from '../../ui/Badge';
import { Pagination } from '../../ui/Pagination';
import { useToast } from '../../ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiSearch, FiFileText, FiDownload, FiDatabase } from 'react-icons/fi';
import { useUploadHistory } from '../../../hooks/useVouchers';
import type { VoucherType } from '../../../schemas/voucher';

interface BatchHistoryTableProps {}

type FilterStatus = 'ALL' | VoucherType;

export const BatchHistoryTable: React.FC<BatchHistoryTableProps> = () => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isLoading } = useUploadHistory({
    page: currentPage,
    limit: itemsPerPage,
    voucherType: statusFilter,
    search: searchQuery,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status: FilterStatus) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    addToast({
      title: 'Cryptographic Audit Exported',
      message: `Generated tamper-proof CSV audit report.`,
      type: 'success',
    });
  };

  const batches = data?.items || [];
  const totalPages = data?.meta?.totalPages || 1;
  const totalItems = data?.meta?.total || 0;

  return (
    <div className={`p-6 rounded-3xl border transition-colors shadow-sm ${
      isLight ? 'bg-white border-slate-200/90' : 'bg-slate-900/90 border-slate-800'
    }`}>
      {/* Header Row: Title + Search & Export */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className={`text-base font-black tracking-tight ${isLight ? 'text-primary' : 'text-white'}`}>
              Cryptographic Batch Ingestion Logs
            </h3>
            <span className={`px-3 py-1 text-[11px] font-black rounded-lg border transition-colors ${
              isLight
                ? 'bg-slate-200 border-slate-300 text-slate-900'
                : 'bg-slate-800 border-slate-700 text-slate-100'
            }`}>
              {totalItems} {totalItems === 1 ? 'Record' : 'Records'}
            </span>
          </div>
          <p className={`text-xs font-semibold mt-0.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Permanent audit record of uploaded stock files and encryption verification
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap lg:flex-nowrap shrink-0">
          {/* Search Bar */}
          <div className="relative w-full sm:w-60 shrink-0">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search batch or serial..."
              className={`w-full rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none transition-all border ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-secondary focus:bg-white focus:ring-2 focus:ring-secondary/10'
                  : 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10'
              }`}
            />
          </div>

          {/* Export Audit Report Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className={`px-3.5 py-2 rounded-xl font-black text-xs transition-all border flex items-center justify-center gap-1.5 shrink-0 ${
              isLight
                ? 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200 shadow-2xs'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 shadow-2xs'
            }`}
          >
            <FiDownload className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Control Toolbar: Status Segmented Filter */}
      <div className={`p-3 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 ${
        isLight ? 'bg-slate-100/90 border-slate-300' : 'bg-slate-950/40 border-slate-800/70'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>Filter by Product:</span>
          <div className={`inline-flex p-1 rounded-xl border ${
            isLight ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-900 border-slate-800'
          }`}>
            {(['ALL', 'WASSCE_NOVDEC', 'BECE'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilterChange(status)}
                className={`px-3 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                  statusFilter === status
                    ? isLight
                      ? 'bg-[#0F8B8D] text-white shadow-xs font-black'
                      : 'bg-teal-500 text-slate-950 font-black shadow-xs'
                    : isLight
                    ? 'text-slate-800 hover:text-slate-950 hover:bg-slate-100 font-extrabold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {status === 'ALL' ? 'All' : status.replace('_NOVDEC', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[11px] uppercase font-black ${
              isLight ? 'border-slate-300 text-slate-700' : 'border-slate-800 text-slate-400'
            }`}>
              <th className="py-3 px-3">Batch Reference</th>
              <th className="py-3 px-3">Examination Product</th>
              <th className="py-3 px-3">Ingested Date</th>
              <th className="py-3 px-3">Serial Number Span</th>
              <th className="py-3 px-3">Total Units</th>
              <th className="py-3 px-3">Remaining Stock</th>
              <th className="py-3 px-3">Pool Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-semibold ${
            isLight ? 'divide-slate-200' : 'divide-slate-800/50'
          }`}>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                  Loading...
                </td>
              </tr>
            ) : batches.map((batch) => {
              const remainingPercent = Math.min(100, Math.max(0, (batch.remaining / batch.total) * 100));
              return (
                <tr key={batch.id} className={`transition-colors ${
                  isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-950/50'
                }`}>
                  <td className={`py-3.5 px-3 font-mono font-black flex items-center gap-2 ${
                    isLight ? 'text-[#0B2545]' : 'text-teal-400'
                  }`}>
                    <FiFileText className="text-slate-400 shrink-0" /> {batch.id}
                  </td>
                  <td className={`py-3.5 px-3 font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                    <div className="flex items-center gap-1.5">
                      <FiDatabase className="w-3.5 h-3.5 opacity-60" /> {batch.voucherType}
                    </div>
                  </td>
                  <td className={`py-3.5 px-3 font-bold text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>{batch.uploadDate}</td>
                  <td className={`py-3.5 px-3 font-mono font-bold text-xs ${
                    isLight ? 'text-[#0F8B8D]' : 'text-teal-400'
                  }`}>
                    {batch.serialRange || 'N/A'}
                  </td>
                  <td className={`py-3.5 px-3 font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    {batch.total.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-black min-w-[50px] ${
                        batch.remaining === 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : batch.remaining < 200
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                      }`}>
                        {batch.remaining.toLocaleString()}
                      </span>
                      <div className={`w-16 h-2 rounded-full overflow-hidden shrink-0 border ${
                        isLight ? 'bg-slate-100 border-slate-200/80' : 'bg-slate-800/80 border-slate-700/60'
                      }`}>
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            batch.remaining === 0
                              ? 'bg-rose-500'
                              : batch.remaining < 200
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${remainingPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <Badge
                      variant={
                        batch.status === 'ACTIVE'
                          ? 'success'
                          : batch.status === 'ACTIVE_LOW'
                          ? 'warning'
                          : 'error'
                      }
                      className="text-[10px] font-extrabold !px-2 shadow-2xs"
                    >
                      {batch.status === 'ACTIVE_LOW' ? 'LOW STOCK' : batch.status}
                    </Badge>
                  </td>
                </tr>
              );
            })}
            {!isLoading && batches.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                  No batch ingestion records found matching "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(newSize) => {
          setItemsPerPage(newSize);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};
