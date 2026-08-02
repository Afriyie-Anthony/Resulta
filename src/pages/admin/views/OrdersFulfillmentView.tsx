import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';
import { formatCedi } from '../../../utils/formatters';
import {
  FiSearch,
  FiSend,
  FiEye,
  FiEyeOff,
  FiShield,
  FiSmartphone,
  FiCalendar,
  FiTag,
  FiUser
} from 'react-icons/fi';

interface Order {
  id: string;
  phone: string;
  network: 'MTN MoMo' | 'Telecel Cash' | 'AirtelTigo';
  product: string;
  price: number;
  date: string;
  status: 'FULFILLED' | 'PENDING_MOMO' | 'FAILED';
  serial: string;
  pin: string;
  affiliateRef?: string;
}

export const OrdersFulfillmentView: React.FC = () => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPinVisible, setIsPinVisible] = useState(false);

  const orders: Order[] = [
    { id: 'RSL-ORD-2026-8812', phone: '+233 24 819 0312', network: 'MTN MoMo', product: 'WASSCE 2026 Voucher', price: 25.0, date: '2026-08-01 19:42', status: 'FULFILLED', serial: 'W26019448', pin: '881923019842', affiliateRef: 'REF-GH-991A' },
    { id: 'RSL-ORD-2026-8811', phone: '+233 50 221 8904', network: 'Telecel Cash', product: 'BECE 2026 Voucher', price: 20.0, date: '2026-08-01 19:30', status: 'FULFILLED', serial: 'B26004921', pin: '441092839102' },
    { id: 'RSL-ORD-2026-8810', phone: '+233 27 655 4019', network: 'AirtelTigo', product: 'WASSCE 2026 Voucher', price: 25.0, date: '2026-08-01 19:15', status: 'PENDING_MOMO', serial: 'Pending Assignment', pin: '---' },
    { id: 'RSL-ORD-2026-8809', phone: '+233 54 990 1244', network: 'MTN MoMo', product: 'WASSCE 2026 Voucher', price: 25.0, date: '2026-08-01 18:55', status: 'FULFILLED', serial: 'W26019447', pin: '109283746501', affiliateRef: 'REF-GH-1102' },
    { id: 'RSL-ORD-2026-8808', phone: '+233 24 330 7862', network: 'MTN MoMo', product: 'BECE 2026 Voucher', price: 20.0, date: '2026-08-01 18:10', status: 'FAILED', serial: 'Cancelled', pin: '---' },
    { id: 'RSL-ORD-2026-8807', phone: '+233 55 124 9988', network: 'MTN MoMo', product: 'WASSCE 2026 Voucher', price: 25.0, date: '2026-08-01 17:45', status: 'FULFILLED', serial: 'W26019446', pin: '556102938475' },
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.phone.includes(searchTerm) ||
                          o.serial.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleResendSMS = (orderId: string, phone: string) => {
    addToast({
      title: 'SMS Prompt Resubmitted',
      message: `Result-checker PIN & instructions resent to telecom gateway for ${phone} (${orderId}).`,
      type: 'success',
    });
  };

  const handleRevealPin = () => {
    if (!isPinVisible) {
      addToast({
        title: 'Security Audit Log Recorded',
        message: 'Decryption & inspection of voucher PIN has been added to official administrative audit logs.',
        type: 'warning',
      });
    }
    setIsPinVisible(!isPinVisible);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Orders Database & SMS Fulfillment</h1>
        <p className="text-xs text-slate-400 mt-1">
          Investigate customer checkout lifecycle, verify Mobile Money attribution, and manage reshipment of SMS instructions.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <Card glass className="p-4 border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['ALL', 'FULFILLED', 'PENDING_MOMO', 'FAILED'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                statusFilter === status
                  ? 'bg-teal-500 text-slate-950 shadow-sm shadow-teal-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {status === 'ALL' ? 'All Transactions' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by phone, order ID or serial..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </Card>

      {/* Orders Table */}
      <Card glass className="border-slate-800/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 font-bold bg-slate-900/40">
                <th className="py-3.5 px-4">Order Ref</th>
                <th className="py-3.5 px-4">MoMo Customer</th>
                <th className="py-3.5 px-4">Voucher Type</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Serial Allocated</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-400">{o.id}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block">{o.phone}</span>
                      <span className="text-[10px] font-semibold text-slate-400">{o.network}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">{o.product}</td>
                    <td className="py-3.5 px-4 font-extrabold text-white">{formatCedi(o.price)}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{o.serial}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={o.status === 'FULFILLED' ? 'success' : o.status === 'PENDING_MOMO' ? 'warning' : 'error'}
                        className="text-[10px]"
                      >
                        {o.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(o);
                          setIsPinVisible(false);
                        }}
                      >
                        Inspect
                      </Button>
                      {o.status === 'FULFILLED' && (
                        <button
                          type="button"
                          onClick={() => handleResendSMS(o.id, o.phone)}
                          title="Resend SMS Voucher Details"
                          className="p-1.5 text-teal-400 hover:text-teal-300 rounded-lg hover:bg-slate-800 inline-block transition-colors"
                        >
                          <FiSend className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 font-semibold">
                    No matching customer orders found in current query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Inspection Modal */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="Order Lifecycle Investigation">
        {selectedOrder && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Transaction Identifier</span>
                <p className="text-lg font-mono font-bold text-teal-400 mt-0.5">{selectedOrder.id}</p>
              </div>
              <Badge variant={selectedOrder.status === 'FULFILLED' ? 'success' : 'warning'}>
                {selectedOrder.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <p className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
                  <FiSmartphone /> MoMo Phone Account
                </p>
                <p className="text-sm font-extrabold text-white">{selectedOrder.phone}</p>
                <p className="text-teal-400 font-semibold text-[11px]">{selectedOrder.network} Gateway</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <p className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
                  <FiCalendar /> Purchase Date
                </p>
                <p className="text-sm font-extrabold text-white">{selectedOrder.date}</p>
                <p className="text-slate-400 font-semibold text-[11px]">{formatCedi(selectedOrder.price)} Gross Total</p>
              </div>
            </div>

            {selectedOrder.affiliateRef && (
              <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FiUser className="w-4 h-4 text-teal-400" />
                  <span className="text-xs text-slate-200 font-medium">Attributed Affiliate Referral Code:</span>
                </div>
                <Badge variant="primary" className="font-mono">{selectedOrder.affiliateRef}</Badge>
              </div>
            )}

            {/* Cryptographic PIN Section */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-2">
                    <FiTag className="text-amber-400" /> Allocated Serial & PIN Credentials
                  </p>
                  <p className="text-[11px] text-slate-400">Restricted access under Specification Sections 24 & 36.</p>
                </div>
                {selectedOrder.status === 'FULFILLED' && (
                  <Button variant="outline" size="sm" onClick={handleRevealPin} leftIcon={isPinVisible ? <FiEyeOff /> : <FiEye />}>
                    {isPinVisible ? 'Hide PIN' : 'Reveal PIN'}
                  </Button>
                )}
              </div>

              {selectedOrder.status === 'FULFILLED' ? (
                <div className="grid grid-cols-2 gap-4 font-mono pt-3 border-t border-slate-800/60">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">Serial Number</span>
                    <span className="text-sm font-bold text-slate-200">{selectedOrder.serial}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">Voucher PIN Code</span>
                    <span className={`text-sm font-extrabold ${isPinVisible ? 'text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30' : 'text-slate-400'}`}>
                      {isPinVisible ? selectedOrder.pin : '••••••••••••'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-amber-400/90 font-medium bg-amber-950/20 p-2.5 rounded-lg border border-amber-500/20">
                  No voucher allocated yet. Awaiting verified payment callback from mobile network operator.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1"><FiShield className="text-teal-500" /> Administrative actions logged</span>
              <div className="space-x-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                  Close window
                </Button>
                {selectedOrder.status === 'FULFILLED' && (
                  <Button variant="gradient" size="sm" onClick={() => handleResendSMS(selectedOrder.id, selectedOrder.phone)} leftIcon={<FiSend />}>
                    Resend SMS to {selectedOrder.phone}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
