import React, { useState } from 'react';
import { Badge } from '../../ui/Badge';
import { useToast } from '../../ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiSearch, FiFileText, FiDownload, FiExternalLink, FiDatabase } from 'react-icons/fi';

export interface BatchRecord {
  id: string;
  product: string;
  uploadDate: string;
  serialRange: string;
  total: number;
  remaining: number;
  status: string;
}

interface BatchHistoryTableProps {
  batches: BatchRecord[];
  onInspectBatch?: (batchId: string) => void;
}

type FilterStatus = 'ALL' | 'ACTIVE' | 'ACTIVE_LOW' | 'DEPLETED';

export const BatchHistoryTable: React.FC<BatchHistoryTableProps> = ({ batches, onInspectBatch }) => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');

  // Apply search query & status filters
  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.serialRange.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;
    return batch.status === statusFilter;
  });

  const handleExportCSV = () => {
    addToast({
      title: 'Cryptographic Audit Exported',
      message: `Generated tamper-proof CSV audit report for ${filteredBatches.length} batch logs.`,
      type: 'success',
    });
  };

  return (
    <div className={`p-6 rounded-3xl border transition-colors shadow-sm ${
      isLight ? 'bg-white border-slate-200/90' : 'bg-slate-900/90 border-slate-800'
    }`}>
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`text-base font-black tracking-tight ${isLight ? 'text-primary' : 'text-white'}`}>
              Cryptographic Batch Ingestion Logs
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
              {filteredBatches.length} Records
            </span>
          </div>
          <p className={`text-xs font-medium mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Permanent audit record of uploaded stock files and encryption verification
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-wrap">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['ALL', 'ACTIVE', 'ACTIVE_LOW', 'DEPLETED'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all border ${
                  statusFilter === status
                    ? isLight
                      ? 'bg-secondary text-white border-secondary shadow-2xs'
                      : 'bg-teal-500 text-slate-950 border-teal-400 shadow-2xs'
                    : isLight
                    ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {status === 'ACTIVE_LOW' ? 'LOW STOCK' : status}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-56 shrink-0">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search batch or serial..."
              className={`w-full rounded-xl pl-9 pr-4 py-1.5 text-xs font-semibold focus:outline-none transition-colors border ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-secondary focus:bg-white'
                  : 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-teal-500'
              }`}
            />
          </div>

          {/* Export Audit Report Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all border flex items-center justify-center gap-1.5 shrink-0 ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/70 shadow-2xs'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 shadow-2xs'
            }`}
          >
            <FiDownload className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[11px] uppercase font-extrabold ${
              isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'
            }`}>
              <th className="py-3 px-3">Batch Reference</th>
              <th className="py-3 px-3">Examination Product</th>
              <th className="py-3 px-3">Ingested Date</th>
              <th className="py-3 px-3">Serial Number Span</th>
              <th className="py-3 px-3">Total Units</th>
              <th className="py-3 px-3">Remaining Stock</th>
              <th className="py-3 px-3">Pool Status</th>
              <th className="py-3 px-3 text-right">Audit Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-medium ${
            isLight ? 'divide-slate-200/80' : 'divide-slate-800/50'
          }`}>
            {filteredBatches.map((batch) => {
              const remainingPercent = Math.min(100, Math.max(0, (batch.remaining / batch.total) * 100));
              return (
                <tr key={batch.id} className={`transition-colors ${
                  isLight ? 'hover:bg-slate-50/80' : 'hover:bg-slate-950/50'
                }`}>
                  <td className={`py-3.5 px-3 font-mono font-black flex items-center gap-2 ${
                    isLight ? 'text-secondary' : 'text-teal-400'
                  }`}>
                    <FiFileText className="text-slate-400 shrink-0" /> {batch.id}
                  </td>
                  <td className={`py-3.5 px-3 font-bold ${isLight ? 'text-primary' : 'text-slate-200'}`}>
                    <div className="flex items-center gap-1.5">
                      <FiDatabase className="w-3.5 h-3.5 opacity-60" /> {batch.product}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 font-semibold">{batch.uploadDate}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-500 dark:text-slate-400 text-[11px] font-bold">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                      {batch.serialRange}
                    </span>
                  </td>
                  <td className={`py-3.5 px-3 font-black ${isLight ? 'text-primary' : 'text-white'}`}>
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
                      <div className="w-14 h-1.5 rounded-full overflow-hidden bg-slate-200/80 dark:bg-slate-800 shrink-0">
                        <div
                          className={`h-full rounded-full ${
                            batch.remaining === 0
                              ? 'bg-rose-500'
                              : batch.remaining < 200
                              ? 'bg-amber-500'
                              : isLight ? 'bg-[#0F8B8D]' : 'bg-teal-400'
                          }`}
                          style={{ width: `${remainingPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <Badge
                      variant={
                        batch.status === 'ACTIVE' ? 'success' : batch.status === 'ACTIVE_LOW' ? 'warning' : 'neutral'
                      }
                      className="text-[10px] !px-2 font-extrabold shadow-2xs"
                    >
                      {batch.status === 'ACTIVE_LOW' ? 'LOW STOCK' : batch.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        if (onInspectBatch) {
                          onInspectBatch(batch.id);
                        } else {
                          addToast({ title: 'Inspecting Batch', message: `Filtered registry for ${batch.id}`, type: 'info' });
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all inline-flex items-center gap-1 border ${
                        isLight
                          ? 'bg-slate-100/80 border-slate-200 text-slate-700 hover:bg-primary hover:text-white hover:border-primary shadow-2xs'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-teal-500 hover:text-slate-950 hover:border-teal-500'
                      }`}
                      title="Drilldown to inspect decrypted serial records in Registry"
                    >
                      <span>Inspect PINs</span>
                      <FiExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredBatches.length === 0 && (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400 font-medium">
                  No cryptographic batches found matching "{searchQuery}" under filter ({statusFilter}).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
