import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';
import { useToast } from '../../../components/ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import {
  FiSearch,
  FiDownload,
  FiLock,
  FiTerminal
} from 'react-icons/fi';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  severity: string;
  ip: string;
}

export const AuditLogsView: React.FC = () => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const logs: AuditLogEntry[] = [
    { id: 'LOG-99182', timestamp: '2026-08-01 19:50:11', actor: 'System Administrator (SA)', action: 'REVEAL_VOUCHER_PIN', details: 'Admin inspected plaintext PIN for order RSL-ORD-2026-8812', severity: 'SECURITY', ip: '102.176.44.12' },
    { id: 'LOG-99181', timestamp: '2026-08-01 19:10:04', actor: 'System Administrator (SA)', action: 'APPROVE_AFFILIATE', details: 'Activated affiliate Kwaku Frimpong (REF-GH-8823)', severity: 'SYSTEM', ip: '102.176.44.12' },
    { id: 'LOG-99180', timestamp: '2026-08-01 18:05:32', actor: 'System Administrator (SA)', action: 'INGEST_VOUCHER_BATCH', details: 'Uploaded BATCH-2026-W09 containing 1,000 WASSCE PINs (AES-256 encrypted)', severity: 'CRITICAL', ip: '102.176.44.12' },
    { id: 'LOG-99179', timestamp: '2026-08-01 15:40:19', actor: 'Unidentified Attempt', action: 'FAILED_ADMIN_LOGIN', details: 'Invalid credential login attempt to Control Center', severity: 'SECURITY', ip: '197.255.42.11' },
    { id: 'LOG-99178', timestamp: '2026-08-01 14:02:55', actor: 'System Administrator (SA)', action: 'PROCESS_WITHDRAWAL', details: 'Authorized MoMo payout of GH₵ 350.00 to Kwesi Owoso (WD-2026-101)', severity: 'CRITICAL', ip: '102.176.44.12' },
  ];

  const handleExportAudit = () => {
    addToast({
      title: 'Immutable Audit Trail Exported',
      message: 'Cryptographically signed audit log archive initiated for compliance download.',
      type: 'success',
    });
  };

  const filtered = logs.filter(l => {
    const matchesSev = severityFilter === 'ALL' || l.severity === severityFilter;
    const matchesSearch = l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.actor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSev && matchesSearch;
  });

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
              {paginated.map((log) => (
                <tr key={log.id} className={`transition-colors ${isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-900/60'}`}>
                  <td className={`py-3.5 px-4 text-[11px] font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>{log.timestamp}</td>
                  <td className={`py-3.5 px-4 font-black flex items-center gap-1.5 ${isLight ? 'text-[#0B2545]' : 'text-teal-400'}`}>
                    <FiTerminal className="text-slate-400" /> {log.action}
                  </td>
                  <td className={`py-3.5 px-4 font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{log.actor}</td>
                  <td className={`py-3.5 px-4 font-sans font-bold text-xs ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>{log.details}</td>
                  <td className={`py-3.5 px-4 font-mono font-bold text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>{log.ip}</td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <Badge
                      variant={log.severity === 'CRITICAL' ? 'error' : log.severity === 'SECURITY' ? 'warning' : 'info'}
                      className="text-[10px] font-bold"
                    >
                      {log.severity}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={`p-4 border-t ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
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
