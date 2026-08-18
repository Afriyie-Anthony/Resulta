import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';
import { useToast } from '../../../components/ui/Toast';
import {
  FiShield,
  FiSearch,
  FiDownload,
  FiLock,
  FiAlertTriangle,
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
          <h1 className="text-2xl font-black text-white tracking-tight">Security & Activity Audit Logs</h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable tracking of all privileged operations, PIN decryptions, financial approvals, and login attempts (Section 28).
          </p>
        </div>
        <Button variant="secondary" size="sm" leftIcon={<FiDownload />} onClick={handleExportAudit}>
          Export Audit Archive
        </Button>
      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center gap-3 text-xs text-teal-300">
        <FiLock className="w-6 h-6 text-teal-400 shrink-0" />
        <div>
          <strong className="text-white">Tamper-Proof Logging Engine Active</strong>
          <p className="text-teal-400/90 mt-0.5 text-[11px]">
            To ensure zero-trust compliance, audit records are append-only and cannot be altered or purged from the Control Center.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <Card glass className="p-4 border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          {['ALL', 'INFO', 'SECURITY', 'CRITICAL'].map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => { setSeverityFilter(sev); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                severityFilter === sev
                  ? 'bg-teal-500 text-slate-950 font-extrabold shadow-sm shadow-teal-500/20'
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
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </Card>

      {/* Logs Table */}
      <Card glass className="border-slate-800/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 font-sans font-bold bg-slate-900/40">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Event Action</th>
                <th className="py-3.5 px-4">Responsible Actor</th>
                <th className="py-3.5 px-4">Audit Details & Target</th>
                <th className="py-3.5 px-4">Origin IP</th>
                <th className="py-3.5 px-4 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {paginated.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">{log.timestamp}</td>
                  <td className="py-3.5 px-4 font-bold text-teal-400 flex items-center gap-1.5">
                    <FiTerminal className="text-slate-500" /> {log.action}
                  </td>
                  <td className="py-3.5 px-4 font-sans font-bold text-white">{log.actor}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-300 font-medium max-w-md">{log.details}</td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">{log.ip}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Badge
                      variant={
                        log.severity === 'CRITICAL'
                          ? 'error'
                          : log.severity === 'SECURITY'
                          ? 'warning'
                          : 'primary'
                      }
                      className="text-[10px]"
                    >
                      {log.severity === 'SECURITY' && <FiAlertTriangle className="mr-1 w-3 h-3 inline" />}
                      {log.severity === 'CRITICAL' && <FiShield className="mr-1 w-3 h-3 inline" />}
                      {log.severity}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-800/50">
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
