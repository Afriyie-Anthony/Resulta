import React, { useState } from 'react';
import { Badge } from '../../ui/Badge';
import { Pagination } from '../../ui/Pagination';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiSearch, FiCheckSquare, FiSmartphone, FiCopy, FiCheck } from 'react-icons/fi';

interface SoldItem {
  orderRef: string;
  serial: string;
  pinCode: string;
  product: string;
  customerPhone: string;
  channel: string;
  dispatchedAt: string;
  status: string;
}

const mockSoldVouchers: SoldItem[] = [
  { orderRef: 'ORD-88241', serial: '262100424896', pinCode: '7TTC5F7789F2', product: 'BECE 2026', customerPhone: '024****819', channel: 'USSD Checkout', dispatchedAt: '2 mins ago', status: 'SOLD' },
  { orderRef: 'ORD-88240', serial: 'WGR250672304', pinCode: '684781585973', product: 'WASSCE 2026', customerPhone: '050****412', channel: 'Web Portal', dispatchedAt: '5 mins ago', status: 'SOLD' },
  { orderRef: 'ORD-88239', serial: 'WGR250672212', pinCode: '682254328104', product: 'WASSCE 2026', customerPhone: '027****911', channel: 'USSD Checkout', dispatchedAt: '12 mins ago', status: 'SOLD' },
  { orderRef: 'ORD-88238', serial: 'W26001978', pinCode: '918237465012', product: 'WASSCE 2026', customerPhone: '024****331', channel: 'USSD Checkout', dispatchedAt: '18 mins ago', status: 'SOLD' },
  { orderRef: 'ORD-88237', serial: 'B26000969', pinCode: '409182736451', product: 'BECE 2026', customerPhone: '054****721', channel: 'USSD Checkout', dispatchedAt: '24 mins ago', status: 'SOLD' },
  { orderRef: 'ORD-88236', serial: 'W26001977', pinCode: '883920194821', product: 'WASSCE 2026', customerPhone: '020****119', channel: 'Web Portal', dispatchedAt: '35 mins ago', status: 'SOLD' },
];

interface SoldVouchersTableProps {
  initialFilter?: string;
}

export const SoldVouchersTable: React.FC<SoldVouchersTableProps> = ({ initialFilter }) => {
  const { isLight } = useAdminTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [copiedPin, setCopiedPin] = useState<string | null>(null);
  const [productFilter, setProductFilter] = useState(
    initialFilter && (initialFilter.includes('WASSCE') || initialFilter.includes('BECE'))
      ? initialFilter.includes('WASSCE') ? 'WASSCE' : 'BECE'
      : 'ALL'
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredSold = mockSoldVouchers.filter((item) => {
    const matchesSearch =
      item.orderRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pinCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerPhone.includes(searchQuery);
    
    if (!matchesSearch) return false;
    if (channelFilter !== 'ALL' && !item.channel.includes(channelFilter)) return false;
    if (productFilter !== 'ALL' && !item.product.includes(productFilter)) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredSold.length / itemsPerPage);
  const paginatedSold = filteredSold.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleProductFilterChange = (filter: string) => {
    setProductFilter(filter);
    setCurrentPage(1);
  };

  const handleChannelFilterChange = (filter: string) => {
    setChannelFilter(filter);
    setCurrentPage(1);
  };

  const handleCopyPin = (pin: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedPin(pin);
    setTimeout(() => setCopiedPin(null), 2000);
  };

  return (
    <div className={`p-4 sm:p-5 rounded-3xl border transition-colors shadow-sm ${
      isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
    }`}>
      {/* Header: Title + Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className={`text-base font-black tracking-tight flex items-center gap-2 ${
            isLight ? 'text-slate-950' : 'text-white'
          }`}>
            <FiCheckSquare className="text-emerald-600 dark:text-emerald-400" /> Sold & Dispatched Voucher Logs
          </h3>
          <p className={`text-xs font-semibold mt-0.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Immutable delivery audit trail connecting fulfilled checkout orders to assigned voucher serial numbers and PIN codes
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-72 shrink-0">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search order ref, serial, PIN or phone..."
            className={`w-full rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none transition-colors border ${
              isLight
                ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D] focus:bg-white'
                : 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-teal-500'
            }`}
          />
        </div>
      </div>

      {/* Control Toolbar: Filter Segmented Groups */}
      <div className={`p-2.5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 ${
        isLight ? 'bg-slate-100/90 border-slate-300' : 'bg-slate-950/40 border-slate-800/70'
      }`}>
        <div className="flex flex-wrap items-center gap-3">
          {/* Exam Filter Segment */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>Exam:</span>
            <div className={`inline-flex p-1 rounded-xl border ${
              isLight ? 'bg-white border-slate-300 shadow-2xs' : 'bg-slate-900 border-slate-800'
            }`}>
              {['ALL', 'WASSCE', 'BECE'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleProductFilterChange(filter)}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold transition-all ${
                    productFilter === filter
                      ? isLight
                        ? 'bg-[#0F8B8D] text-white shadow-2xs'
                        : 'bg-teal-500 text-slate-950 font-black shadow-2xs'
                      : isLight
                      ? 'text-slate-800 hover:text-slate-950 hover:bg-slate-100 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {filter === 'ALL' ? 'All' : filter}
                </button>
              ))}
            </div>
          </div>

          {/* Channel Filter Segment */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>Channel:</span>
            <div className={`inline-flex p-1 rounded-xl border ${
              isLight ? 'bg-white border-slate-300 shadow-2xs' : 'bg-slate-900 border-slate-800'
            }`}>
              {['ALL', 'USSD', 'Web'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleChannelFilterChange(filter)}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold transition-all ${
                    channelFilter === filter
                      ? isLight
                        ? 'bg-[#0F8B8D] text-white shadow-2xs'
                        : 'bg-teal-500 text-slate-950 font-black shadow-2xs'
                      : isLight
                      ? 'text-slate-800 hover:text-slate-950 hover:bg-slate-100 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {filter === 'ALL' ? 'All' : filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Counter badge */}
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 text-[11px] font-black rounded-lg border transition-colors ${
            isLight
              ? 'bg-white border-slate-300 text-slate-900 shadow-2xs'
              : 'bg-slate-800 border-slate-700 text-slate-100'
          }`}>
            {filteredSold.length} {filteredSold.length === 1 ? 'Record' : 'Records'}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[11px] uppercase font-black ${
              isLight ? 'border-slate-300 bg-slate-100/90 text-slate-700' : 'border-slate-800 text-slate-400'
            }`}>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Order Ref</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Serial Number</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">PIN Code</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Exam Product</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Customer Phone</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Dispatch Time</th>
              <th className="py-2.5 px-3.5 text-right whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-semibold ${
            isLight ? 'divide-slate-200' : 'divide-slate-800/50'
          }`}>
            {paginatedSold.map((item, idx) => (
              <tr key={idx} className={`transition-colors ${
                isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-950/50'
              }`}>
                <td className={`py-2.5 px-3.5 whitespace-nowrap font-mono font-black ${
                  isLight ? 'text-[#0B2545]' : 'text-teal-400'
                }`}>
                  {item.orderRef}
                </td>
                <td className={`py-2.5 px-3.5 whitespace-nowrap font-mono font-bold text-xs ${
                  isLight ? 'text-[#0F8B8D]' : 'text-teal-400'
                }`}>
                  {item.serial}
                </td>
                <td className="py-2.5 px-3.5 whitespace-nowrap font-mono font-black">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-lg text-[11px] font-black border ${
                      isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-950'
                        : 'bg-slate-950 border-slate-800 text-white'
                    }`}>
                      {item.pinCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyPin(item.pinCode)}
                      title="Copy PIN Code"
                      className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      {copiedPin === item.pinCode ? <FiCheck className="w-3.5 h-3.5 text-emerald-600" /> : <FiCopy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </td>
                <td className={`py-2.5 px-3.5 whitespace-nowrap font-black ${isLight ? 'text-slate-950' : 'text-slate-200'}`}>
                  {item.product}
                </td>
                <td className={`py-2.5 px-3.5 whitespace-nowrap font-mono font-black ${isLight ? 'text-slate-950' : 'text-slate-300'}`}>
                  <div className="flex items-center gap-1.5">
                    <FiSmartphone className="text-[#0F8B8D] dark:text-teal-400 w-3.5 h-3.5" />
                    {item.customerPhone}
                  </div>
                </td>
                <td className={`py-2.5 px-3.5 whitespace-nowrap font-bold text-xs ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                  {item.dispatchedAt}
                </td>
                <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                  <Badge variant="success" className="text-[10px] font-black uppercase !px-2.5 py-0.5 shadow-2xs">
                    {item.status}
                  </Badge>
                </td>
              </tr>
            ))}
            {filteredSold.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 font-semibold">
                  No dispatched vouchers match search query "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={`mt-3 pt-3 border-t ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredSold.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newSize) => {
            setItemsPerPage(newSize);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
};
