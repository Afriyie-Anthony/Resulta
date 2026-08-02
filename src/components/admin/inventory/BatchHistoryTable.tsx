import React, { useState } from 'react';
import { Badge } from '../../ui/Badge';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiSearch, FiFileText } from 'react-icons/fi';

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
}

type FilterStatus = 'ALL' | 'ACTIVE' | 'ACTIVE_LOW' | 'DEPLETED';

export const BatchHistoryTable: React.FC<BatchHistoryTableProps> = ({ batches }) => {
  const { isLight } = useAdminTheme();
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

  return (
    <div className={`p-6 rounded-3xl border transition-colors shadow-sm ${
      isLight ? 'bg-white border-slate-200/90' : 'bg-slate-900/90 border-slate-800'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className={`text-base font-black tracking-tight ${isLight ? 'text-primary' : 'text-white'}`}>
            Cryptographic Batch Ingestion Logs
          </h3>
          <p className={`text-xs font-medium mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Permanent record of uploaded stock files and encryption verification
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search batch ref or serial..."
              className={`w-full rounded-xl pl-9 pr-4 py-1.5 text-xs font-semibold focus:outline-none transition-colors border ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-secondary focus:bg-white'
                  : 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-teal-500'
              }`}
            />
          </div>
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
              <th className="py-3 px-3">Remaining Unsold</th>
              <th className="py-3 px-3 text-right">Pool Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-medium ${
            isLight ? 'divide-slate-200/80' : 'divide-slate-800/50'
          }`}>
            {filteredBatches.map((batch) => (
              <tr key={batch.id} className={`transition-colors ${
                isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-950/50'
              }`}>
                <td className={`py-3.5 px-3 font-mono font-black flex items-center gap-2 ${
                  isLight ? 'text-secondary' : 'text-teal-400'
                }`}>
                  <FiFileText className="text-slate-400 shrink-0" /> {batch.id}
                </td>
                <td className={`py-3.5 px-3 font-bold ${isLight ? 'text-primary' : 'text-slate-200'}`}>
                  {batch.product}
                </td>
                <td className="py-3.5 px-3 text-slate-400 font-semibold">{batch.uploadDate}</td>
                <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">{batch.serialRange}</td>
                <td className={`py-3.5 px-3 font-black ${isLight ? 'text-primary' : 'text-white'}`}>
                  {batch.total.toLocaleString()}
                </td>
                <td className="py-3.5 px-3">
                  <span className={`font-black ${
                    batch.remaining === 0
                      ? 'text-rose-600 dark:text-rose-400'
                      : batch.remaining < 200
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}>
                    {batch.remaining.toLocaleString()}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <Badge
                    variant={
                      batch.status === 'ACTIVE' ? 'success' : batch.status === 'ACTIVE_LOW' ? 'warning' : 'neutral'
                    }
                    className="text-[10px] !px-2 font-bold shadow-2xs"
                  >
                    {batch.status === 'ACTIVE_LOW' ? 'LOW STOCK' : batch.status}
                  </Badge>
                </td>
              </tr>
            ))}
            {filteredBatches.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
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
