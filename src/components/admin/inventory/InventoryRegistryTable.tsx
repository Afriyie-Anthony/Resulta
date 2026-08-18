import React, { useState } from 'react';
import { Badge } from '../../ui/Badge';
import { Pagination } from '../../ui/Pagination';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { useToast } from '../../ui/Toast';
import { FiSearch, FiDatabase, FiLock, FiCheckCircle, FiTrash2, FiAlertTriangle } from 'react-icons/fi';

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
  const { addToast } = useToast();
  const [items, setItems] = useState<RegistryItem[]>(mockRegistryItems);
  const [deletingItem, setDeletingItem] = useState<RegistryItem | null>(null);

  const [searchQuery, setSearchQuery] = useState(
    initialFilter && initialFilter.startsWith('BATCH-') ? initialFilter : ''
  );
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>(
    initialFilter && (initialFilter.includes('WASSCE') || initialFilter.includes('BECE'))
      ? initialFilter.includes('WASSCE') ? 'WASSCE' : 'BECE'
      : 'ALL'
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batchRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hashSignature.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (selectedProductFilter !== 'ALL' && !item.product.includes(selectedProductFilter)) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedProductFilter(filter);
    setCurrentPage(1);
  };

  const confirmDeleteVoucher = () => {
    if (!deletingItem) return;
    setItems((prev) => prev.filter((i) => i.serial !== deletingItem.serial));
    addToast({
      title: 'Voucher Purged',
      message: `Uploaded voucher serial ${deletingItem.serial} has been permanently removed from inventory stock.`,
      type: 'success',
    });
    setDeletingItem(null);
  };

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
          <p className={`text-xs font-semibold mt-0.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Live audit table of unassigned voucher serial numbers and cryptographic storage signatures
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-1.5">
            {['ALL', 'WASSCE', 'BECE'].map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all border ${
                  selectedProductFilter === filter
                    ? isLight
                      ? 'bg-[#0F8B8D] text-white border-[#0F8B8D] shadow-xs font-black'
                      : 'bg-teal-500 text-slate-950 border-teal-400 font-black shadow-xs'
                    : isLight
                    ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 font-extrabold shadow-2xs'
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
              onChange={handleSearchChange}
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
            <tr className={`border-b text-[11px] uppercase font-black ${
              isLight ? 'border-slate-300 text-slate-700' : 'border-slate-800 text-slate-400'
            }`}>
              <th className="py-3 px-3">Serial Number</th>
              <th className="py-3 px-3">Exam Product</th>
              <th className="py-3 px-3">Origin Batch</th>
              <th className="py-3 px-3">Cryptographic Signature (At-Rest)</th>
              <th className="py-3 px-3">Ingestion Date</th>
              <th className="py-3 px-3">Pool Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-semibold ${
            isLight ? 'divide-slate-200' : 'divide-slate-800/50'
          }`}>
            {paginatedItems.map((item) => (
              <tr key={item.serial} className={`transition-colors ${
                isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-950/50'
              }`}>
                <td className={`py-3.5 px-3 font-mono font-bold text-xs ${
                  isLight ? 'text-[#0F8B8D]' : 'text-teal-400'
                }`}>
                  {item.serial}
                </td>
                <td className={`py-3.5 px-3 font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {item.product}
                </td>
                <td className={`py-3.5 px-3 font-mono text-[11px] font-bold ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>
                  {item.batchRef}
                </td>
                <td className={`py-3.5 px-3 font-mono text-[11px] font-bold flex items-center gap-1.5 ${
                  isLight ? 'text-slate-700' : 'text-slate-400'
                }`}>
                  <FiLock className="text-emerald-600 dark:text-teal-400 shrink-0" /> {item.hashSignature}
                </td>
                <td className={`py-3.5 px-3 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>{item.ingestedDate}</td>
                <td className="py-3.5 px-3">
                  <Badge
                    variant={item.status === 'READY' ? 'success' : 'warning'}
                    className="text-[10px] !px-2 font-bold shadow-2xs inline-flex items-center gap-1"
                  >
                    {item.status === 'READY' ? <FiCheckCircle /> : null}
                    {item.status === 'READY' ? 'AVAILABLE' : 'RESERVED'}
                  </Badge>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => setDeletingItem(item)}
                    title="Delete uploaded voucher"
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                  No inventory serial numbers found matching "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredItems.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(newSize) => {
          setItemsPerPage(newSize);
          setCurrentPage(1);
        }}
      />

      {/* Delete Voucher Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className={`w-full max-w-md p-6 rounded-3xl shadow-xl border transition-all ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-3">
              <div className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-950/50">
                <FiAlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black">Delete Uploaded Voucher?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Action cannot be undone</p>
              </div>
            </div>

            <p className={`text-xs font-semibold mb-4 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Are you sure you want to purge voucher serial <strong className="font-mono text-rose-600 dark:text-rose-400">{deletingItem.serial}</strong> ({deletingItem.product}) from batch <strong className="font-mono">{deletingItem.batchRef}</strong>?
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteVoucher}
                className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors flex items-center gap-1.5"
              >
                <FiTrash2 className="w-3.5 h-3.5" /> Purge Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
