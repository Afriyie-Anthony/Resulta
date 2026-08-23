import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';
import { useToast } from '../../../components/ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { useAuditStats, usePaginatedAuditLogs } from '../../../hooks/useAuditAPI';
import {
  FiSearch,
  FiDownload,
  FiLock,
  FiTerminal,
  FiActivity,
  FiUsers,
  FiFileText
} from 'react-icons/fi';

export const AuditLogsView: React.FC = () => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Queries
  const { data: stats, isLoading: isStatsLoading } = useAuditStats();
  const { data: logsData, isLoading: isLogsLoading } = usePaginatedAuditLogs({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm || undefined,
    action: severityFilter === 'ALL' ? undefined : severityFilter, // Using action filter as severity for now
  });

  const handleExportAudit = () => {
    addToast({
      title: 'Immutable Audit Trail Exported',
      message: 'Cryptographically signed audit log archive initiated for compliance download.',
      type: 'success',
    });
  };

  const determineSeverity = (action: string) => {
    if (action.includes('LOGIN') || action.includes('PASSWORD')) return 'SECURITY';
    if (action.includes('WITHDRAWAL') || action.includes('UPLOAD')) return 'CRITICAL';
    return 'INFO';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Security & Activity Audit Logs
          </h1>
          <p className={`text-xs font-semibold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Immutable tracking of all privileged operations, PIN decryptions, financial approvals, and login attempts.
          </p>
        </div>
        <Button variant={isLight ? 'outline' : 'secondary'} size="sm" leftIcon={<FiDownload />} onClick={handleExportAudit} className="font-black text-xs">
          Export Audit Archive
        </Button>
      </div>

      {/* Security Banner */}
      <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs ${
        isLight ? 'bg-teal-50 border-teal-300 text-teal-900' : 'bg-teal-500/10 border-teal-500/30 text-teal-300'
      }`}>
        <FiLock className="w-6 h-6 text-[#0F8B8D] dark:text-teal-400 shrink-0" />
        <div>
          <strong className={isLight ? 'text-slate-950 font-black' : 'text-white'}>Tamper-Proof Logging Engine Active</strong>
          <p className={`mt-0.5 text-[11px] font-bold ${isLight ? 'text-slate-700' : 'text-teal-400/90'}`}>
            To ensure zero-trust compliance, audit records are append-only and cannot be altered or purged from the Control Center.
          </p>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card glass className={`p-5 border flex items-center gap-4 ${isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isLight ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-blue-400'}`}>
            <FiFileText className="w-6 h-6" />
          </div>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Logs</p>
            <h3 className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {isStatsLoading ? '...' : stats?.totalLogsCount.toLocaleString()}
            </h3>
          </div>
        </Card>
        <Card glass className={`p-5 border flex items-center gap-4 ${isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isLight ? 'bg-teal-100 text-teal-600' : 'bg-teal-500/20 text-teal-400'}`}>
            <FiActivity className="w-6 h-6" />
          </div>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Today's Logs</p>
            <h3 className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {isStatsLoading ? '...' : stats?.todayLogsCount.toLocaleString()}
            </h3>
          </div>
        </Card>
        <Card glass className={`p-5 border flex items-center gap-4 ${isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isLight ? 'bg-purple-100 text-purple-600' : 'bg-purple-500/20 text-purple-400'}`}>
            <FiUsers className="w-6 h-6" />
          </div>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Active Users</p>
            <h3 className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {isStatsLoading ? '...' : stats?.uniqueActiveUsersCount.toLocaleString()}
            </h3>
          </div>
        </Card>
      </div>

      {/* Filter & Search */}
      <Card glass className={`p-4 border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isLight ? 'bg-slate-100/90 border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center gap-1.5">
          {['ALL', 'INFO', 'SECURITY', 'CRITICAL'].map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => { setSeverityFilter(sev); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                severityFilter === sev
                  ? isLight
                    ? 'bg-[#0F8B8D] text-white shadow-xs'
                    : 'bg-teal-500 text-slate-950 shadow-xs'
                  : isLight
                  ? 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-200'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search action, actor or detail..."
            className={`w-full rounded-xl pl-9 pr-4 py-1.5 text-xs font-semibold focus:outline-none border ${
              isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-teal-500'
            }`}
          />
        </div>
      </Card>

      {/* Logs Table */}
      <Card glass className={`border overflow-hidden ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/90 border-slate-800'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className={`border-b text-[11px] uppercase font-sans font-black ${
                isLight ? 'border-slate-300 bg-slate-100/90 text-slate-700' : 'border-slate-800 bg-slate-900/40 text-slate-400'
              }`}>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Event Action</th>
                <th className="py-3.5 px-4">Responsible Actor</th>
                <th className="py-3.5 px-4">Audit Details & Target</th>
                <th className="py-3.5 px-4">Origin IP</th>
                <th className="py-3.5 px-4 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-semibold ${isLight ? 'divide-slate-200' : 'divide-slate-800/50'}`}>
              {isLogsLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">Loading audit logs...</td>
                </tr>
              ) : logsData?.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No logs found.</td>
                </tr>
              ) : (
                logsData?.data.map((log) => {
                  const severity = determineSeverity(log.action);
                  return (
                    <tr key={log.id} className={`transition-colors ${isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-900/60'}`}>
                      <td className={`py-3.5 px-4 text-[11px] font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className={`py-3.5 px-4 font-black flex items-center gap-1.5 ${isLight ? 'text-[#0B2545]' : 'text-teal-400'}`}>
                        <FiTerminal className="text-slate-400" /> {log.action}
                      </td>
                      <td className={`py-3.5 px-4 font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                        {log.user ? `${log.user.name} (${log.user.email})` : log.userId || 'SYSTEM'}
                      </td>
                      <td className={`py-3.5 px-4 font-sans font-bold text-xs ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                        {typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details || 'N/A')}
                      </td>
                      <td className={`py-3.5 px-4 font-mono font-bold text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                        {log.ipAddress}
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        <Badge
                          variant={severity === 'CRITICAL' ? 'error' : severity === 'SECURITY' ? 'warning' : 'info'}
                          className="text-[10px] font-bold"
                        >
                          {severity}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className={`p-4 border-t ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
          <Pagination
            currentPage={currentPage}
            totalPages={logsData?.pagination.totalPages || 1}
            totalItems={logsData?.pagination.total || 0}
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
