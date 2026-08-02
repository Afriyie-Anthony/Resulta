import React, { useState } from 'react';
import { Badge } from '../../ui/Badge';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiSearch, FiCheckSquare, FiSmartphone, FiExternalLink } from 'react-icons/fi';

interface SoldItem {
  orderRef: string;
  serial: string;
  product: string;
  customerPhone: string;
  channel: string;
  dispatchedAt: string;
  amount: string;
}

const mockSoldVouchers: SoldItem[] = [
  { orderRef: 'ORD-88241', serial: 'W26001980', product: 'WASSCE 2026', customerPhone: '024****819', channel: 'USSD (MTN MoMo)', dispatchedAt: '2 mins ago', amount: 'GH₵ 25.00' },
  { orderRef: 'ORD-88240', serial: 'W26001979', product: 'WASSCE 2026', customerPhone: '050****412', channel: 'Web (Telecel Cash)', dispatchedAt: '5 mins ago', amount: 'GH₵ 25.00' },
  { orderRef: 'ORD-88239', serial: 'B26000970', product: 'BECE 2026', customerPhone: '027****911', channel: 'USSD (AirtelTigo)', dispatchedAt: '12 mins ago', amount: 'GH₵ 20.00' },
  { orderRef: 'ORD-88238', serial: 'W26001978', product: 'WASSCE 2026', customerPhone: '024****331', channel: 'USSD (MTN MoMo)', dispatchedAt: '18 mins ago', amount: 'GH₵ 25.00' },
  { orderRef: 'ORD-88237', serial: 'B26000969', product: 'BECE 2026', customerPhone: '054****721', channel: 'USSD (MTN MoMo)', dispatchedAt: '24 mins ago', amount: 'GH₵ 20.00' },
  { orderRef: 'ORD-88236', serial: 'W26001977', product: 'WASSCE 2026', customerPhone: '020****119', channel: 'Web (Card Payment)', dispatchedAt: '35 mins ago', amount: 'GH₵ 25.00' },
];

export const SoldVouchersTable: React.FC = () => {
  const { isLight } = useAdminTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL');

  const filteredSold = mockSoldVouchers.filter((item) => {
    const matchesSearch =
      item.orderRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerPhone.includes(searchQuery);
    
    if (!matchesSearch) return false;
    if (channelFilter !== 'ALL' && !item.channel.includes(channelFilter)) return false;
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
            <FiCheckSquare className="text-emerald-600 dark:text-emerald-400" /> Sold & Dispatched Voucher Logs
          </h3>
          <p className={`text-xs font-medium mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Immutable delivery audit trail connecting fulfilled checkout orders to assigned voucher serial numbers
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-1.5">
            {['ALL', 'USSD', 'Web'].map((filter) => (
              <button
                key={filter}
                onClick={() => setChannelFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all border ${
                  channelFilter === filter
                    ? isLight
                      ? 'bg-[#0F8B8D] text-white border-[#0F8B8D]'
                      : 'bg-teal-500 text-slate-950 border-teal-400 font-black'
                    : isLight
                    ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {filter === 'ALL' ? 'ALL CHANNELS' : filter}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order ref or phone..."
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
              <th className="py-3 px-3">Order Ref</th>
              <th className="py-3 px-3">Dispatched Serial</th>
              <th className="py-3 px-3">Examination Product</th>
              <th className="py-3 px-3">Customer Phone</th>
              <th className="py-3 px-3">Purchase Channel</th>
              <th className="py-3 px-3">Amount Paid</th>
              <th className="py-3 px-3 text-right">Delivery Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-medium ${
            isLight ? 'divide-slate-200/80' : 'divide-slate-800/50'
          }`}>
            {filteredSold.map((item) => (
              <tr key={item.orderRef} className={`transition-colors ${
                isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-950/50'
              }`}>
                <td className="py-3.5 px-3 font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FiExternalLink className="opacity-70" /> {item.orderRef}
                </td>
                <td className={`py-3.5 px-3 font-mono font-black ${
                  isLight ? 'text-secondary' : 'text-teal-400'
                }`}>
                  {item.serial}
                </td>
                <td className={`py-3.5 px-3 font-bold ${isLight ? 'text-primary' : 'text-white'}`}>
                  {item.product}
                </td>
                <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <FiSmartphone className="text-slate-400" /> {item.customerPhone}
                </td>
                <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 font-semibold">{item.channel}</td>
                <td className={`py-3.5 px-3 font-black ${isLight ? 'text-primary' : 'text-emerald-400'}`}>
                  {item.amount}
                </td>
                <td className="py-3.5 px-3 text-right">
                  <Badge variant="success" className="text-[10px] !px-2.5 font-bold shadow-2xs">
                    FULFILLED & SENT
                  </Badge>
                </td>
              </tr>
            ))}
            {filteredSold.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                  No fulfilled vouchers found matching "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
