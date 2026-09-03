import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Pagination } from '../../ui/Pagination';
import type { Customer, PaginationMeta } from './types';
import { formatCedi } from '../../../utils/formatters';
import { FiSmartphone, FiEye, FiAward, FiCheckCircle } from 'react-icons/fi';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface CustomersTableProps {
  customers: Customer[];
  meta?: PaginationMeta;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onInspectCustomer: (phoneNumber: string) => void;
}

const TableSkeleton: React.FC<{ isLight: boolean }> = ({ isLight }) => (
  <div className={`p-12 text-center rounded-3xl border transition-colors ${
    isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
  }`}>
    <div className={`h-8 w-8 mx-auto rounded-full animate-pulse mb-3 ${isLight ? 'bg-slate-200' : 'bg-slate-700'}`} />
    <p className={`text-sm font-black mb-1 animate-pulse ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Loading directory...</p>
  </div>
);

export const CustomersTable: React.FC<CustomersTableProps> = ({
  customers,
  meta,
  isLoading,
  onPageChange,
  onInspectCustomer,
}) => {
  const { isLight } = useAdminTheme();

  if (isLoading) {
    return <TableSkeleton isLight={isLight} />;
  }

  if (!customers || customers.length === 0) {
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
              <th className="py-2.5 px-3.5 whitespace-nowrap">Customer Phone</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Customer Tier</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Total Orders</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Lifetime Value</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Last Active</th>
              <th className="py-2.5 px-3.5 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-semibold ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
            {customers.map((cust) => {
              const isVip = cust.segment === 'VIP';
              const lastActiveText = cust.lastOrderAt ? formatDistanceToNow(parseISO(cust.lastOrderAt), { addSuffix: true }) : 'Never';

              return (
                <tr
                  key={cust.phoneNumber}
                  className={`transition-colors ${
                    isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-950/40'
                  }`}
                >
                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 font-black text-sm">
                        <FiSmartphone className="text-[#0F8B8D] dark:text-teal-400 w-4 h-4 shrink-0" />
                        <span className={isLight ? 'text-slate-950' : 'text-white'}>{cust.phoneNumber}</span>
                      </div>
                      {cust.fullName && (
                        <span className={`text-[10px] font-extrabold mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          {cust.fullName}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                    {isVip ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30">
                        <FiAward className="w-3.5 h-3.5 text-amber-600 shrink-0" /> VIP Buyer
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                        <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {cust.segment}
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-3.5 whitespace-nowrap font-black">
                    <span className={isLight ? 'text-slate-950' : 'text-slate-200'}>
                      {cust.totalVouchersPurchased} {cust.totalVouchersPurchased === 1 ? 'Voucher' : 'Vouchers'}
                    </span>
                    <span className={`block text-[10px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                      Across {cust.totalOrders} orders
                    </span>
                  </td>

                  <td className="py-2.5 px-3.5 whitespace-nowrap font-black text-sm text-emerald-700 dark:text-emerald-400">
                    {formatCedi(cust.totalSpent)}
                  </td>

                  <td className={`py-2.5 px-3.5 whitespace-nowrap font-bold text-xs ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    {lastActiveText}
                  </td>

                  <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onInspectCustomer(cust.phoneNumber)}
                      title="View Customer Profile"
                      className={`p-2 rounded-xl border transition-all shadow-2xs ${
                        isLight
                          ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200 hover:text-slate-950'
                          : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <FiEye className="w-4 h-4 text-[#0F8B8D] dark:text-teal-400" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className={`px-6 py-3 border-t ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            totalItems={meta.total}
            itemsPerPage={meta.limit}
            onPageChange={onPageChange}
            onItemsPerPageChange={() => {}} // Remove if backend doesn't support changing limit easily or handle it in parent
          />
        </div>
      )}
    </div>
  );
};
