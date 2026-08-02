import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import { formatCedi } from '../../../utils/formatters';
import {
  FiSearch,
  FiRefreshCw,
  FiShield,
  FiSmartphone,
  FiCheckCircle,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi';

export const PaymentsCallbacksView: React.FC = () => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const [transactions, setTransactions] = useState([
    { ref: 'RSL-PAY-2026-7F82A', orderId: 'RSL-ORD-2026-8812', customer: '+233 24 819 0312', network: 'MTN MoMo', amount: 25.0, timestamp: '19:42:15 GMT', status: 'PAID', attempts: 1 },
    { ref: 'RSL-PAY-2026-7F82B', orderId: 'RSL-ORD-2026-8811', customer: '+233 50 221 8904', network: 'Telecel Cash', amount: 20.0, timestamp: '19:30:40 GMT', status: 'PAID', attempts: 1 },
    { ref: 'RSL-PAY-2026-7F82C', orderId: 'RSL-ORD-2026-8810', customer: '+233 27 655 4019', network: 'AirtelTigo', amount: 25.0, timestamp: '19:15:02 GMT', status: 'PENDING_USER_PIN', attempts: 2 },
    { ref: 'RSL-PAY-2026-7F82D', orderId: 'RSL-ORD-2026-8809', customer: '+233 54 990 1244', network: 'MTN MoMo', amount: 25.0, timestamp: '18:55:21 GMT', status: 'PAID', attempts: 1 },
    { ref: 'RSL-PAY-2026-7F82E', orderId: 'RSL-ORD-2026-8808', customer: '+233 24 330 7862', network: 'MTN MoMo', amount: 20.0, timestamp: '18:10:11 GMT', status: 'TIMEOUT_INSUFFICIENT', attempts: 1 },
  ]);

  const handleReconcile = (ref: string) => {
    setTransactions(prev => prev.map(t => t.ref === ref ? { ...t, status: 'PAID', attempts: t.attempts + 1 } : t));
    addToast({
      title: 'Gateway Reconciled Successfully',
      message: `Callback verification forced for ${ref}. Associated voucher allocation unlocked.`,
      type: 'success',
    });
  };

  const filtered = transactions.filter(t => 
    t.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.customer.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Payment Webhooks & Idempotency Audit</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time ingestion logs from MTN MoMo, Telecel Cash, and AirtelTigo financial payment provider callbacks.
          </p>
        </div>
        <Badge variant="neutral" className="w-fit font-mono">IDEMPOTENT_ENGINE_ON</Badge>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glass className="p-5 border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Gateway Success Rate</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">94.8%</p>
            <span className="text-[11px] text-slate-500">242 verified payments today</span>
          </div>
          <FiCheckCircle className="w-10 h-10 text-emerald-500/30" />
        </Card>

        <Card glass className="p-5 border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Pending User PIN Entry</p>
            <p className="text-2xl font-black text-amber-400 mt-1">3</p>
            <span className="text-[11px] text-slate-500">Awaiting USSD PIN authorisations</span>
          </div>
          <FiClock className="w-10 h-10 text-amber-500/30 animate-pulse" />
        </Card>

        <Card glass className="p-5 border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Failed / Timeouts</p>
            <p className="text-2xl font-black text-rose-400 mt-1">11</p>
            <span className="text-[11px] text-slate-500">Insufficient balance or network delay</span>
          </div>
          <FiAlertCircle className="w-10 h-10 text-rose-500/30" />
        </Card>
      </div>

      {/* Webhook Log Table */}
      <Card glass className="border-slate-800/80 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Idempotency Transaction Ledger</h3>
            <p className="text-xs text-slate-400">Guarantees one successful callback equals one voucher delivery (Section 19)</p>
          </div>
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reference or customer MoMo..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 font-bold">
                <th className="py-3 px-3">Merchant Pay Ref</th>
                <th className="py-3 px-3">Order Target</th>
                <th className="py-3 px-3">MoMo Account</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Webhook Status</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filtered.map((t) => (
                <tr key={t.ref} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-teal-400">{t.ref}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-300">{t.orderId}</td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-white block">{t.customer}</span>
                    <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                      <FiSmartphone className="w-3 h-3 text-teal-400" /> {t.network}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-extrabold text-white">{formatCedi(t.amount)}</td>
                  <td className="py-3.5 px-3">
                    <Badge
                      variant={
                        t.status === 'PAID'
                          ? 'success'
                          : t.status === 'PENDING_USER_PIN'
                          ? 'warning'
                          : 'error'
                      }
                      className="text-[10px]"
                    >
                      {t.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 text-[11px] font-mono">{t.timestamp}</td>
                  <td className="py-3.5 px-3 text-right">
                    {t.status !== 'PAID' ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleReconcile(t.ref)}
                        leftIcon={<FiRefreshCw className="w-3 h-3" />}
                      >
                        Force Reconcile
                      </Button>
                    ) : (
                      <span className="text-emerald-400 text-[11px] font-bold flex items-center justify-end gap-1">
                        <FiShield /> Confirmed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
