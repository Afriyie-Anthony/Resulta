import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Badge } from '../../ui/Badge';
import { Pagination } from '../../ui/Pagination';
import type { Order } from './types';
import { formatCedi } from '../../../utils/formatters';
import { FiSend, FiSmartphone, FiEye } from 'react-icons/fi';

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

  return (
    <div className={`rounded-3xl border overflow-hidden transition-colors ${
      isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/90 border-slate-800 shadow-xl'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[11px] uppercase font-black ${
              isLight ? 'border-slate-300 bg-slate-100/90 text-slate-700' : 'border-slate-800 bg-slate-950/50 text-slate-400'
            }`}>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Order Ref</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Customer Phone</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Exam Product</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Amount Paid</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Serial Assigned</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Order Status</th>
              <th className="py-2.5 px-3.5 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-semibold ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((o) => (
                <tr key={o.id} className={`transition-colors ${
                  isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-950/50'
                }`}>
                  <td className={`py-2.5 px-3.5 whitespace-nowrap font-mono font-black text-xs ${
                    isLight ? 'text-[#0B2545]' : 'text-teal-400'
                  }`}>
                    {o.id}
                    <span className={`block font-sans text-[10px] font-bold mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {o.date}
                    </span>
                  </td>

                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-black text-sm">
                      <FiSmartphone className="text-[#0F8B8D] dark:text-teal-400 w-4 h-4 shrink-0" />
                      <span className={isLight ? 'text-slate-950' : 'text-white'}>{o.phone}</span>
                    </div>
                  </td>

                  <td className={`py-2.5 px-3.5 whitespace-nowrap font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                    {o.product}
                  </td>

                  <td className={`py-2.5 px-3.5 whitespace-nowrap font-black text-sm ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    {formatCedi(o.price)}
                  </td>

                  <td className="py-2.5 px-3.5 whitespace-nowrap font-mono">
                    {o.serial.startsWith('W2') || o.serial.startsWith('B2') ? (
                      <span className={`font-black text-xs ${
                        isLight ? 'text-[#0F8B8D]' : 'text-teal-400'
                      }`}>
                        {o.serial}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic text-[11px] font-semibold">{o.serial}</span>
                    )}
                  </td>

                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                    <Badge
                      variant={o.status === 'FULFILLED' ? 'success' : o.status === 'PENDING_MOMO' ? 'warning' : 'error'}
                      className="text-[10px] !px-2.5 font-bold shadow-2xs inline-flex"
                    >
                      {o.status.replace('_', ' ')}
                    </Badge>
                  </td>

                  <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onInspect(o)}
                        title="View Order Details"
                        className={`p-2 rounded-xl border transition-all shadow-2xs ${
                          isLight
                            ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200 hover:text-slate-950'
                            : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <FiEye className="w-4 h-4 text-[#0F8B8D] dark:text-teal-400" />
                      </button>

                      {o.status === 'FULFILLED' && (
                        <button
                          type="button"
                          onClick={() => onResendSMS(o)}
                          title="Resend SMS Instructions"
                          className={`p-2 rounded-xl border transition-all shadow-2xs ${
                            isLight
                              ? 'bg-slate-100 border-slate-300 text-[#0F8B8D] hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700'
                              : 'bg-slate-800/80 border-slate-700 text-teal-400 hover:bg-slate-800 hover:text-teal-300'
                          }`}
                        >
                          <FiSend className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-500 font-semibold">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={`px-6 py-3 border-t ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
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
    </div>
  );
};
