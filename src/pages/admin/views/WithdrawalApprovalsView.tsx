import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Pagination } from '../../../components/ui/Pagination';
import { useToast } from '../../../components/ui/Toast';
import { formatCedi } from '../../../utils/formatters';
import {
  FiXCircle,
  FiClock,
  FiSend,
  FiSmartphone,
  FiShield
} from 'react-icons/fi';

interface Withdrawal {
  id: string;
  affiliateName: string;
  referralCode: string;
  phone: string;
  momoNetwork: string;
  amount: number;
  requestedDate: string;
  status: 'PENDING' | 'PAID' | 'REJECTED';
  rejectionReason?: string;
}

export const WithdrawalApprovalsView: React.FC = () => {
  const { addToast } = useToast();
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([
    { id: 'WD-2026-104', affiliateName: 'Kwaku Frimpong', referralCode: 'REF-GH-8823', phone: '+233 24 991 0293', momoNetwork: 'MTN MoMo', amount: 420.0, requestedDate: '2026-08-01 16:10', status: 'PENDING' },
    { id: 'WD-2026-105', affiliateName: 'Esi Ansah', referralCode: 'REF-GH-4412', phone: '+233 55 201 8839', momoNetwork: 'MTN MoMo', amount: 220.0, requestedDate: '2026-08-01 11:30', status: 'PENDING' },
    { id: 'WD-2026-101', affiliateName: 'Kwesi Owosu', referralCode: 'REF-GH-3392', phone: '+233 50 491 8820', momoNetwork: 'Telecel Cash', amount: 350.0, requestedDate: '2026-07-29 09:15', status: 'PAID' },
    { id: 'WD-2026-100', affiliateName: 'Akosua Boakye', referralCode: 'REF-GH-1102', phone: '+233 27 102 9384', momoNetwork: 'AirtelTigo', amount: 150.0, requestedDate: '2026-07-28 14:00', status: 'PAID' },
  ]);

  const totalPages = Math.ceil(withdrawals.length / itemsPerPage);
  const paginatedWithdrawals = withdrawals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pendingList = withdrawals.filter(w => w.status === 'PENDING');

  const handleApprove = (id: string, name: string, amount: number) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'PAID' } : w));
    setSelectedWithdrawal(null);
    addToast({
      title: 'MoMo Payout Released',
      message: `${formatCedi(amount)} has been initiated to ${name}'s mobile money wallet via payment gateway.`,
      type: 'success',
    });
  };

  const handleRejectConfirm = (id: string, name: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'REJECTED', rejectionReason: rejectReason || 'Administrative review mismatch' } : w));
    setSelectedWithdrawal(null);
    setIsRejecting(false);
    setRejectReason('');
    addToast({
      title: 'Withdrawal Request Declined',
      message: `Request for ${name} declined. Funds returned to affiliate available balance.`,
      type: 'info',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Affiliate Withdrawal Payouts</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review pending commission disbursement requests and authorize mobile money transfers (Section 33 & 40).
          </p>
        </div>
        <Badge variant="warning" className="w-fit text-xs py-1.5 px-3">
          {pendingList.length} Awaiting Release ({formatCedi(pendingList.reduce((acc, curr) => acc + curr.amount, 0))})
        </Badge>
      </div>

      {/* Payout Table */}
      <Card glass className="border-slate-800/80 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FiClock className="text-amber-400" /> Pending & Historical Disbursements
          </h3>
          <span className="text-xs text-slate-400">All actions strictly recorded in financial audit trail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 font-bold">
                <th className="py-3.5 px-4">Withdrawal Ref</th>
                <th className="py-3.5 px-4">Affiliate Account</th>
                <th className="py-3.5 px-4">Target MoMo Wallet</th>
                <th className="py-3.5 px-4">Requested Payout</th>
                <th className="py-3.5 px-4">Date Submitted</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {paginatedWithdrawals.map((w) => (
                <tr key={w.id} className={`hover:bg-slate-900/60 transition-colors ${w.status === 'PENDING' ? 'bg-amber-950/10' : ''}`}>
                  <td className="py-3.5 px-4 font-mono font-bold text-teal-400">{w.id}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{w.affiliateName}</span>
                    <span className="text-[10px] text-teal-400 font-mono font-semibold">{w.referralCode}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-200 block">{w.phone}</span>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <FiSmartphone className="w-3 h-3 text-emerald-400" /> {w.momoNetwork}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm font-extrabold text-white">{formatCedi(w.amount)}</td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">{w.requestedDate}</td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={w.status === 'PAID' ? 'success' : w.status === 'PENDING' ? 'warning' : 'error'}
                      className="text-[10px]"
                    >
                      {w.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {w.status === 'PENDING' ? (
                      <>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setSelectedWithdrawal(w);
                            setIsRejecting(true);
                          }}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="gradient"
                          size="sm"
                          leftIcon={<FiSend />}
                          onClick={() => handleApprove(w.id, w.affiliateName, w.amount)}
                        >
                          Release Funds
                        </Button>
                      </>
                    ) : (
                      <span className="text-slate-500 text-[11px] font-semibold">
                        {w.status === 'PAID' ? 'Dispersed' : 'Closed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-800">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={withdrawals.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newSize) => {
              setItemsPerPage(newSize);
              setCurrentPage(1);
            }}
          />
        </div>
      </Card>

      {/* Rejection / Detail Modal */}
      <Modal
        isOpen={!!selectedWithdrawal && isRejecting}
        onClose={() => {
          setSelectedWithdrawal(null);
          setIsRejecting(false);
        }}
        title="Decline Affiliate Withdrawal"
      >
        {selectedWithdrawal && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              You are about to reject the payout request of <strong className="text-white">{selectedWithdrawal.affiliateName}</strong> for <strong className="text-amber-400">{formatCedi(selectedWithdrawal.amount)}</strong>.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Reason for Rejection (Visible to Affiliate)</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Bank details incorrect, pending audit review..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 text-[11px] text-slate-400">
              <FiShield className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Declining will return {formatCedi(selectedWithdrawal.amount)} back to their available commission balance.</span>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button type="button" variant="ghost" onClick={() => setIsRejecting(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                leftIcon={<FiXCircle />}
                onClick={() => handleRejectConfirm(selectedWithdrawal.id, selectedWithdrawal.affiliateName)}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
