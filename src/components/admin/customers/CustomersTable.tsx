import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../ui/Button';
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
      isLight ? 'bg-white border-slate-200/90 shadow-md' : 'bg-slate-900/90 border-slate-800 shadow-xl'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[11px] uppercase font-extrabold ${
              isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-slate-800 bg-slate-950/50 text-slate-400'
            }`}>
              <th className="py-3.5 px-5">Customer Account</th>
              <th className="py-3.5 px-4">MoMo Phone</th>
              <th className="py-3.5 px-4">Carrier</th>
              <th className="py-3.5 px-4">Account Status</th>
              <th className="py-3.5 px-4">Total Orders</th>
              <th className="py-3.5 px-4">Lifetime Value</th>
              <th className="py-3.5 px-4">Last Seen</th>
              <th className="py-3.5 px-5 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-medium ${isLight ? 'divide-slate-200/80' : 'divide-slate-800/60'}`}>
            {customers.map((cust) => {
              const isVip = cust.status === 'VIP BUYER';
              return (
                <tr
                  key={cust.id}
                  className={`transition-colors ${
                    isLight ? 'hover:bg-slate-50/80' : 'hover:bg-slate-950/40'
                  }`}
                >
                  <td className="py-4 px-5 font-mono font-black text-xs">
                    <span className={isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}>
                      {cust.id}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 font-black text-xs">
                      <FiSmartphone className={isLight ? 'text-[#0F8B8D]' : 'text-teal-400'} />
                      <span className={isLight ? 'text-primary' : 'text-white'}>{cust.phone}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${cust.netColor}`}>
                      {cust.network}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    {isVip ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30">
                        <FiAward className="w-3 h-3 text-amber-500 shrink-0" /> VIP Buyer
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                        <FiCheckCircle className="w-3 h-3 text-emerald-500 shrink-0" /> Verified
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 font-extrabold">
                    <span className={isLight ? 'text-slate-800' : 'text-slate-200'}>
                      {cust.totalOrders} {cust.totalOrders === 1 ? 'Voucher' : 'Vouchers'}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-black text-emerald-600 dark:text-emerald-400">
                    {formatCedi(cust.spent)}
                  </td>

                  <td className="py-4 px-4 font-semibold text-slate-400">
                    {cust.lastActive}
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="inline-flex items-center gap-2 justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onInspectCustomer(cust)}
                        leftIcon={<FiEye className="w-3 h-3" />}
                        className="!rounded-xl !py-1 !px-2.5 !text-xs"
                      >
                        Inspect
                      </Button>
                      <button
                        onClick={() => onSendSMS(cust)}
                        title="Dispatch SMS notification"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          isLight 
                            ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300' 
                            : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200'
                        }`}
                      >
                        <FiMessageSquare className="w-3.5 h-3.5 text-[#0F8B8D] dark:text-teal-400" /> SMS
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
