import React from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { useCustomerProfile } from '../../../hooks/useCustomers';
import { formatCedi } from '../../../utils/formatters';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import {
  FiSmartphone,
  FiAward,
  FiShoppingBag,
  FiCheckCircle,
  FiLoader
} from 'react-icons/fi';

interface CustomerProfileModalProps {
  phoneNumber: string | null;
  onClose: () => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  phoneNumber,
  onClose,
}) => {
  const { isLight } = useAdminTheme();
  
  // Only fetches when phoneNumber is non-null
  const { data: profile, isLoading } = useCustomerProfile(phoneNumber);

  if (!phoneNumber) return null;

  const renderContent = () => {
    if (isLoading || !profile) {
      return (
        <div className="py-12 flex flex-col items-center justify-center text-slate-500">
          <FiLoader className="w-8 h-8 animate-spin mb-4 text-[#0F8B8D]" />
          <p className="font-bold">Loading full profile and purchase history...</p>
        </div>
      );
    }

    const { customer, orders } = profile;
    const isVip = customer.segment === 'VIP';
    const lastActiveText = customer.lastOrderAt ? formatDistanceToNow(parseISO(customer.lastOrderAt), { addSuffix: true }) : 'Never';

    return (
      <div className="space-y-4">
        {/* Profile Banner */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
          isVip
            ? isLight
              ? 'bg-gradient-to-r from-amber-50/80 to-amber-100/50 border-amber-300'
              : 'bg-gradient-to-r from-amber-950/40 to-slate-900 border-amber-500/30'
            : isLight
            ? 'bg-slate-50 border-slate-200'
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-lg font-black tracking-tight flex items-center gap-1.5 ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}>
                <FiSmartphone className={isVip ? 'text-amber-500' : 'text-[#0F8B8D] dark:text-teal-400'} />
                {customer.phoneNumber}
              </span>
            </div>
            <p className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              <strong className="font-mono text-[#0B2545] dark:text-teal-300">{customer.fullName || 'No Name Provided'}</strong>
              {customer.email && ` • ${customer.email}`}
            </p>
          </div>

          {isVip && (
            <div className="flex flex-col items-end shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 shadow-md">
                <FiAward className="w-3.5 h-3.5 text-slate-950" /> VIP BUYER
              </span>
            </div>
          )}
        </div>

        {/* 3-Column Metric Snippets */}
        <div className="grid grid-cols-3 gap-3">
          <div className={`p-3 rounded-2xl border text-center ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <span className="text-[10px] font-black uppercase text-slate-500">Total Vouchers</span>
            <p className={`text-base font-black mt-0.5 ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {customer.totalVouchersPurchased}
            </p>
          </div>
          <div className={`p-3 rounded-2xl border text-center ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <span className="text-[10px] font-black uppercase text-slate-500">Lifetime Spend</span>
            <p className="text-base font-black mt-0.5 text-emerald-700 dark:text-emerald-400">
              {formatCedi(customer.totalSpent)}
            </p>
          </div>
          <div className={`p-3 rounded-2xl border text-center ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <span className="text-[10px] font-black uppercase text-slate-500">Last Activity</span>
            <p className={`text-sm font-extrabold mt-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
              {lastActiveText}
            </p>
          </div>
        </div>

        {/* Recent Voucher Orders Timeline */}
        <div>
          <h3 className={`text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
            isLight ? 'text-slate-800' : 'text-slate-300'
          }`}>
            <FiShoppingBag className="text-[#0F8B8D] dark:text-teal-400" /> Recent Purchases
          </h3>
          <div className={`rounded-2xl border overflow-hidden divide-y text-xs font-semibold ${
            isLight ? 'bg-white border-slate-200 divide-slate-200' : 'bg-slate-900 border-slate-800 divide-slate-800/80'
          }`}>
            {orders.length === 0 ? (
              <div className="p-4 text-center text-slate-500">No orders found.</div>
            ) : (
              orders.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-[11px] ${
                      item.voucherType.includes('WASSCE')
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                        : item.voucherType.includes('BECE')
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                    }`}>
                      {item.voucherType.substring(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                          {item.quantity}x {item.voucherType.replace('_', ' ')} PINs
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-500">#{item.orderNumber}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        Purchased on {format(parseISO(item.createdAt), 'dd MMM yyyy, h:mm a')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-emerald-700 dark:text-emerald-400">
                      {formatCedi(item.totalAmount)}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-black ${
                      item.status === 'SUCCESSFUL' ? 'text-emerald-800 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                    }`}>
                      {item.status === 'SUCCESSFUL' && <FiCheckCircle className="w-3 h-3 text-emerald-600" />} {item.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className={`flex items-center justify-end pt-3 border-t ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <Button variant="ghost" size="sm" onClick={onClose} className="font-bold text-xs">
            Close
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={!!phoneNumber}
      onClose={onClose}
      title="Customer Profile & Order History"
    >
      {renderContent()}
    </Modal>
  );
};
