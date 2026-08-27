import React, { useState } from 'react';
import {
  useAffiliateEarnings,
  useAffiliateEarningsAnalytics,
} from '../../../../hooks/useAffiliate';
import { exportAffiliateEarningsCsv } from '../../../../services/affiliate.service';
import type {
  AffiliateEarningsQueryParams,
  AffiliateCommissionLogItem,
} from '../../../../schemas/affiliate';
import { formatCedi, formatDate } from '../../../../utils/formatters';
import {
  FiSearch,
  FiDownload,
  FiPercent,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiArrowUpRight,
  FiDollarSign,
  FiFilter,
  FiRefreshCw,
  FiSend,
} from 'react-icons/fi';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { useToast } from '../../../../components/ui/Toast';

interface AffiliateEarningsViewProps {
  onRequestPayout?: () => void;
}

type UiTimeFilter = 'All Time' | 'Today' | 'This Week' | 'This Month';

const periodMap: Record<UiTimeFilter, string> = {
  'All Time': 'ALL',
  'Today': 'TODAY',
  'This Week': 'THIS_WEEK',
  'This Month': 'THIS_MONTH',
};

// Safe helper to extract status count regardless of structure
const getStatusCount = (statusKey: string, dist: unknown): number => {
  if (!dist) return 0;

  if (Array.isArray(dist)) {
    const found = dist.find(
      (item: Record<string, unknown>) =>
        String(item?.status || item?.key || item?.name || '').toUpperCase() === statusKey.toUpperCase()
    );
    if (found) {
      if (typeof found.count === 'number') return found.count;
      if (typeof found.total === 'number') return found.total;
      if (typeof found.count === 'string') return parseInt(found.count, 10) || 0;
    }
    return 0;
  }

  if (typeof dist === 'object' && dist !== null) {
    const record = dist as Record<string, unknown>;
    const rawVal =
      record[statusKey.toLowerCase()] ??
      record[statusKey.toUpperCase()] ??
      record[statusKey];

    if (typeof rawVal === 'number') return rawVal;
    if (typeof rawVal === 'string') {
      const parsed = parseInt(rawVal, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    if (rawVal && typeof rawVal === 'object') {
      const valObj = rawVal as Record<string, unknown>;
      if (typeof valObj.count === 'number') return valObj.count;
      if (typeof valObj.total === 'number') return valObj.total;
      if (typeof valObj.quantity === 'number') return valObj.quantity;
      if (typeof valObj.count === 'string') return parseInt(valObj.count, 10) || 0;
    }
  }

  return 0;
};

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

// Safe helper to render commission rate string
const renderRateString = (rateVal: unknown): string => {
  if (typeof rateVal === 'number') return `${rateVal}%`;
  if (typeof rateVal === 'string') return rateVal.includes('%') ? rateVal : `${rateVal}%`;
  if (rateVal && typeof rateVal === 'object') {
    const obj = rateVal as Record<string, unknown>;
    if (typeof obj.text === 'string') return obj.text;
    if (typeof obj.rate === 'number') return `${obj.rate}%`;
    if (typeof obj.rate === 'string') return obj.rate;
    if (typeof obj.value === 'number') return `${obj.value}%`;
  }
  return '10%';
};

export const AffiliateEarningsView: React.FC<AffiliateEarningsViewProps> = ({
  onRequestPayout,
}) => {
  const { addToast } = useToast();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [timeFilter, setTimeFilter] = useState<UiTimeFilter>('All Time');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const limit = 10;

  // Derive API query parameters
  const apiParams: AffiliateEarningsQueryParams = {
    page,
    limit,
    type: typeFilter !== 'ALL' ? typeFilter : undefined,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
    period: periodMap[timeFilter] !== 'ALL' ? periodMap[timeFilter] : undefined,
    search: debouncedSearch || undefined,
  };

  // Queries
  const {
    data: analytics,
    isLoading: isLoadingAnalytics,
    refetch: refetchAnalytics,
  } = useAffiliateEarningsAnalytics();

  const {
    data: earningsResponse,
    isLoading: isLoadingList,
    isFetching: isFetchingList,
    refetch: refetchList,
  } = useAffiliateEarnings(apiParams);

  // Extract pagination and items
  const commissionLogs: AffiliateCommissionLogItem[] = earningsResponse?.items || [];
  const meta = earningsResponse?.meta;

  // Extract Summary KPI metrics with robust fallback values
  const commissionRate =
    analytics?.rate ??
    analytics?.commissionRate ??
    analytics?.commissionRateText ??
    '10%';

  const totalCommissionEarned = extractAmount(
    analytics?.totalCommissionEarnedGhs ??
    analytics?.totalCommissionEarned ??
    analytics?.totalEarnedGhs
  );

  const pendingCommission = extractAmount(
    analytics?.pendingCommissionGhs ??
    analytics?.pendingCommission
  );

  const approvedCommission = extractAmount(
    analytics?.approvedCommissionGhs ??
    analytics?.approvedCommission
  );

  const withdrawnAmount = extractAmount(
    analytics?.withdrawnAmountGhs ??
    analytics?.withdrawnAmount ??
    analytics?.paidCommissionGhs
  );

  const withdrawableBalance = extractAmount(
    analytics?.withdrawableBalanceGhs ??
    analytics?.withdrawableBalance ??
    analytics?.availableCashoutGhs
  );

  const statusDist = analytics?.statusDistribution ?? analytics?.statusBreakdown;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(searchTerm.trim());
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setTimeFilter('All Time');
    setStatusFilter('ALL');
    setTypeFilter('ALL');
    setPage(1);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await exportAffiliateEarningsCsv(apiParams);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `commission_log_${periodMap[timeFilter]}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      addToast({
        title: 'Export Downloaded',
        message: 'Your commission log has been exported to CSV.',
        type: 'success',
      });
    } catch (error) {
      console.error('Failed to export CSV', error);
      addToast({
        title: 'Export Failed',
        message: 'Could not export commission log. Please try again.',
        type: 'error',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = () => {
    refetchAnalytics();
    refetchList();
    addToast({
      title: 'Earnings Refreshed',
      message: 'Latest commission analytics and records updated.',
      type: 'info',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Earnings & Commissions
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Your real-time commission breakdown, approval status, and financial ledger.
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
            variant="outline"
            size="sm"
            leftIcon={<FiDownload />}
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
      </div>

      {/* 6 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Commission Per Sale (Rate) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Commission Rate
            </p>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-sm">
              <FiPercent />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {isLoadingAnalytics ? '...' : renderRateString(commissionRate)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Default tier rate applied on retail price</p>
        </div>

        {/* Total Commission Earned */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Total Commission Earned
            </p>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">
              <FiTrendingUp />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {isLoadingAnalytics ? '...' : formatCedi(totalCommissionEarned)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Cumulative commission generated to date</p>
        </div>

        {/* Pending Commission */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Pending Commission
            </p>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
              <FiClock />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600">
            {isLoadingAnalytics ? '...' : formatCedi(pendingCommission)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Awaiting order settlement and verification</p>
        </div>

        {/* Approved Commission */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Approved Commission
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
              <FiCheckCircle />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {isLoadingAnalytics ? '...' : formatCedi(approvedCommission)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Verified & confirmed commission revenue</p>
        </div>

        {/* Withdrawn Amount */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Withdrawn Amount
            </p>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
              <FiArrowUpRight />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {isLoadingAnalytics ? '...' : formatCedi(withdrawnAmount)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Total MoMo payouts successfully processed</p>
        </div>

        {/* Withdrawable Balance */}
        <div className="bg-white rounded-2xl border-2 border-emerald-500/30 p-5 shadow-sm hover:border-emerald-500/50 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-emerald-700 font-medium uppercase tracking-wider">
                Withdrawable Balance
              </p>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                <FiDollarSign />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {isLoadingAnalytics ? '...' : formatCedi(withdrawableBalance)}
            </p>
          </div>
          {onRequestPayout && (
            <button
              onClick={onRequestPayout}
              className="mt-3 w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-2 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1 cursor-pointer"
            >
              <FiSend className="text-xs" /> Cash Out Now
            </button>
          )}
        </div>
      </div>

      {/* Commission Status Distribution Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FiFilter className="text-slate-400" />
            Commission Status Filter
          </h3>
          {statusFilter !== 'ALL' && (
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setPage(1);
              }}
              className="text-xs text-teal-600 font-semibold hover:underline cursor-pointer"
            >
              Clear status filter
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* All Statuses */}
          <button
            type="button"
            onClick={() => {
              setStatusFilter('ALL');
              setPage(1);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Logs
          </button>

          {/* Pending */}
          <button
            type="button"
            onClick={() => {
              setStatusFilter(statusFilter === 'PENDING' ? 'ALL' : 'PENDING');
              setPage(1);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              statusFilter === 'PENDING'
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-[#fef3c7] text-[#92400e] border-[#fde68a] hover:bg-[#fde68a]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                statusFilter === 'PENDING' ? 'bg-white' : 'bg-[#f59e0b]'
              }`}
            ></span>
            Pending ({getStatusCount('PENDING', statusDist)})
          </button>

          {/* Approved */}
          <button
            type="button"
            onClick={() => {
              setStatusFilter(statusFilter === 'APPROVED' ? 'ALL' : 'APPROVED');
              setPage(1);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              statusFilter === 'APPROVED'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0] hover:bg-[#bbf7d0]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                statusFilter === 'APPROVED' ? 'bg-white' : 'bg-[#22c55e]'
              }`}
            ></span>
            Approved ({getStatusCount('APPROVED', statusDist)})
          </button>

          {/* Paid */}
          <button
            type="button"
            onClick={() => {
              setStatusFilter(statusFilter === 'PAID' ? 'ALL' : 'PAID');
              setPage(1);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              statusFilter === 'PAID'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-[#dbeafe] text-[#1e40af] border-[#bfdbfe] hover:bg-[#bfdbfe]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                statusFilter === 'PAID' ? 'bg-white' : 'bg-[#3b82f6]'
              }`}
            ></span>
            Paid ({getStatusCount('PAID', statusDist)})
          </button>

          {/* Rejected */}
          <button
            type="button"
            onClick={() => {
              setStatusFilter(statusFilter === 'REJECTED' ? 'ALL' : 'REJECTED');
              setPage(1);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              statusFilter === 'REJECTED'
                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                : 'bg-[#fee2e2] text-[#991b1b] border-[#fecaca] hover:bg-[#fecaca]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                statusFilter === 'REJECTED' ? 'bg-white' : 'bg-[#ef4444]'
              }`}
            ></span>
            Rejected ({getStatusCount('REJECTED', statusDist)})
          </button>

          {/* Reversed */}
          <button
            type="button"
            onClick={() => {
              setStatusFilter(statusFilter === 'REVERSED' ? 'ALL' : 'REVERSED');
              setPage(1);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              statusFilter === 'REVERSED'
                ? 'bg-slate-600 text-white border-slate-600 shadow-sm'
                : 'bg-[#f1f5f9] text-[#475569] border-[#e2e8f0] hover:bg-[#e2e8f0]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                statusFilter === 'REVERSED' ? 'bg-white' : 'bg-[#94a3b8]'
              }`}
            ></span>
            Reversed ({getStatusCount('REVERSED', statusDist)})
          </button>
        </div>
      </div>

      {/* Search and Advanced Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Input
            placeholder="Search by transaction ref, voucher, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<FiSearch className="text-slate-400" />}
            forceLight
          />
        </form>

        {/* Voucher/Commission Type Filter */}
        <div className="w-full md:w-44">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
          >
            <option value="ALL">All Types</option>
            <option value="VOUCHER_SALE">Voucher Sale</option>
            <option value="WASSCE">WASSCE Checker</option>
            <option value="BECE">BECE Checker</option>
            <option value="RECRUITMENT_BONUS">Recruitment Bonus</option>
          </select>
        </div>

        {/* Time Period Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          {(['All Time', 'Today', 'This Week', 'This Month'] as UiTimeFilter[]).map((filter) => (
            <button
              type="button"
              key={filter}
              onClick={() => {
                setTimeFilter(filter);
                setPage(1);
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border cursor-pointer ${
                timeFilter === filter
                  ? 'bg-[#1a472a] text-white border-[#1a472a] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Commission Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Commission Log</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Detailed ledger of commissions credited or pending for your account
            </p>
          </div>
          {isFetchingList && (
            <span className="text-[11px] text-teal-600 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
              Updating...
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="text-slate-500 uppercase font-bold text-[10px] bg-slate-50/75">
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">TRANSACTION REF</th>
                <th className="px-6 py-4">VOUCHER TYPE</th>
                <th className="px-6 py-4">SALE AMOUNT</th>
                <th className="px-6 py-4">COMMISSION</th>
                <th className="px-6 py-4 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoadingList ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs text-slate-400">Loading commission log...</p>
                    </div>
                  </td>
                </tr>
              ) : commissionLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    <div className="max-w-sm mx-auto text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
                        <FiDollarSign />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No Commission Logs Found</p>
                      <p className="text-xs text-slate-400">
                        {debouncedSearch || statusFilter !== 'ALL' || typeFilter !== 'ALL' || timeFilter !== 'All Time'
                          ? 'No records match your selected filters. Try clearing your filters.'
                          : 'You have not earned any commissions yet. Share your referral link or USSD code to start earning!'}
                      </p>
                      {(debouncedSearch || statusFilter !== 'ALL' || typeFilter !== 'ALL' || timeFilter !== 'All Time') && (
                        <button
                          type="button"
                          onClick={handleClearFilters}
                          className="mt-2 text-xs text-teal-600 font-bold hover:underline cursor-pointer"
                        >
                          Reset All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                commissionLogs.map((log: AffiliateCommissionLogItem, index: number) => {
                  const ref =
                    (typeof log.transactionRef === 'string' && log.transactionRef) ||
                    (typeof log.reference === 'string' && log.reference) ||
                    (typeof log.orderNumber === 'string' && log.orderNumber) ||
                    (typeof log.id === 'string' && log.id) ||
                    `TX-${index + 1}`;

                  const dateStr =
                    typeof log.date === 'string'
                      ? log.date
                      : log.createdAt
                      ? formatDate(log.createdAt)
                      : 'N/A';

                  const product =
                    (typeof log.voucherType === 'string' && log.voucherType) ||
                    (typeof log.product === 'string' && log.product) ||
                    (typeof log.type === 'string' && log.type) ||
                    'Voucher';

                  const saleAmt = extractAmount(log.saleAmount ?? log.totalAmount);
                  const commAmt = extractAmount(log.commission ?? log.commissionAmount);
                  const status = (typeof log.status === 'string' ? log.status : 'PENDING').toUpperCase();

                  return (
                    <tr key={log.id || ref || index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-500 font-medium text-xs">{dateStr}</td>
                      <td className="px-6 py-4 font-bold text-[#F2C14E] font-mono tracking-tight">{ref}</td>
                      <td className="px-6 py-4 font-bold text-slate-700">{product}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{formatCedi(saleAmt)}</td>
                      <td className="px-6 py-4 font-bold text-emerald-600">+{formatCedi(commAmt)}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            status === 'APPROVED' || status === 'SUCCESSFUL' || status === 'EARNED'
                              ? 'bg-[#dcfce7] text-[#166534]'
                              : status === 'PAID'
                              ? 'bg-[#dbeafe] text-[#1e40af]'
                              : status === 'PENDING'
                              ? 'bg-[#fef3c7] text-[#92400e]'
                              : status === 'REVERSED'
                              ? 'bg-[#f1f5f9] text-[#475569]'
                              : 'bg-[#fee2e2] text-[#991b1b]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              status === 'APPROVED' || status === 'SUCCESSFUL' || status === 'EARNED'
                                ? 'bg-[#22c55e]'
                                : status === 'PAID'
                                ? 'bg-[#3b82f6]'
                                : status === 'PENDING'
                                ? 'bg-[#f59e0b]'
                                : status === 'REVERSED'
                                ? 'bg-[#94a3b8]'
                                : 'bg-[#ef4444]'
                            }`}
                          ></span>
                          {status}
                        </span>
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
            <span className="text-xs text-slate-500 font-medium">
              Showing page <strong className="text-slate-800 font-bold">{meta.page}</strong> of{' '}
              <strong className="text-slate-800 font-bold">{meta.totalPages}</strong>
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
