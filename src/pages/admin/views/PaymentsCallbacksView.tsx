import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';
import { useToast } from '../../../components/ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { formatCedi } from '../../../utils/formatters';
import {
  FiSearch,
  FiRefreshCw,
  FiShield,
  FiCheckCircle,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi';

export const PaymentsCallbacksView: React.FC = () => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Payment Webhooks & Idempotency Audit
          </h1>
          <p className={`text-xs font-semibold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Real-time ingestion logs from MTN MoMo, Telecel Cash, and AirtelTigo financial payment provider callbacks.
          </p>
        </div>
        <Badge variant="neutral" className="w-fit font-mono font-bold">IDEMPOTENT_ENGINE_ON</Badge>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glass className={`p-5 flex items-center justify-between border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/90 border-slate-800'}`}>
          <div>
            <p className={`text-[11px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Gateway Success Rate</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">94.8%</p>
            <span className={`text-[11px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>242 verified payments today</span>
          </div>
          <FiCheckCircle className="w-10 h-10 text-emerald-500/40" />
        </Card>

        <Card glass className={`p-5 flex items-center justify-between border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/90 border-slate-800'}`}>
          <div>
            <p className={`text-[11px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Pending User PIN Entry</p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">3</p>
            <span className={`text-[11px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>Awaiting USSD PIN authorisations</span>
          </div>
          <FiClock className="w-10 h-10 text-amber-500/40 animate-pulse" />
        </Card>

        <Card glass className={`p-5 flex items-center justify-between border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/90 border-slate-800'}`}>
          <div>
            <p className={`text-[11px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Failed / Timeouts</p>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">11</p>
            <span className={`text-[11px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>Insufficient balance or network delay</span>
          </div>
          <FiAlertCircle className="w-10 h-10 text-rose-500/40" />
        </Card>
      </div>

      {/* Webhook Log Table */}
      <Card glass className={`p-6 border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/90 border-slate-800'}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h3 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Idempotency Transaction Ledger</h3>
            <p className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Guarantees one successful callback equals one voucher delivery</p>
          </div>
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search reference or customer MoMo..."
              className={`w-full rounded-xl pl-9 pr-4 py-1.5 text-xs font-semibold focus:outline-none border ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-teal-500'
              }`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] uppercase font-black ${
                isLight ? 'border-slate-300 text-slate-700' : 'border-slate-800 text-slate-400'
              }`}>
                <th className="py-3 px-3">Merchant Pay Ref</th>
                <th className="py-3 px-3">Order Target</th>
                <th className="py-3 px-3">MoMo Account</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Webhook Status</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-semibold ${isLight ? 'divide-slate-200' : 'divide-slate-800/50'}`}>
              {paginated.map((t) => (
                <tr key={t.ref} className={`transition-colors ${isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-950/50'}`}>
                  <td className={`py-3.5 px-3 font-mono font-black ${isLight ? 'text-[#0B2545]' : 'text-teal-400'}`}>{t.ref}</td>
                  <td className={`py-3.5 px-3 font-mono font-bold ${isLight ? 'text-[#0F8B8D]' : 'text-slate-300'}`}>{t.orderId}</td>
                  <td className="py-3.5 px-3">
                    <span className={`font-black block ${isLight ? 'text-slate-950' : 'text-white'}`}>{t.customer}</span>
                    <span className={`text-[10px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>{t.network}</span>
                  </td>
                  <td className={`py-3.5 px-3 font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>{formatCedi(t.amount)}</td>
                  <td className="py-3.5 px-3">
                    <Badge
                      variant={
                        t.status === 'PAID'
                          ? 'success'
                          : t.status === 'PENDING_USER_PIN'
                          ? 'warning'
                          : 'error'
                      }
                      className="text-[10px] font-bold"
                    >
                      {t.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className={`py-3.5 px-3 font-mono font-bold text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>{t.timestamp}</td>
                  <td className="py-3.5 px-3 text-right">
                    {t.status !== 'PAID' ? (
                      <Button
                        variant={isLight ? 'outline' : 'secondary'}
                        size="sm"
                        onClick={() => handleReconcile(t.ref)}
                        leftIcon={<FiRefreshCw className="w-3 h-3" />}
                        className="font-black text-xs"
                      >
                        Force Reconcile
                      </Button>
                    ) : (
                      <span className="text-emerald-700 dark:text-emerald-400 text-[11px] font-black flex items-center justify-end gap-1">
                        <FiShield /> Confirmed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newSize) => {
              setItemsPerPage(newSize);
              setCurrentPage(1);
            }}
          />
        </div>
      </Card>
    </div>
  );
};
