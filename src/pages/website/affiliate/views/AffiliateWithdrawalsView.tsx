import React from 'react';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { formatCedi, formatDate } from '../../../../utils/formatters';
import { FiCreditCard, FiCheckCircle, FiAlertCircle, FiSmartphone } from 'react-icons/fi';

interface AffiliateWithdrawalsViewProps {
  onRequestPayout: () => void;
}

export const AffiliateWithdrawalsView: React.FC<AffiliateWithdrawalsViewProps> = ({
  onRequestPayout,
}) => {
  const pendingPayout = 320.0;

  const withdrawalHistory = [
    {
      id: 'WD-GH-904',
      date: '2026-08-15T10:30:00Z',
      amount: 450.0,
      network: 'MTN Mobile Money',
      phone: '024 123 4567',
      accountName: 'Kofi Mensah',
      status: 'PAID',
      txRef: 'MOMO-PAY-8819203',
    },
    {
      id: 'WD-GH-882',
      date: '2026-08-01T14:15:00Z',
      amount: 300.0,
      network: 'MTN Mobile Money',
      phone: '024 123 4567',
      accountName: 'Kofi Mensah',
      status: 'PAID',
      txRef: 'MOMO-PAY-7718290',
    },
    {
      id: 'WD-GH-810',
      date: '2026-07-18T09:40:00Z',
      amount: 170.0,
      network: 'Telecel Cash',
      phone: '020 987 6543',
      accountName: 'Kofi Mensah',
      status: 'PAID',
      txRef: 'MOMO-PAY-6651239',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Wallet & Withdrawal History</h2>
          <p className="text-sm text-slate-600 mt-1">
            Request commission payouts directly to your MTN MoMo, Telecel Cash, or AT Money account.
          </p>
        </div>
        <Button
          variant="gradient"
          size="md"
          leftIcon={<FiCreditCard className="w-4 h-4" />}
          onClick={onRequestPayout}
        >
          Request Cashout
        </Button>
      </div>

      {/* Balance Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Available Balance</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <FiCreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-emerald-600">{formatCedi(pendingPayout)}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Cleared commissions ready for withdrawal</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Button variant="primary" size="sm" fullWidth onClick={onRequestPayout}>
              Withdraw Funds Now
            </Button>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Paid Out</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center">
              <FiCheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-slate-900">{formatCedi(920.0)}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">3 completed MoMo payout transfers</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 flex items-center gap-1.5 font-medium">
            <FiSmartphone className="text-teal-600" /> Default: <strong className="text-slate-900">MTN (024 123 4567)</strong>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Payout Threshold</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <FiAlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-slate-900">{formatCedi(20.0)}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Minimum payout threshold per transfer</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
            Payout processing time: <strong className="text-slate-900">Instant - 2 Hours</strong>
          </div>
        </div>
      </div>

      {/* Withdrawal History Table */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm overflow-hidden">
        <h3 className="text-base font-bold text-slate-900 mb-4">Past Withdrawal Requests</h3>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-y border-slate-200">
              <tr>
                <th className="px-4 py-3">Payout Ref</th>
                <th className="px-4 py-3">Requested Date</th>
                <th className="px-4 py-3">MoMo Receiver Account</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 font-mono">Gateway Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {withdrawalHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-teal-600">{item.id}</td>
                  <td className="px-4 py-3.5 text-slate-600 font-medium">{formatDate(item.date)}</td>
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900">{item.accountName}</div>
                    <div className="text-[10px] text-slate-500 font-mono font-medium mt-0.5">
                      {item.phone} ({item.network})
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-emerald-600">
                    {formatCedi(item.amount)}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {item.status === 'PAID' && <Badge variant="success">Paid to MoMo</Badge>}
                    {item.status === 'PROCESSING' && <Badge variant="warning">Processing</Badge>}
                    {item.status === 'REJECTED' && <Badge variant="error">Rejected</Badge>}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-500 font-medium text-[11px]">{item.txRef}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
