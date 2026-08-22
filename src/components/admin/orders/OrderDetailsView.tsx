import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import type { Order } from './types';
import { useOrder } from '../../../hooks/useOrders';
import { formatCedi } from '../../../utils/formatters';
import {
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiSmartphone,
  FiTag,
  FiEye,
  FiEyeOff,
  FiSend,
  FiShield,
  FiCopy,
  FiCheckCircle
} from 'react-icons/fi';

interface OrderDetailsViewProps {
  order: Order;
  onBack: () => void;
  onResendSMS: (order: Order) => void;
}

export const OrderDetailsView: React.FC<OrderDetailsViewProps> = ({
  order,
  onBack,
  onResendSMS
}) => {
  const { isLight } = useAdminTheme();
  const [isPinVisible, setIsPinVisible] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const { data: fullOrderData, isLoading } = useOrder(order.id);
  const fullOrder = fullOrderData || order;

  const stages = [
    { name: 'Checkout Started', done: true, time: fullOrder.createdAt },
    { name: 'Payment Verified', done: fullOrder.status === 'SUCCESSFUL', active: fullOrder.status === 'PENDING', failed: fullOrder.status === 'FAILED' },
    { name: 'Voucher Allocated', done: fullOrder.status === 'SUCCESSFUL' && (fullOrder.vouchersAssigned ?? 0) > 0, failed: fullOrder.status === 'FAILED' },
    { name: 'SMS Dispatched', done: fullOrder.deliveryStatus === 'DELIVERED', active: fullOrder.deliveryStatus === 'PENDING', failed: fullOrder.deliveryStatus === 'FAILED' || fullOrder.status === 'FAILED' }
  ];

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Top Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            type="button"
            onClick={onBack}
            className={`inline-flex items-center gap-2 text-xs font-black transition-colors mb-2 ${
              isLight ? 'text-[#0F8B8D] hover:text-[#0B2545]' : 'text-teal-400 hover:text-white'
            }`}
          >
            <FiArrowLeft className="w-4 h-4" /> Back to Orders List
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Order Lifecycle Details
            </h1>
            <span className="font-mono text-sm font-black px-3 py-1 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 dark:bg-slate-800 dark:text-teal-300 dark:border-slate-700">
              {order.id}
            </span>
            <Badge
              variant={fullOrder.status === 'SUCCESSFUL' ? 'success' : fullOrder.status === 'PENDING' ? 'warning' : 'error'}
              className="text-xs font-black !px-3 !py-1 shadow-2xs"
            >
              {fullOrder.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {fullOrder.status === 'SUCCESSFUL' && (
            <Button
              variant={isLight ? 'primary' : 'gradient'}
              size="md"
              leftIcon={<FiSend />}
              onClick={() => onResendSMS(fullOrder)}
              className="font-black text-xs h-11 px-5 rounded-2xl shadow-md"
            >
              Resend SMS Voucher
            </Button>
          )}
        </div>
      </div>

      {/* Summary KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card glass className={`p-5 border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/90 border-slate-800'}`}>
          <span className={`text-[11px] font-black uppercase tracking-wider block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            Transaction Value
          </span>
          <p className={`text-2xl font-black ${isLight ? 'text-[#0B2545]' : 'text-white'}`}>
            {formatCedi(fullOrder.totalAmount)}
          </p>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1 block">
            {fullOrder.quantity}x Unit License
          </span>
        </Card>

        <Card glass className={`p-5 border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/90 border-slate-800'}`}>
          <span className={`text-[11px] font-black uppercase tracking-wider block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            Voucher Product
          </span>
          <p className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {fullOrder.voucherType?.replace('_', ' ')}
          </p>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 block">
            WAEC Ghana Official Serial
          </span>
        </Card>

        <Card glass className={`p-5 border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/90 border-slate-800'}`}>
          <span className={`text-[11px] font-black uppercase tracking-wider block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            Payment Channel
          </span>
          <p className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {fullOrder.channel}
          </p>
          <span className="text-xs font-semibold text-[#0F8B8D] dark:text-teal-400 mt-1 block">
            Verified {fullOrder.channel === 'USSD' ? 'USSD' : 'Web Portal'}
          </span>
        </Card>

        <Card glass className={`p-5 border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/90 border-slate-800'}`}>
          <span className={`text-[11px] font-black uppercase tracking-wider block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            Purchase Timestamp
          </span>
          <p className={`text-base font-mono font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {new Date(fullOrder.createdAt).toLocaleString()}
          </p>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 block">
            Local Time
          </span>
        </Card>
      </div>

      {/* Visual Fulfillment Pipeline */}
      <Card glass className={`p-6 border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/90 border-slate-800'}`}>
        <h3 className={`text-sm font-black uppercase tracking-wider mb-6 flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          <FiShield className="text-[#0F8B8D] dark:text-teal-400" /> Automated Delivery Pipeline Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {stages.map((st, i) => (
            <div key={i} className={`p-4 rounded-2xl border flex flex-col justify-between ${
              st.done
                ? isLight ? 'bg-emerald-50/80 border-emerald-300' : 'bg-emerald-500/10 border-emerald-500/30'
                : st.active
                ? isLight ? 'bg-amber-50/80 border-amber-300' : 'bg-amber-500/10 border-amber-500/30'
                : st.failed
                ? isLight ? 'bg-rose-50/80 border-rose-300' : 'bg-rose-500/10 border-rose-500/30'
                : isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                  st.done
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : st.active
                    ? 'bg-amber-500 text-slate-950 animate-pulse font-black'
                    : st.failed
                    ? 'bg-rose-600 text-white'
                    : isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'
                }`}>
                  {st.done ? <FiCheck className="w-4 h-4 stroke-[3]" /> : st.active ? <FiClock className="w-4 h-4" /> : st.failed ? <FiAlertCircle className="w-4 h-4" /> : (i + 1)}
                </span>
                <span className="text-[10px] font-black uppercase text-slate-500">Stage 0{i + 1}</span>
              </div>
              <div>
                <p className={`text-sm font-black ${
                  st.done
                    ? isLight ? 'text-emerald-950' : 'text-emerald-300'
                    : st.active
                    ? isLight ? 'text-amber-950' : 'text-amber-300'
                    : st.failed
                    ? isLight ? 'text-rose-950' : 'text-rose-300'
                    : isLight ? 'text-slate-800' : 'text-slate-400'
                }`}>
                  {st.name}
                </p>
                <span className="text-[11px] font-semibold text-slate-500 block mt-1">
                  {st.done ? 'Completed automatically' : st.active ? 'Processing gateway response' : st.failed ? 'Execution failed' : 'Pending stage'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Grid: Cryptographic Voucher & Customer Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Cryptographic Serial & PIN Credentials */}
        <Card glass className={`p-6 border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/90 border-slate-800'}`}>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
            <div className="flex items-center gap-2">
              <FiTag className="text-[#0F8B8D] dark:text-teal-400 w-5 h-5" />
              <h3 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Allocated Voucher Credentials ({fullOrder.vouchers?.length || 0})
              </h3>
            </div>
            {fullOrder.status === 'SUCCESSFUL' && (
              <Button
                variant={isLight ? 'outline' : 'secondary'}
                size="sm"
                onClick={() => setIsPinVisible(!isPinVisible)}
                leftIcon={isPinVisible ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
                className="font-bold text-xs"
              >
                {isPinVisible ? 'Hide PINs' : 'Reveal PINs'}
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading credentials...</div>
          ) : fullOrder.status === 'SUCCESSFUL' && fullOrder.vouchers && fullOrder.vouchers.length > 0 ? (
            <div className="space-y-4">
              {fullOrder.vouchers.map((voucher, index) => (
                <div key={voucher.id} className="mb-4 border-b pb-4 last:border-0 last:pb-0 border-slate-200 dark:border-slate-800">
                  <div className={`p-4 rounded-t-2xl border border-b-0 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                        Voucher #{index + 1} Serial
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(voucher.serialNumber, `serial-${voucher.id}`)}
                        className="text-xs font-bold text-[#0F8B8D] dark:text-teal-400 flex items-center gap-1 hover:underline"
                      >
                        {copiedField === `serial-${voucher.id}` ? <><FiCheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><FiCopy className="w-3.5 h-3.5" /> Copy</>}
                      </button>
                    </div>
                    <p className={`text-lg font-mono font-black ${isLight ? 'text-[#0F8B8D]' : 'text-teal-300'}`}>
                      {voucher.serialNumber}
                    </p>
                  </div>

                  <div className={`p-4 rounded-b-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                        Voucher PIN Code
                      </span>
                      {isPinVisible && (
                        <button
                          type="button"
                          onClick={() => handleCopy(voucher.pin, `pin-${voucher.id}`)}
                          className="text-xs font-bold text-[#0F8B8D] dark:text-teal-400 flex items-center gap-1 hover:underline"
                        >
                          {copiedField === `pin-${voucher.id}` ? <><FiCheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><FiCopy className="w-3.5 h-3.5" /> Copy PIN</>}
                        </button>
                      )}
                    </div>
                    <p className={`text-xl font-mono font-black px-3 py-1.5 rounded-xl border inline-block ${
                      isPinVisible
                        ? 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40'
                        : 'bg-slate-200/80 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                    }`}>
                      {isPinVisible ? voucher.pin : '••••••••••••'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-6 rounded-2xl border text-center space-y-2 ${
              isLight ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
            }`}>
              <FiAlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto" />
              <p className="text-sm font-black">Pending Voucher Allocation</p>
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-400 max-w-sm mx-auto">
                No voucher unit has been assigned to this order yet. The system is awaiting payment verification webhook callback from telecom gateway.
              </p>
            </div>
          )}
        </Card>

        {/* Card 2: Customer & Payment Gateway Details */}
        <Card glass className={`p-6 border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/90 border-slate-800'}`}>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
            <div className="flex items-center gap-2">
              <FiSmartphone className="text-[#0F8B8D] dark:text-teal-400 w-5 h-5" />
              <h3 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Customer & Payment Telemetry
              </h3>
            </div>
            <span className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <FiCheckCircle /> Verified Payout
            </span>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            <div className={`p-4 rounded-2xl border space-y-1 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
              <span className={`text-[11px] font-black uppercase tracking-wider block ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                Recipient Mobile Money Account
              </span>
              <p className={`text-base font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                {fullOrder.phoneNumber}
              </p>
              <span className="text-[#0F8B8D] dark:text-teal-400 font-bold text-xs block">
                {fullOrder.fullName}
              </span>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
              <span className={`text-[11px] font-black uppercase tracking-wider block ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                Automated Gateway Response Audit
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block font-bold">Transaction Reference:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{fullOrder.hubtelTransactionId || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-bold">SMS Dispatch Status:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{fullOrder.deliveryStatus}</span>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
              <span className={`text-xs font-black block mb-1 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                Compliance & Security Stamp
              </span>
              <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-700 font-semibold' : 'text-slate-400'}`}>
                This transaction was processed with 256-bit AES encryption. PIN credentials sent directly to customer MSISDN via Hubtel/Nsemwo SMS gateway routing.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
