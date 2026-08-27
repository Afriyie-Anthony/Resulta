import React, { useState } from 'react';
import {
  useAffiliateWithdrawals,
  useAffiliateWithdrawalsSummary,
} from '../../../../hooks/useAffiliate';
import type {
  AffiliateWithdrawalsQueryParams,
  AffiliateWithdrawalItem,
} from '../../../../schemas/affiliate';
import { formatCedi, formatDate } from '../../../../utils/formatters';
import {
  FiSend,
  FiClock,
  FiCreditCard,
  FiRefreshCw,
  FiSmartphone,
  FiDollarSign,
  FiArrowUpRight,
} from 'react-icons/fi';
import { Button } from '../../../../components/ui/Button';
import { useToast } from '../../../../components/ui/Toast';

interface AffiliateWithdrawalsViewProps {
  onRequestPayout: () => void;
  onNavigateTab?: (tab: string) => void;
}

// Safe helper to extract numeric amounts
const extractAmount = (val: unknown): number => {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (typeof val === 'string') {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  }
  if (val && typeof val === 'object') {
    const obj = val as Record<string, unknown>;
    if (typeof obj.totalGhs === 'number') return obj.totalGhs;
    if (typeof obj.amount === 'number') return obj.amount;
    if (typeof obj.total === 'number') return obj.total;
    if (typeof obj.value === 'number') return obj.value;
  }
  return 0;
};

export const AffiliateWithdrawalsView: React.FC<AffiliateWithdrawalsViewProps> = ({
  onRequestPayout,
  onNavigateTab,
}) => {
  const { addToast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const limit = 10;

  const apiParams: AffiliateWithdrawalsQueryParams = {
    page,
    limit,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
  };

  // Queries
  const {
    data: summary,
    isLoading: isLoadingSummary,
    refetch: refetchSummary,
  } = useAffiliateWithdrawalsSummary();

  const {
    data: withdrawalsResponse,
    isLoading: isLoadingList,
    isFetching: isFetchingList,
    refetch: refetchList,
  } = useAffiliateWithdrawals(apiParams);

  // Extract pagination and items
  const withdrawals: AffiliateWithdrawalItem[] = withdrawalsResponse?.items || [];
  const meta = withdrawalsResponse?.meta;

  // Extract Summary KPI metrics
  const availableBalance = extractAmount(
    summary?.availableBalanceGhs ?? summary?.availableBalance
  );
  const inProgress = extractAmount(
    summary?.inProgressGhs ?? summary?.inProgress ?? summary?.pendingGhs
  );
  const totalPaidOut = extractAmount(
    summary?.totalPaidOutGhs ?? summary?.totalPaidOut ?? summary?.totalPaidGhs
  );

  // Extract Connected Payout Account
  const payoutAccount = summary?.payoutAccount ?? summary?.account;
  const isConnected =
    payoutAccount?.connected ??
    !!(payoutAccount?.accountNumber || payoutAccount?.phoneNumber);
  const channel =
    payoutAccount?.channel || payoutAccount?.paymentChannel || 'Mobile Money';
  const accountNumber =
    payoutAccount?.accountNumber || payoutAccount?.phoneNumber || 'Not Set';
  const accountHolder =
    payoutAccount?.accountHolder || payoutAccount?.accountName || 'Affiliate Partner';
  const networkOrBank =
    payoutAccount?.network || payoutAccount?.bankName || 'MTN';

  const handleRefresh = () => {
    refetchSummary();
    refetchList();
    addToast({
      title: 'Withdrawals Refreshed',
      message: 'Latest payout summary and transaction history updated.',
      type: 'info',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Withdrawals & Payouts
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Request and track your Mobile Money commission payout history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<FiRefreshCw className={isFetchingList ? 'animate-spin' : ''} />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Button
            className="bg-[#1a472a] hover:bg-[#143721] text-white rounded-xl px-4 py-2 font-medium text-xs shadow-sm transition-all flex items-center gap-1.5"
            onClick={onRequestPayout}
          >
            <FiSend className="text-xs" /> Request Withdrawal
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Payout Account Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm col-span-1 flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-700 font-medium flex items-center gap-1.5">
                <FiSmartphone className="text-teal-600" /> Payout Account
              </p>
              <span
                className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isConnected
                    ? 'bg-[#dcfce7] text-[#166534]'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {isConnected ? 'Connected' : 'Setup Required'}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-xs text-slate-500 font-normal">{channel}</p>
              <p className="text-lg font-semibold text-slate-900 leading-tight font-mono mt-0.5">
                {isLoadingSummary ? '...' : accountNumber}
              </p>
              <p className="text-xs text-slate-500 font-normal mt-1">
                {networkOrBank} • {accountHolder}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab?.('profile')}
            className="w-full text-center border border-slate-300 hover:border-[#1a472a] text-slate-700 hover:text-[#1a472a] hover:bg-[#1a472a]/5 font-medium text-xs py-2 rounded-xl transition-colors cursor-pointer"
          >
            Update Account
          </button>
        </div>

        {/* Available Balance Card */}
        <div className="bg-white rounded-2xl border border-emerald-500/30 p-5 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-emerald-700 font-medium uppercase tracking-wider">
                Available Balance
              </p>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                <FiDollarSign />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {isLoadingSummary ? '...' : formatCedi(availableBalance)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Cleared & ready for cashout</p>
          </div>
          <button
            type="button"
            onClick={onRequestPayout}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiSend className="text-xs" /> Cash Out Now
          </button>
        </div>

        {/* In Progress Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                In Progress
              </p>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
                <FiClock />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-600">
              {isLoadingSummary ? '...' : formatCedi(inProgress)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Pending admin disbursement review</p>
          </div>
        </div>

        {/* Total Paid Out Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                Total Paid Out
              </p>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
                <FiArrowUpRight />
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {isLoadingSummary ? '...' : formatCedi(totalPaidOut)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Successfully transferred to your MoMo wallet</p>
          </div>
        </div>
      </div>

      {/* Withdrawal History Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header with Status Filter Pills */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Withdrawal History</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete audit log of all commission cashout requests and statuses
            </p>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            {(['ALL', 'PENDING', 'APPROVED', 'PAID', 'REJECTED'] as const).map((st) => (
              <button
                type="button"
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st === 'ALL' ? 'All Records' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50/75 text-slate-500 uppercase font-semibold text-[11px]">
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">AMOUNT</th>
                <th className="px-6 py-4">PAYMENT METHOD</th>
                <th className="px-6 py-4 text-center">STATUS</th>
                <th className="px-6 py-4">REFERENCE / NOTE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoadingList ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs text-slate-400">Loading payout records...</p>
                    </div>
                  </td>
                </tr>
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    <div className="max-w-sm mx-auto text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
                        <FiCreditCard />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">No Withdrawal Requests Found</p>
                      <p className="text-xs text-slate-400">
                        {statusFilter !== 'ALL'
                          ? `No ${statusFilter.toLowerCase()} withdrawal requests found.`
                          : 'You have not submitted any withdrawal requests yet.'}
                      </p>
                      {availableBalance >= 20 && (
                        <button
                          type="button"
                          onClick={onRequestPayout}
                          className="mt-2 text-xs text-teal-600 font-semibold hover:underline cursor-pointer"
                        >
                          Request Your First Withdrawal
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                withdrawals.map((item: AffiliateWithdrawalItem, index: number) => {
                  const ref =
                    (typeof item.reference === 'string' && item.reference) ||
                    (typeof item.transactionRef === 'string' && item.transactionRef) ||
                    (typeof item.id === 'string' && item.id) ||
                    `WTH-${index + 1}`;

                  const dateStr =
                    typeof item.date === 'string'
                      ? item.date
                      : item.requestedAt
                      ? formatDate(item.requestedAt)
                      : item.createdAt
                      ? formatDate(item.createdAt)
                      : 'N/A';

                  const amt = extractAmount(item.amount);
                  const method =
                    item.paymentMethod ||
                    item.channel ||
                    (item.momoNetwork && item.momoPhone
                      ? `${item.momoNetwork} (${item.momoPhone})`
                      : 'Mobile Money');

                  const status = (typeof item.status === 'string' ? item.status : 'PENDING').toUpperCase();
                  const note = item.note || item.description || 'Commission Payout Request';

                  return (
                    <tr key={item.id || ref || index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-500 font-normal text-xs">{dateStr}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{formatCedi(amt)}</td>
                      <td className="px-6 py-4 text-slate-700 font-normal text-xs">
                        <span className="flex items-center gap-1.5">
                          <FiSmartphone className="text-teal-600" />
                          {method}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                            status === 'PAID' || status === 'SUCCESSFUL' || status === 'COMPLETED'
                              ? 'bg-[#dbeafe] text-[#1e40af]'
                              : status === 'APPROVED'
                              ? 'bg-[#dcfce7] text-[#166534]'
                              : status === 'PENDING'
                              ? 'bg-[#fef3c7] text-[#92400e]'
                              : 'bg-[#fee2e2] text-[#991b1b]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              status === 'PAID' || status === 'SUCCESSFUL' || status === 'COMPLETED'
                                ? 'bg-[#3b82f6]'
                                : status === 'APPROVED'
                                ? 'bg-[#22c55e]'
                                : status === 'PENDING'
                                ? 'bg-[#f59e0b]'
                                : 'bg-[#ef4444]'
                            }`}
                          ></span>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-500 max-w-xs truncate">
                        <span className="font-semibold text-amber-600 mr-2">{ref}</span>
                        {note !== ref && <span className="text-slate-400">{note}</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {meta && typeof meta.totalPages === 'number' && meta.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-slate-100 bg-white gap-3">
            <span className="text-xs text-slate-500 font-normal">
              Showing page <strong className="text-slate-800 font-semibold">{meta.page}</strong> of{' '}
              <strong className="text-slate-800 font-semibold">{meta.totalPages}</strong>
              {typeof meta.total === 'number' ? ` (${meta.total} total records)` : ''}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={meta.page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={meta.page >= meta.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
