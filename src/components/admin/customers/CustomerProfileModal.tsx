import React from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import type { Customer } from './types';
import { formatCedi } from '../../../utils/formatters';
import {
  FiSmartphone,
  FiAward,
  FiShoppingBag,
  FiCheckCircle,
  FiMessageSquare
} from 'react-icons/fi';

interface CustomerProfileModalProps {
  customer: Customer | null;
  onClose: () => void;
  onTriggerSMS: (customer: Customer) => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  customer,
  onClose,
  onTriggerSMS
}) => {
  const { isLight } = useAdminTheme();

  if (!customer) return null;

  const isVip = customer.status === 'VIP BUYER';

  return (
    <Modal
      isOpen={!!customer}
      onClose={onClose}
      title="Customer Profile & Order History"
    >
      {/* Compact layout with reduced spacing to avoid vertical scrollbars */}
      <div className="space-y-4">
        {/* Profile Banner */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
          isVip
            ? isLight
              ? 'bg-gradient-to-r from-amber-50/80 to-amber-100/50 border-amber-300/80'
              : 'bg-gradient-to-r from-amber-950/40 to-slate-900 border-amber-500/30'
            : isLight
            ? 'bg-gradient-to-r from-cyan-50/60 to-slate-50 border-cyan-200/80'
            : 'bg-gradient-to-r from-teal-950/30 to-slate-900 border-teal-500/30'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-lg font-black tracking-tight flex items-center gap-1.5 ${
                isLight ? 'text-primary' : 'text-white'
              }`}>
                <FiSmartphone className={isVip ? 'text-amber-500' : 'text-[#0F8B8D] dark:text-teal-400'} />
                {customer.phone}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${customer.netColor}`}>
                {customer.network}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Account ID: <strong className="font-mono">{customer.id}</strong> • Registered: {customer.registeredDate}
            </p>
          </div>

          {isVip && (
            <div className="flex flex-col items-end shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20">
                <FiAward className="w-3.5 h-3.5 text-slate-950" /> VIP BUYER
              </span>
            </div>
          )}
        </div>

        {/* 3-Column Metric Snippets */}
        <div className="grid grid-cols-3 gap-3">
          <div className={`p-3 rounded-2xl border text-center ${
            isLight ? 'bg-slate-50 border-slate-200/90' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <span className="text-[10px] font-black uppercase text-slate-400">Total Vouchers</span>
            <p className={`text-base font-black mt-0.5 ${isLight ? 'text-primary' : 'text-white'}`}>
              {customer.totalOrders} {customer.totalOrders === 1 ? 'Order' : 'Orders'}
            </p>
          </div>
          <div className={`p-3 rounded-2xl border text-center ${
            isLight ? 'bg-slate-50 border-slate-200/90' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <span className="text-[10px] font-black uppercase text-slate-400">Lifetime Spend</span>
            <p className="text-base font-black mt-0.5 text-emerald-600 dark:text-emerald-400">
              {formatCedi(customer.spent)}
            </p>
          </div>
          <div className={`p-3 rounded-2xl border text-center ${
            isLight ? 'bg-slate-50 border-slate-200/90' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <span className="text-[10px] font-black uppercase text-slate-400">Last Activity</span>
            <p className="text-sm font-extrabold mt-1 text-slate-600 dark:text-slate-300">
              {customer.lastActive}
            </p>
          </div>
        </div>

        {/* Recent Voucher Orders Timeline */}
        <div>
          <h3 className={`text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            <FiShoppingBag className="text-[#0F8B8D] dark:text-teal-400" /> Recent Voucher Purchases
          </h3>
          <div className={`rounded-2xl border overflow-hidden divide-y text-xs font-medium ${
            isLight ? 'bg-white border-slate-200 divide-slate-200/80' : 'bg-slate-900 border-slate-800 divide-slate-800/80'
          }`}>
            {customer.purchaseHistory.map((item) => (
              <div key={item.id} className="p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-[11px] ${
                    item.examType === 'WASSCE'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                      : item.examType === 'BECE'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                  }`}>
                    {item.examType[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-black ${isLight ? 'text-primary' : 'text-white'}`}>
                        {item.quantity}x {item.examType} Checker PINs
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">#{item.id}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">Purchased via {customer.network} on {item.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatCedi(item.totalPaid)}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                    <FiCheckCircle className="w-2.5 h-2.5" /> SMS Sent
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              onTriggerSMS(customer);
              onClose();
            }}
            leftIcon={<FiMessageSquare />}
            className="!rounded-xl"
          >
            Dispatch Direct SMS Update
          </Button>
          <Button variant="primary" size="sm" onClick={onClose} className="!rounded-xl px-6">
            Close Profile
          </Button>
        </div>
      </div>
    </Modal>
  );
};
