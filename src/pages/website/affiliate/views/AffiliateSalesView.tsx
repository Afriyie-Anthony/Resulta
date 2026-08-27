import React, { useState } from 'react';
import { useAffiliateSales, useAffiliateSalesAnalytics } from '../../../../hooks/useAffiliate';
import { exportAffiliateSalesCsv } from '../../../../services/affiliate.service';
import { formatCedi, formatDate } from '../../../../utils/formatters';
import { FiSearch, FiDownload, FiShoppingCart, FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

export const AffiliateSalesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Mapping UI time filters to API period enum
  type UiTimeFilter = 'All Time' | 'Today' | 'This Week' | 'This Month';
  const periodMap: Record<UiTimeFilter, string> = {
    'All Time': 'ALL',
    'Today': 'TODAY',
    'This Week': 'THIS_WEEK',
    'This Month': 'THIS_MONTH'
  };
  const [timeFilter, setTimeFilter] = useState<UiTimeFilter>('All Time');
  
  const [page, setPage] = useState(1);
  const limit = 10;

  // Derive API query parameters
  const apiParams = {
    search: debouncedSearch || undefined,
    period: periodMap[timeFilter],
    voucherType: 'ALL',
    channel: 'ALL',
    status: 'ALL'
  };

  // Queries
  const { data: analytics, isLoading: isLoadingAnalytics } = useAffiliateSalesAnalytics(apiParams);
  const { data: listResponse, isLoading: isLoadingList } = useAffiliateSales({ ...apiParams, page, limit });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(searchTerm);
    setPage(1);
  };

  const handleExport = async () => {
    try {
      const blob = await exportAffiliateSalesCsv(apiParams);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `affiliate_sales_${periodMap[timeFilter]}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export CSV', error);
    }
  };

  const sales = listResponse?.items || [];
  const meta = listResponse?.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-black text-[#0A2540] tracking-tight font-serif">Sales History</h2>
          <p className="text-sm text-slate-500 mt-1">
            All voucher sales generated through your affiliate USSD channel.
          </p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<FiDownload />} onClick={handleExport}>
          Export Sales CSV
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">
            <FiShoppingCart />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Total Sales</p>
            <p className="text-2xl font-bold text-slate-900">
              {isLoadingAnalytics ? '...' : analytics?.totalSales || 0}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl">
            <FiTrendingUp />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Sales Value</p>
            <p className="text-2xl font-bold text-blue-700">
              {isLoadingAnalytics ? '...' : formatCedi(analytics?.salesValueGhs || 0)}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl">
            <FiDollarSign />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Commission Earned</p>
            <p className="text-2xl font-bold text-emerald-600">
              {isLoadingAnalytics ? '...' : formatCedi(analytics?.commissionEarnedGhs || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Input
            placeholder="Search by ref, voucher type or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<FiSearch className="text-slate-400" />}
            forceLight
          />
        </form>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
          {(['All Time', 'Today', 'This Week', 'This Month'] as UiTimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setTimeFilter(filter);
                setPage(1);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${
                timeFilter === filter
                  ? 'bg-[#1a472a] text-white border-[#1a472a]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="text-slate-500 uppercase font-bold text-[10px] bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-6 py-4">TRANSACTION REF</th>
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">VOUCHER TYPE</th>
                <th className="px-6 py-4">CUSTOMER</th>
                <th className="px-6 py-4">SALE AMOUNT</th>
                <th className="px-6 py-4">COMMISSION</th>
                <th className="px-6 py-4 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoadingList ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 font-medium">
                    Loading sales data...
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 font-medium">
                    No sales found for the selected filters.
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#F2C14E]">{sale.transactionRef || sale.id}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium text-xs">
                      {sale.date || (sale.createdAt ? formatDate(sale.createdAt) : 'N/A')}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">{sale.voucherType || sale.product}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{sale.customerPhone}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{formatCedi(sale.saleAmount || sale.totalAmount || 0)}</td>
                    <td className="px-6 py-4 font-bold text-emerald-500">+{formatCedi(sale.commission || 0)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        sale.status === 'SUCCESSFUL' || sale.status === 'APPROVED'
                          ? 'bg-[#dcfce7] text-[#166534]'
                          : sale.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination controls */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-2 flex justify-between items-center p-4 border-t border-slate-100 bg-white">
            <span className="text-xs text-slate-500 font-medium">
              Page {meta.page} of {meta.totalPages}
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
