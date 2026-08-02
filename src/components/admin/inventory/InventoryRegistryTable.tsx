import React, { useState } from 'react';
import { Badge } from '../../ui/Badge';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiSearch, FiDatabase, FiLock, FiCheckCircle } from 'react-icons/fi';

interface RegistryItem {
  serial: string;
  product: string;
  batchRef: string;
  hashSignature: string;
  ingestedDate: string;
  status: 'READY' | 'RESERVED';
}

const mockRegistryItems: RegistryItem[] = [
  { serial: 'W26001994', product: 'WASSCE 2026', batchRef: 'BATCH-2026-W09', hashSignature: 'SHA256: 8f9a2e4b11c0...', ingestedDate: '2026-07-28', status: 'READY' },
  { serial: 'W26001995', product: 'WASSCE 2026', batchRef: 'BATCH-2026-W09', hashSignature: 'SHA256: 3a7c9d2f88b1...', ingestedDate: '2026-07-28', status: 'READY' },
  { serial: 'W26001996', product: 'WASSCE 2026', batchRef: 'BATCH-2026-W09', hashSignature: 'SHA256: 5e2d1f4a99d3...', ingestedDate: '2026-07-28', status: 'RESERVED' },
  { serial: 'W26001997', product: 'WASSCE 2026', batchRef: 'BATCH-2026-W09', hashSignature: 'SHA256: 1c8b7e6f44a2...', ingestedDate: '2026-07-28', status: 'READY' },
  { serial: 'B26000981', product: 'BECE 2026', batchRef: 'BATCH-2026-B04', hashSignature: 'SHA256: 9f4e2b8c77d1...', ingestedDate: '2026-07-20', status: 'READY' },
  { serial: 'B26000982', product: 'BECE 2026', batchRef: 'BATCH-2026-B04', hashSignature: 'SHA256: 6a1b2c3d4e5f...', ingestedDate: '2026-07-20', status: 'READY' },
  { serial: 'B26000983', product: 'BECE 2026', batchRef: 'BATCH-2026-B04', hashSignature: 'SHA256: 2d3e4f5a6b7c...', ingestedDate: '2026-07-20', status: 'RESERVED' },
];

interface InventoryRegistryTableProps {
  initialFilter?: string;
}

export const InventoryRegistryTable: React.FC<InventoryRegistryTableProps> = ({ initialFilter }) => {
  const { isLight } = useAdminTheme();
  const [searchQuery, setSearchQuery] = useState(
    initialFilter && initialFilter.startsWith('BATCH-') ? initialFilter : ''
  );
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>(
    initialFilter && (initialFilter.includes('WASSCE') || initialFilter.includes('BECE'))
      ? initialFilter.includes('WASSCE') ? 'WASSCE' : 'BECE'
      : 'ALL'
  );

  const filteredItems = mockRegistryItems.filter((item) => {
    const matchesSearch =
      item.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batchRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hashSignature.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (selectedProductFilter !== 'ALL' && !item.product.includes(selectedProductFilter)) return false;
    return true;
  });

  return (
    <div className={`p-6 rounded-3xl border transition-colors shadow-sm ${
      isLight ? 'bg-white border-slate-200/90' : 'bg-slate-900/90 border-slate-800'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className={`text-base font-black tracking-tight flex items-center gap-2 ${
            isLight ? 'text-primary' : 'text-white'
          }`}>
            <FiDatabase className="text-[#0F8B8D] dark:text-teal-400" /> Active Inventory Serial Registry
          </h3>
          <p className={`text-xs font-medium mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Live audit table of unassigned voucher serial numbers and cryptographic storage signatures
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-1.5">
            {['ALL', 'WASSCE', 'BECE'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedProductFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all border ${
                  selectedProductFilter === filter
                    ? isLight
                      ? 'bg-[#0F8B8D] text-white border-[#0F8B8D]'
                      : 'bg-teal-500 text-slate-950 border-teal-400 font-black'
                    : isLight
                    ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {filter === 'ALL' ? 'ALL POOLS' : `${filter} ONLY`}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search serial number or batch..."
              className={`w-full rounded-xl pl-9 pr-4 py-1.5 text-xs font-semibold focus:outline-none transition-colors border ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D] focus:bg-white'
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
              <th className="py-3 px-3">Serial Number</th>
              <th className="py-3 px-3">Exam Product</th>
              <th className="py-3 px-3">Origin Batch</th>
              <th className="py-3 px-3">Cryptographic Signature (At-Rest)</th>
              <th className="py-3 px-3">Ingestion Date</th>
              <th className="py-3 px-3 text-right">Pool Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-medium ${
            isLight ? 'divide-slate-200/80' : 'divide-slate-800/50'
          }`}>
            {filteredItems.map((item) => (
              <tr key={item.serial} className={`transition-colors ${
                isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-950/50'
              }`}>
                <td className={`py-3.5 px-3 font-mono font-black ${
                  isLight ? 'text-secondary' : 'text-teal-400'
                }`}>
                  {item.serial}
                </td>
                <td className={`py-3.5 px-3 font-bold ${isLight ? 'text-primary' : 'text-white'}`}>
                  {item.product}
                </td>
                <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400 font-semibold">
                  {item.batchRef}
                </td>
                <td className="py-3.5 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FiLock className="text-emerald-600 dark:text-teal-400 shrink-0" /> {item.hashSignature}
                </td>
                <td className="py-3.5 px-3 text-slate-400">{item.ingestedDate}</td>
                <td className="py-3.5 px-3 text-right">
                  <Badge
                    variant={item.status === 'READY' ? 'success' : 'warning'}
                    className="text-[10px] !px-2 font-bold shadow-2xs inline-flex items-center gap-1"
                  >
                    {item.status === 'READY' ? <FiCheckCircle /> : null}
                    {item.status === 'READY' ? 'AVAILABLE' : 'RESERVED'}
                  </Badge>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                  No inventory serial numbers found matching "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
