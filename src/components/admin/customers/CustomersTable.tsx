import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../ui/Button';
import { Pagination } from '../../ui/Pagination';
import type { Customer } from './types';
import { formatCedi } from '../../../utils/formatters';
import { FiSmartphone, FiMessageSquare, FiEye, FiAward, FiCheckCircle } from 'react-icons/fi';

interface CustomersTableProps {
  customers: Customer[];
  onInspectCustomer: (customer: Customer) => void;
  onSendSMS: (customer: Customer) => void;
}

export const CustomersTable: React.FC<CustomersTableProps> = ({
  customers,
  onInspectCustomer,
  onSendSMS
}) => {
  const { isLight } = useAdminTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const paginatedCustomers = customers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (customers.length === 0) {
    return (
      <div className={`p-12 text-center rounded-3xl border transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-400' : 'bg-slate-900 border-slate-800 text-slate-500'
      }`}>
        <p className="text-sm font-extrabold mb-1">No matching customers found</p>
        <p className="text-xs font-medium">Try loosening your keyword search or filter constraints.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border overflow-hidden transition-colors ${
      isLight ? 'bg-white border-slate-300 shadow-md' : 'bg-slate-900/90 border-slate-800 shadow-xl'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[11px] uppercase font-black ${
              isLight ? 'border-slate-300 bg-slate-100/80 text-slate-700' : 'border-slate-800 bg-slate-950/50 text-slate-400'
            }`}>
              <th className="py-3.5 px-5">Customer Account</th>
              <th className="py-3.5 px-4">MoMo Phone</th>
              <th className="py-3.5 px-4">Carrier</th>
              <th className="py-3.5 px-4">Account Status</th>
              <th className="py-3.5 px-4">Total Orders</th>
              <th className="py-3.5 px-4">Lifetime Value</th>
              <th className="py-3.5 px-4">Last Active</th>
              <th className="py-3.5 px-5 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-semibold ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
            {paginatedCustomers.map((cust) => {
              const isVip = cust.status === 'VIP BUYER';
              return (
                <tr
                  key={cust.id}
                  className={`transition-colors ${
                    isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-950/40'
                  }`}
                >
                  <td className="py-4 px-5 font-mono font-black text-xs">
                    <span className={isLight ? 'text-[#0B2545]' : 'text-teal-400'}>
                      {cust.id}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 font-black text-xs">
                      <FiSmartphone className={isLight ? 'text-[#0F8B8D]' : 'text-teal-400'} />
                      <span className={isLight ? 'text-slate-950' : 'text-white'}>{cust.phone}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${cust.netColor}`}>
                      {cust.network}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    {isVip ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30">
                        <FiAward className="w-3 h-3 text-amber-600 shrink-0" /> VIP Buyer
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                        <FiCheckCircle className="w-3 h-3 text-emerald-600 shrink-0" /> Verified
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 font-black">
                    <span className={isLight ? 'text-slate-900' : 'text-slate-200'}>
                      {cust.totalOrders} {cust.totalOrders === 1 ? 'Voucher' : 'Vouchers'}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-black text-emerald-700 dark:text-emerald-400">
                    {formatCedi(cust.spent)}
                  </td>

                  <td className={`py-4 px-4 font-bold text-xs ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    {cust.lastActive}
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant={isLight ? 'outline' : 'secondary'}
                        size="sm"
                        leftIcon={<FiEye className="w-3.5 h-3.5" />}
                        onClick={() => onInspectCustomer(cust)}
                        className="font-black text-xs"
                      >
                        Inspect
                      </Button>

                      <button
                        type="button"
                        onClick={() => onSendSMS(cust)}
                        title={`Dispatch direct SMS to ${cust.phone}`}
                        className={`p-2.5 rounded-xl border transition-all ${
                          isLight
                            ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-[#0F8B8D] hover:text-white hover:border-[#0F8B8D]'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-teal-500 hover:text-slate-950 hover:border-teal-500'
                        }`}
                      >
                        <FiMessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 pb-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={customers.length}
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
