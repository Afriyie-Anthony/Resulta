import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { useAdminAffiliateAnalytics } from '../../../hooks/useAdminAffiliates';
import { formatCedi } from '../../../utils/formatters';
import { Button } from '../../../components/ui/Button';
import {
  FiArrowLeft,
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiShoppingBag,
  FiAward
} from 'react-icons/fi';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const COLORS = ['#0F8B8D', '#F59E0B', '#8B5CF6', '#10B981', '#F43F5E'];

export const AffiliatesAnalyticsView: React.FC = () => {
  const { isLight } = useAdminTheme();
  const navigate = useNavigate();
  const [period, setPeriod] = useState('ALL');
  
  const { data, isLoading, error } = useAdminAffiliateAnalytics(period);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm font-bold text-slate-500 animate-pulse">Loading Analytics Data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center border rounded-3xl border-red-200 bg-red-50 text-red-600">
        <h3 className="font-black text-xl mb-2">Error Loading Analytics</h3>
        <p className="text-sm font-semibold">Failed to fetch the executive analytics payload.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/affiliates')}>Go Back</Button>
      </div>
    );
  }

  const overview = data.overview;
  
  // Transform data for Recharts
  const voucherData = [
    { name: 'BECE', value: data.voucherTypeBreakdown.bece.salesVolumeGhs },
    { name: 'WASSCE', value: data.voucherTypeBreakdown.wassce.salesVolumeGhs },
  ];

  const commissionData = [
    { name: 'Voucher Sales', value: data.commissionTypeBreakdown.voucherSales.totalGhs },
    { name: 'Recruitment', value: data.commissionTypeBreakdown.recruitmentBonuses.totalGhs },
  ];

  const paymentData = [
    { name: 'Mobile Money', value: data.paymentChannelPreferences.mobileMoneyCount },
    { name: 'Bank Transfer', value: data.paymentChannelPreferences.bankCount },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/admin/affiliates')}
            className={`w-10 h-10 p-0 rounded-xl ${isLight ? 'bg-white shadow-sm border border-slate-200' : 'bg-slate-900 border border-slate-800'}`}
          >
            <FiArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Executive Analytics
              </h1>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${isLight ? 'bg-amber-100 text-amber-700' : 'bg-amber-500/20 text-amber-400'}`}>
                Beta
              </span>
            </div>
            <p className={`text-xs font-semibold mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Deep dive into affiliate performance, sales attribution, and commission breakdowns.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)} 
            className={`h-10 px-4 rounded-xl text-xs font-bold border outline-none shadow-sm transition-colors ${
              isLight 
                ? 'bg-white border-slate-300 text-slate-800 focus:border-[#0F8B8D]' 
                : 'bg-slate-900 border-slate-800 text-white focus:border-teal-500'
            }`}
          >
            <option value="ALL">All Time</option>
            <option value="30D">Last 30 Days</option>
            <option value="90D">Last 90 Days</option>
            <option value="YTD">Year to Date</option>
          </select>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-3xl border shadow-sm transition-all hover:-translate-y-1 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[11px] font-black uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Earnings</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isLight ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-500/20 text-emerald-400'}`}>
              <FiDollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{formatCedi(overview.totalCommissionsEarnedGhs)}</p>
          <div className="mt-2 flex items-center gap-2 text-xs font-semibold">
            <span className="text-emerald-500 flex items-center gap-1"><FiTrendingUp /> +0.0%</span>
            <span className={isLight ? 'text-slate-400' : 'text-slate-500'}>vs last period</span>
          </div>
        </div>

        <div className={`p-5 rounded-3xl border shadow-sm transition-all hover:-translate-y-1 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[11px] font-black uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Attributed Sales</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isLight ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-blue-400'}`}>
              <FiShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{formatCedi(overview.totalAttributedSalesVolumeGhs)}</p>
          <div className="mt-2 text-xs font-semibold">
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>{overview.totalAttributedOrdersCount} successful orders</span>
          </div>
        </div>

        <div className={`p-5 rounded-3xl border shadow-sm transition-all hover:-translate-y-1 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[11px] font-black uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Partners</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isLight ? 'bg-purple-100 text-purple-600' : 'bg-purple-500/20 text-purple-400'}`}>
              <FiUsers className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{overview.totalAffiliates}</p>
          <div className="mt-2 text-xs font-semibold">
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>{overview.approvedAffiliates} active partners</span>
          </div>
        </div>

        <div className={`p-5 rounded-3xl border shadow-sm transition-all hover:-translate-y-1 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[11px] font-black uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Pending Action</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isLight ? 'bg-amber-100 text-amber-600' : 'bg-amber-500/20 text-amber-400'}`}>
              <FiAward className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{overview.pendingApprovals}</p>
          <div className="mt-2 text-xs font-semibold text-amber-500">
            Awaiting manual approval
          </div>
        </div>
      </div>

      {/* Leaderboards and Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 p-6 rounded-3xl border shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <h3 className={`text-sm font-black uppercase tracking-wider mb-6 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Top Earners Overview</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.leaderboards.topEarnersBySalesVolume.slice(0, 5)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isLight ? '#e2e8f0' : '#1e293b'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isLight ? '#64748b' : '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isLight ? '#64748b' : '#94a3b8' }} tickFormatter={(val) => `GH₵${val}`} />
                <Tooltip 
                  cursor={{ fill: isLight ? '#f1f5f9' : '#0f172a' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: isLight ? '#fff' : '#1e293b', color: isLight ? '#000' : '#fff', fontSize: '12px', fontWeight: 'bold' }} 
                />
                <Bar dataKey="totalEarningsGhs" name="Earnings" fill="#0F8B8D" radius={[4, 4, 0, 0]} />
                <Bar dataKey="salesVolumeGhs" name="Sales Vol." fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-6 rounded-3xl border shadow-sm flex flex-col ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <h3 className={`text-sm font-black uppercase tracking-wider mb-4 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Top Recruiters</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {data.leaderboards.topRecruiters.length === 0 ? (
              <p className="text-xs text-center font-semibold opacity-50 mt-10">No recruitment data yet.</p>
            ) : (
              data.leaderboards.topRecruiters.map((affiliate, idx) => (
                <div key={affiliate.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    idx === 0 ? 'bg-amber-100 text-amber-600 border border-amber-200' : 
                    idx === 1 ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                    idx === 2 ? 'bg-orange-100 text-orange-600 border border-orange-200' :
                    'bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{affiliate.name}</p>
                    <p className={`text-[10px] font-semibold uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Code: {affiliate.affiliateCode}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{affiliate.invitedSubAffiliatesCount}</p>
                    <p className={`text-[10px] font-semibold uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Recruits</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-3xl border shadow-sm flex flex-col items-center ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <h3 className={`text-sm font-black uppercase tracking-wider mb-2 w-full text-left ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Voucher Mix</h3>
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={voucherData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                  {voucherData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => formatCedi(Number(value) || 0)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: isLight ? '#fff' : '#1e293b', color: isLight ? '#000' : '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-6 rounded-3xl border shadow-sm flex flex-col items-center ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <h3 className={`text-sm font-black uppercase tracking-wider mb-2 w-full text-left ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Commission Split</h3>
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={commissionData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                  {commissionData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => formatCedi(Number(value) || 0)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: isLight ? '#fff' : '#1e293b', color: isLight ? '#000' : '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-6 rounded-3xl border shadow-sm flex flex-col items-center ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <h3 className={`text-sm font-black uppercase tracking-wider mb-2 w-full text-left ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Payout Channels</h3>
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                  {paymentData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: isLight ? '#fff' : '#1e293b', color: isLight ? '#000' : '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
