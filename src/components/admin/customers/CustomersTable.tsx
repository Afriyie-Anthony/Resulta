import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
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
        isLight ? 'bg-white border-slate-300 text-slate-600' : 'bg-slate-900 border-slate-800 text-slate-400'
      }`}>
        <p className="text-sm font-black mb-1">No matching customers found</p>
        <p className="text-xs font-semibold">Try adjusting your search criteria.</p>
      </div>
    );
  }

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
              <th className="py-2.5 px-3.5 whitespace-nowrap">Customer Account</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Phone Number</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Account Status</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Total Orders</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Lifetime Value</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Last Active</th>
              <th className="py-2.5 px-3.5 text-right whitespace-nowrap">Operations</th>
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
                  <td className="py-2.5 px-3.5 whitespace-nowrap font-mono font-black text-xs">
                    <span className={isLight ? 'text-[#0B2545]' : 'text-teal-400'}>
                      {cust.id}
                    </span>
                    <span className={`block font-sans text-[10px] font-extrabold mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Registered {cust.registeredDate}
                    </span>
                  </td>

                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-black text-sm">
                      <FiSmartphone className="text-[#0F8B8D] dark:text-teal-400 w-4 h-4 shrink-0" />
                      <span className={isLight ? 'text-slate-950' : 'text-white'}>{cust.phone}</span>
                    </div>
                  </td>

                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                    {isVip ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30">
                        <FiAward className="w-3.5 h-3.5 text-amber-600 shrink-0" /> VIP Buyer
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                        <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Verified
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-3.5 whitespace-nowrap font-black">
                    <span className={isLight ? 'text-slate-950' : 'text-slate-200'}>
                      {cust.totalOrders} {cust.totalOrders === 1 ? 'Voucher' : 'Vouchers'}
                    </span>
                  </td>

                  <td className="py-2.5 px-3.5 whitespace-nowrap font-black text-sm text-emerald-700 dark:text-emerald-400">
                    {formatCedi(cust.spent)}
                  </td>

                  <td className={`py-2.5 px-3.5 whitespace-nowrap font-bold text-xs ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    {cust.lastActive}
                  </td>

                  <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onInspectCustomer(cust)}
                        title="View Customer Profile"
                        className={`p-2 rounded-xl border transition-all shadow-2xs ${
                          isLight
                            ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200 hover:text-slate-950'
                            : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <FiEye className="w-4 h-4 text-[#0F8B8D] dark:text-teal-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onSendSMS(cust)}
                        title={`Dispatch direct SMS to ${cust.phone}`}
                        className={`p-2 rounded-xl border transition-all shadow-2xs ${
                          isLight
                            ? 'bg-slate-100 border-slate-300 text-[#0F8B8D] hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700'
                            : 'bg-slate-800/80 border-slate-700 text-teal-400 hover:bg-slate-800 hover:text-teal-300'
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

      <div className={`px-6 py-3 border-t ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
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
