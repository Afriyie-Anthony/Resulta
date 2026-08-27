import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { formatCedi, formatDate } from '../../../../utils/formatters';
import { FiSearch, FiDownload, FiUsers, FiCheckCircle, FiClock, FiDollarSign, FiShoppingCart, FiTrendingUp, FiActivity, FiPieChart } from 'react-icons/fi';
import { useReferralAnalytics, useSubAffiliates } from '../../../../hooks/useAffiliate';
import { exportSubAffiliatesCsv } from '../../../../services/affiliate.service';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const AffiliateReferralsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Analytics query
  const { data: analytics, isLoading: isLoadingAnalytics } = useReferralAnalytics();

  // Sub-affiliates query
  const { data: listResponse, isLoading: isLoadingList } = useSubAffiliates({
    page,
    limit,
    search: debouncedSearch || undefined,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(searchTerm);
    setPage(1); // Reset to first page on search
  };

  const handleExport = async () => {
    try {
      const blob = await exportSubAffiliatesCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sub_affiliates_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export CSV', error);
    }
  };

  const subAffiliates = listResponse?.items || [];
  const meta = listResponse?.meta;

  const chartData = [
    { name: 'Approved', value: analytics?.recruitmentAnalytics?.subAffiliatesBreakdown?.approved || 0, color: '#10b981' }, // Emerald
    { name: 'Pending', value: analytics?.recruitmentAnalytics?.subAffiliatesBreakdown?.pending || 0, color: '#f59e0b' }, // Amber
    { name: 'Rejected', value: analytics?.recruitmentAnalytics?.subAffiliatesBreakdown?.rejected || 0, color: '#ef4444' }, // Red
  ].filter(item => item.value > 0); // Only show segments that have data

  // Fallback data for the chart if all values are 0 (e.g. brand new user)
  const displayChartData = chartData.length > 0 
    ? chartData 
    : [{ name: 'No Data Yet', value: 1, color: '#e2e8f0' }]; // Slate-200

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiUsers className="text-teal-600" /> Sub-Affiliate Recruitment
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Track your recruitment network and one-time sign-up bonuses.
          </p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<FiDownload />} onClick={handleExport}>
          Export Network CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: KPI Cards (Spans 2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recruitment Analytics Cards */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Recruitment Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center text-lg">
                  <FiUsers />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Recruited</p>
                  <p className="text-xl font-bold text-slate-900">
                    {isLoadingAnalytics ? '...' : analytics?.recruitmentAnalytics?.totalInvitedSubAffiliates || 0}
                  </p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-lg">
                  <FiClock />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Pending Approvals</p>
                  <p className="text-xl font-bold text-slate-900">
                    {isLoadingAnalytics ? '...' : analytics?.recruitmentAnalytics?.subAffiliatesBreakdown?.pending || 0}
                  </p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-lg">
                  <FiDollarSign />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Bonus</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {isLoadingAnalytics ? '...' : formatCedi(analytics?.recruitmentAnalytics?.financials?.totalRecruitmentEarningsGhs || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Referrals Analytics Cards */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Customer Sales Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg">
                  <FiShoppingCart />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Orders</p>
                  <p className="text-xl font-bold text-slate-900">
                    {isLoadingAnalytics ? '...' : analytics?.customerReferralAnalytics?.totalReferredOrders || 0}
                  </p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-lg">
                  <FiTrendingUp />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Sales Volume</p>
                  <p className="text-xl font-bold text-slate-900">
                    {isLoadingAnalytics ? '...' : formatCedi(analytics?.customerReferralAnalytics?.totalSalesVolumeGhs || 0)}
                  </p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-lg">
                  <FiActivity />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Conversions</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {isLoadingAnalytics ? '...' : `${analytics?.customerReferralAnalytics?.conversionRatePercentage || 0}%`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Chart */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            <FiPieChart className="text-slate-400" /> Network Breakdown
          </h3>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[300px]">
            {isLoadingAnalytics ? (
              <div className="flex-1 flex items-center justify-center text-sm font-medium text-slate-400 animate-pulse">
                Loading chart data...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {displayChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [value, name]}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Affiliate Leads Table */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm overflow-hidden mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Showing <strong className="text-slate-900">{subAffiliates.length}</strong> recruited affiliates
          </span>
          <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto relative max-w-sm">
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearch}
              leftIcon={<FiSearch className="text-slate-400" />}
              forceLight
            />
          </form>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-y border-slate-200">
              <tr>
                <th className="px-4 py-3">Sub-Affiliate Name</th>
                <th className="px-4 py-3">Joined Date</th>
                <th className="px-4 py-3 text-center">Application Status</th>
                <th className="px-4 py-3 text-right">Recruitment Bonus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoadingList ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500 font-medium">
                    Loading sub-affiliates...
                  </td>
                </tr>
              ) : subAffiliates.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500 font-medium">
                    No sub-affiliates match your search.
                  </td>
                </tr>
              ) : (
                subAffiliates.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-slate-900">{sub.name}</p>
                      {sub.email && <p className="text-[10px] text-slate-500">{sub.email}</p>}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">
                      {sub.joinedAt ? formatDate(sub.joinedAt) : 'N/A'}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        sub.status === 'APPROVED' || sub.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-700' 
                          : sub.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {sub.recruitmentBonusEarned ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                          <FiCheckCircle /> Earned
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Not Earned</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination controls */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-100">
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
