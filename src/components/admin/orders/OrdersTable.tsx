import React, { useState } from 'react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Pagination } from '../../ui/Pagination';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import type { Order } from './types';
import { formatCedi } from '../../../utils/formatters';
import { FiSend, FiSmartphone } from 'react-icons/fi';

interface OrdersTableProps {
  orders: Order[];
  onInspect: (order: Order) => void;
  onResendSMS: (order: Order) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onInspect, onResendSMS }) => {
  const { isLight } = useAdminTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getNetworkBadgeStyles = (network: string) => {
    switch (network) {
      case 'MTN MoMo':
        return 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30';
      case 'Telecel Cash':
        return 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30';
      case 'AirtelTigo':
        return 'bg-blue-500/15 text-blue-800 dark:text-blue-300 border-blue-500/30';
      default:
        return 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className={`p-6 rounded-3xl border transition-colors shadow-sm overflow-hidden ${
      isLight ? 'bg-white border-slate-200/90' : 'bg-slate-900/90 border-slate-800'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[11px] uppercase font-extrabold ${
              isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'
            }`}>
              <th className="py-3.5 px-4">Order Ref</th>
              <th className="py-3.5 px-4">Customer Account</th>
              <th className="py-3.5 px-4">Voucher Product</th>
              <th className="py-3.5 px-4">Gross Amount</th>
              <th className="py-3.5 px-4">Allocated Serial</th>
              <th className="py-3.5 px-4">Fulfillment Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-medium ${
            isLight ? 'divide-slate-200/80' : 'divide-slate-800/50'
          }`}>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((o) => (
                <tr key={o.id} className={`transition-colors ${
                  isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-950/50'
                }`}>
                  <td className={`py-4 px-4 font-mono font-black ${
                    isLight ? 'text-[#0F8B8D]' : 'text-teal-400'
                  }`}>
                    {o.id}
                    <span className="block font-sans text-[10px] font-semibold text-slate-400 mt-0.5">
                      {o.date}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 font-extrabold mb-1">
                      <FiSmartphone className="text-slate-400 w-3.5 h-3.5 shrink-0" />
                      <span className={isLight ? 'text-primary' : 'text-white'}>{o.phone}</span>
                    </div>
                    <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${getNetworkBadgeStyles(o.network)}`}>
                      {o.network}
                    </span>
                  </td>

                  <td className={`py-4 px-4 font-bold ${isLight ? 'text-primary' : 'text-slate-200'}`}>
                    {o.product}
                  </td>

                  <td className={`py-4 px-4 font-black text-sm ${isLight ? 'text-primary' : 'text-white'}`}>
                    {formatCedi(o.price)}
                  </td>

                  <td className="py-4 px-4 font-mono">
                    {o.serial.startsWith('W2') || o.serial.startsWith('B2') ? (
                      <span className={`font-bold px-2 py-1 rounded-lg border ${
                        isLight ? 'bg-slate-50 border-slate-200 text-secondary' : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}>
                        {o.serial}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-[11px] font-semibold">{o.serial}</span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <Badge
                      variant={o.status === 'FULFILLED' ? 'success' : o.status === 'PENDING_MOMO' ? 'warning' : 'error'}
                      className="text-[10px] !px-2.5 font-bold shadow-2xs inline-flex"
                    >
                      {o.status.replace('_', ' ')}
                    </Badge>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant={isLight ? 'outline' : 'secondary'}
                        size="sm"
                        onClick={() => onInspect(o)}
                        className="font-bold text-[11px] h-8 px-3"
                      >
                        Inspect
                      </Button>

                      {o.status === 'FULFILLED' && (
                        <button
                          type="button"
                          onClick={() => onResendSMS(o)}
                          title="Resend SMS Instructions"
                          className={`p-2 rounded-xl border transition-all shadow-2xs ${
                            isLight
                              ? 'bg-slate-50 border-slate-200 text-[#0F8B8D] hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700'
                              : 'bg-slate-800/80 border-slate-700 text-teal-400 hover:bg-slate-800 hover:text-teal-300'
                          }`}
                        >
                          <FiSend className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400 font-semibold">
                  No matching customer transactions found in current query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={orders.length}
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
