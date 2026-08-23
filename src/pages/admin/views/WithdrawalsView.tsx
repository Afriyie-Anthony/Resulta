import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { formatCedi } from '../../../utils/formatters';
import { InitiateWithdrawalModal } from '../../../components/admin/withdrawals/InitiateWithdrawalModal';
import { useWithdrawalStats, useWithdrawalsList } from '../../../hooks/useWithdrawals';
import type { WithdrawalQueryFilters } from '../../../schemas/withdrawals';
import {
  FiClock,
  FiSend,
  FiSmartphone,
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiSearch
} from 'react-icons/fi';

export const WithdrawalsView: React.FC = () => {
  const { isLight } = useAdminTheme();
  
  const [filters, setFilters] = useState<Partial<WithdrawalQueryFilters>>({
    page: 1,
    limit: 10,
    channel: 'ALL',
    status: 'ALL',
    search: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: statsData, isLoading: isStatsLoading } = useWithdrawalStats();
  const { data: listData, isLoading: isListLoading } = useWithdrawalsList(filters);

  const handleFilterChange = (key: keyof WithdrawalQueryFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const overview = statsData?.overview;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Disbursements & Payouts
          </h1>
          <p className={`text-xs font-semibold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Track commercial withdrawal history and initiate manual payouts.
          </p>
        </div>
        <Button
          variant={isLight ? 'primary' : 'gradient'}
          leftIcon={<FiSend />}
          onClick={() => setIsModalOpen(true)}
          className="font-black text-sm"
        >
          Initiate Payout
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Withdrawn', value: formatCedi(overview?.totalWithdrawnAmount || 0), icon: <FiActivity />, color: 'blue' },
          { label: 'Pending Payouts', value: overview?.pendingCount || 0, icon: <FiClock />, color: 'amber' },
          { label: 'Successful Payouts', value: overview?.successfulCount || 0, icon: <FiCheckCircle />, color: 'emerald' },
          { label: 'Failed Payouts', value: overview?.failedCount || 0, icon: <FiXCircle />, color: 'rose' },
        ].map((stat, i) => (
          <Card key={i} className={`p-5 flex items-center justify-between ${isLight ? 'bg-white shadow-sm' : 'bg-slate-900/90'}`}>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {stat.label}
              </p>
              <h4 className={`text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {isStatsLoading ? '...' : stat.value}
              </h4>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${stat.color}-500/20 text-${stat.color}-500`}>
              {stat.icon}
            </div>
          </Card>
        ))}
      </div>

      {/* Main Table Card */}
      <Card glass className={`overflow-hidden border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/90 border-slate-800'}`}>
        
        {/* Filters Row */}
        <div className={`p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4 ${isLight ? 'bg-slate-100/90 border-slate-300' : 'bg-slate-900/40 border-slate-800'}`}>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Search ref, name, phone..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className={`w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-lg border focus:outline-none focus:ring-2 ${
                  isLight ? 'bg-white border-slate-300 focus:ring-blue-500/20 focus:border-blue-500' : 'bg-slate-950 border-slate-700 text-white focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={filters.channel || 'ALL'}
              onChange={(e) => handleFilterChange('channel', e.target.value)}
              className={`py-2 px-3 text-xs font-bold rounded-lg border focus:outline-none ${
                isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-700 text-white'
              }`}
            >
              <option value="ALL">All Channels</option>
              <option value="MOBILE_MONEY">Mobile Money</option>
              <option value="BANK">Bank Transfer</option>
            </select>

            <select
              value={filters.status || 'ALL'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className={`py-2 px-3 text-xs font-bold rounded-lg border focus:outline-none ${
                isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-700 text-white'
              }`}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="SUCCESSFUL">Successful</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] uppercase font-black ${
                isLight ? 'border-slate-300 text-slate-700' : 'border-slate-800 text-slate-400'
              }`}>
                <th className="py-3.5 px-4">Ref ID</th>
                <th className="py-3.5 px-4">Account Details</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4">Amount (GHC)</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-semibold ${isLight ? 'divide-slate-200' : 'divide-slate-800/50'}`}>
              {isListLoading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center font-bold text-slate-500">Loading registry...</td>
                </tr>
              ) : listData?.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center font-bold text-slate-500">No withdrawal records found.</td>
                </tr>
              ) : (
                listData?.data.map((w) => (
                  <tr key={w.id} className={`transition-colors ${
                    isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-950/60'
                  }`}>
                    <td className={`py-3.5 px-4 font-mono font-black ${isLight ? 'text-[#0B2545]' : 'text-teal-400'}`}>
                      {w.reference}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-extrabold block ${isLight ? 'text-slate-950' : 'text-white'}`}>{w.accountName}</span>
                      <span className={`text-[10px] font-mono font-black ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {w.phoneNumber || w.accountNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold flex items-center gap-1 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                        {w.channel === 'MOBILE_MONEY' ? <FiSmartphone className="text-emerald-500" /> : <FiActivity className="text-blue-500" />}
                        {w.channel === 'MOBILE_MONEY' ? 'MoMo' : 'Bank'}
                      </span>
                      <span className={`text-[10px] font-extrabold block mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {w.network || w.bankName}
                      </span>
                    </td>
                    <td className={`py-3.5 px-4 text-sm font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                      {formatCedi(w.amount)}
                    </td>
                    <td className={`py-3.5 px-4 font-bold text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                      {new Date(w.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={w.status === 'SUCCESSFUL' ? 'success' : w.status === 'PENDING' ? 'warning' : 'error'}
                        className="text-[10px] font-bold"
                      >
                        {w.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {listData?.pagination && (
          <div className={`p-4 border-t ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
            <Pagination
              currentPage={listData.pagination.page}
              totalPages={listData.pagination.totalPages}
              totalItems={listData.pagination.total}
              itemsPerPage={listData.pagination.limit}
              onPageChange={(p) => setFilters(prev => ({ ...prev, page: p }))}
              onItemsPerPageChange={(l) => setFilters(prev => ({ ...prev, limit: l, page: 1 }))}
            />
          </div>
        )}
      </Card>

      <InitiateWithdrawalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
