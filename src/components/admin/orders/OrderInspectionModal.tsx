import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import type { Order } from './types';
import { formatCedi } from '../../../utils/formatters';
import {
  FiEye,
  FiEyeOff,
  FiSend,
  FiSmartphone,
  FiCalendar,
  FiTag,
  FiUser,
  FiCheck,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi';

interface OrderInspectionModalProps {
  order: Order | null;
  onClose: () => void;
  onResendSMS: (order: Order) => void;
  onPinReveal: () => void;
}

export const OrderInspectionModal: React.FC<OrderInspectionModalProps> = ({
  order,
  onClose,
  onResendSMS,
  onPinReveal,
}) => {
  const { isLight } = useAdminTheme();
  const [isPinVisible, setIsPinVisible] = useState(false);

  if (!order) return null;

  const handleTogglePin = () => {
    if (!isPinVisible) {
      onPinReveal();
    }
    setIsPinVisible(!isPinVisible);
  };

  // Pipeline stages logic
  const stages = [
    { name: 'Checkout Started', done: true, time: order.date },
    { name: 'MoMo Verified', done: order.status === 'FULFILLED' || order.status === 'PENDING_MOMO', active: order.status === 'PENDING_MOMO', failed: order.status === 'FAILED' },
    { name: 'PIN Allocated', done: order.status === 'FULFILLED', failed: order.status === 'FAILED' },
    { name: 'SMS Dispatched', done: order.status === 'FULFILLED', failed: order.status === 'FAILED' }
  ];

  return (
    <Modal
      isOpen={!!order}
      onClose={() => { setIsPinVisible(false); onClose(); }}
      title="Order Lifecycle Investigation"
    >
      {/* Tight vertical spacing to prevent scroll bar as per design rules */}
      <div className="space-y-4">
        {/* Top Header Card */}
        <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">Transaction Identifier</span>
            <span className={`text-base font-mono font-black ${isLight ? 'text-primary' : 'text-teal-400'}`}>
              {order.id}
            </span>
          </div>
          <Badge
            variant={order.status === 'FULFILLED' ? 'success' : order.status === 'PENDING_MOMO' ? 'warning' : 'error'}
            className="text-[10px] font-black !px-3 !py-1 shadow-2xs"
          >
            {order.status.replace('_', ' ')}
          </Badge>
        </div>

        {/* Visual Delivery Status Pipeline */}
        <div className={`p-3.5 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-950/80 border-slate-800/90'
        }`}>
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">
            Automated Delivery Pipeline
          </p>
          <div className="grid grid-cols-4 gap-2 relative">
            {stages.map((st, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all mb-1.5 ${
                  st.done
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : st.active
                    ? 'bg-amber-500 text-slate-950 animate-pulse font-bold'
                    : st.failed
                    ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
                    : isLight
                    ? 'bg-slate-100 text-slate-400 border border-slate-200'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}>
                  {st.done ? <FiCheck className="w-3.5 h-3.5 stroke-[3]" /> : st.active ? <FiClock className="w-3.5 h-3.5" /> : st.failed ? <FiAlertCircle className="w-3.5 h-3.5" /> : (i + 1)}
                </div>
                <span className={`text-[10px] font-bold leading-tight ${
                  st.done
                    ? isLight ? 'text-slate-800 font-black' : 'text-slate-200 font-black'
                    : st.active
                    ? 'text-amber-500 font-black'
                    : 'text-slate-400 font-medium'
                }`}>
                  {st.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer & Order Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className={`p-3 rounded-2xl border space-y-0.5 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800/80'
          }`}>
            <p className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
              <FiSmartphone /> MoMo Account
            </p>
            <p className={`text-sm font-black truncate ${isLight ? 'text-primary' : 'text-white'}`}>
              {order.phone}
            </p>
            <p className="text-[#0F8B8D] dark:text-teal-400 font-bold text-[11px]">{order.network} Gateway</p>
          </div>

          <div className={`p-3 rounded-2xl border space-y-0.5 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800/80'
          }`}>
            <p className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
              <FiCalendar /> Purchase Date
            </p>
            <p className={`text-sm font-black truncate ${isLight ? 'text-primary' : 'text-white'}`}>
              {order.date}
            </p>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-[11px]">{formatCedi(order.price)} Gross Total</p>
          </div>
        </div>

        {/* Affiliate Attribution */}
        {order.affiliateRef && (
          <div className={`px-3.5 py-2.5 rounded-2xl border flex items-center justify-between ${
            isLight
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-teal-500/10 border-teal-500/30 text-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <FiUser className="w-4 h-4 text-emerald-600 dark:text-teal-400" />
              <span className="text-xs font-bold">Attributed Affiliate Code:</span>
            </div>
            <Badge variant="success" className="font-mono text-[11px] font-black !px-2.5">
              {order.affiliateRef}
            </Badge>
          </div>
        )}

        {/* Cryptographic PIN Section (Compact) */}
        <div className={`p-4 rounded-2xl border transition-colors space-y-3 ${
          isLight ? 'bg-slate-100 border-slate-200/90' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiTag className="text-amber-500 dark:text-amber-400 w-4 h-4" />
              <span className={`text-xs font-black ${isLight ? 'text-primary' : 'text-white'}`}>
                Allocated Serial & PIN Credentials
              </span>
            </div>
            {order.status === 'FULFILLED' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleTogglePin}
                leftIcon={isPinVisible ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
                className="text-[11px] h-7 px-2.5"
              >
                {isPinVisible ? 'Hide PIN' : 'Reveal PIN'}
              </Button>
            )}
          </div>

          {order.status === 'FULFILLED' ? (
            <div className={`grid grid-cols-2 gap-4 font-mono pt-2.5 border-t ${
              isLight ? 'border-slate-200' : 'border-slate-800/60'
            }`}>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-sans font-bold">Serial Number</span>
                <span className={`text-xs font-black ${isLight ? 'text-secondary' : 'text-slate-200'}`}>{order.serial}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-sans font-bold">Voucher PIN Code</span>
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded border inline-block mt-0.5 ${
                  isPinVisible
                    ? isLight
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40'
                    : 'text-slate-400 border-transparent !px-0'
                }`}>
                  {isPinVisible ? order.pin : '••••••••••••'}
                </span>
              </div>
            </div>
          ) : (
            <p className={`text-[11px] font-bold p-2.5 rounded-xl border ${
              isLight
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-amber-950/20 text-amber-300 border-amber-500/30'
            }`}>
              No voucher allocated yet. Awaiting verified payment confirmation callback from telecom operator.
            </p>
          )}
        </div>

        {/* Compressed action footer without scrolling */}
        <div className={`flex items-center justify-between text-xs font-bold pt-2 border-t ${
          isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-400'
        }`}>
          <span>Administrative audit logging active</span>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => { setIsPinVisible(false); onClose(); }} className="h-9 font-bold text-xs">
              Close
            </Button>
            {order.status === 'FULFILLED' && (
              <Button
                variant={isLight ? 'primary' : 'gradient'}
                size="sm"
                onClick={() => { onResendSMS(order); onClose(); }}
                leftIcon={<FiSend />}
                className="h-9 px-4 text-xs font-black shadow-md rounded-xl"
              >
                Resend SMS
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
