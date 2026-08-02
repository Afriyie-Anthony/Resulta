import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';
import { formatCedi } from '../../../utils/formatters';
import {
  FiCheck,
  FiX,
  FiSearch,
  FiExternalLink,
  FiMail,
  FiSmartphone
} from 'react-icons/fi';

interface Affiliate {
  id: string;
  name: string;
  email: string;
  phone: string;
  momoNetwork: string;
  referralCode: string;
  totalSales: number;
  totalCommission: number;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  appliedDate: string;
}

export const AffiliatesPartnersView: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'PENDING' | 'ACTIVE' | 'ALL'>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);

  const [affiliates, setAffiliates] = useState<Affiliate[]>([
    { id: 'AFF-01', name: 'Kofi Mensah', email: 'kofi.mensah@ghana-uni.edu', phone: '+233 24 551 0921', momoNetwork: 'MTN MoMo', referralCode: 'REF-GH-KOFI26', totalSales: 0, totalCommission: 0, status: 'PENDING', appliedDate: '2026-08-01 14:20' },
    { id: 'AFF-02', name: 'Ama Osei Boateng', email: 'ama.osei92@gmail.com', phone: '+233 50 182 3310', momoNetwork: 'Telecel Cash', referralCode: 'REF-GH-AMA92', totalSales: 0, totalCommission: 0, status: 'PENDING', appliedDate: '2026-08-01 12:15' },
    { id: 'AFF-03', name: 'Yaw Ampem Tech House', email: 'support@ampemtech.com.gh', phone: '+233 27 409 1192', momoNetwork: 'AirtelTigo', referralCode: 'REF-GH-AMPEM', totalSales: 0, totalCommission: 0, status: 'PENDING', appliedDate: '2026-07-31 18:04' },
    { id: 'AFF-04', name: 'Abigail Owusu', email: 'abigail@campusresale.gh', phone: '+233 54 902 4418', momoNetwork: 'MTN MoMo', referralCode: 'REF-GH-ABIE', totalSales: 0, totalCommission: 0, status: 'PENDING', appliedDate: '2026-07-31 09:30' },
    { id: 'AFF-05', name: 'Kwaku Frimpong', email: 'kwaku.f@business.gh', phone: '+233 24 991 0293', momoNetwork: 'MTN MoMo', referralCode: 'REF-GH-8823', totalSales: 142, totalCommission: 710.0, status: 'ACTIVE', appliedDate: '2026-07-10 11:00' },
    { id: 'AFF-06', name: 'Esi Ansah', email: 'esi.ansah@outlook.com', phone: '+233 55 201 8839', momoNetwork: 'MTN MoMo', referralCode: 'REF-GH-4412', totalSales: 98, totalCommission: 490.0, status: 'ACTIVE', appliedDate: '2026-07-12 16:45' },
  ]);

  const pendingCount = affiliates.filter(a => a.status === 'PENDING').length;

  const handleApprove = (id: string, name: string) => {
    setAffiliates(prev => prev.map(a => a.id === id ? { ...a, status: 'ACTIVE' } : a));
    setSelectedAffiliate(null);
    addToast({
      title: 'Affiliate Application Approved',
      message: `${name} is now approved! Their referral link and MoMo commission routing are activated.`,
      type: 'success',
    });
  };

  const handleReject = (id: string, name: string) => {
    setAffiliates(prev => prev.map(a => a.id === id ? { ...a, status: 'SUSPENDED' } : a));
    setSelectedAffiliate(null);
    addToast({
      title: 'Application Rejected',
      message: `${name}'s affiliate application has been declined.`,
      type: 'info',
    });
  };

  const filtered = affiliates.filter(a => {
    const matchesTab = activeTab === 'ALL' || a.status === activeTab;
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.referralCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Affiliates & Partner Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review distribution applications, configure commission percentages, and audit partner sales performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" className="text-xs py-1.5 px-3">
            {pendingCount} Pending Approval
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setActiveTab('PENDING')}>
            Review Applications
          </Button>
        </div>
      </div>

      {/* Tabs & Search */}
      <Card glass className="p-4 border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('PENDING')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'PENDING'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Pending Review ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ACTIVE'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20 font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Active Partners ({affiliates.filter(a => a.status === 'ACTIVE').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ALL'
                ? 'bg-slate-700 text-white font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Records
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, email or ref code..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </Card>

      {/* Affiliates List Table */}
      <Card glass className="border-slate-800/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 font-bold bg-slate-900/40">
                <th className="py-3.5 px-4">Partner Details</th>
                <th className="py-3.5 px-4">MoMo Payout Account</th>
                <th className="py-3.5 px-4">Referral Handle</th>
                <th className="py-3.5 px-4">Sales Vol</th>
                <th className="py-3.5 px-4">Commission Earned</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filtered.length > 0 ? (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block text-sm">{a.name}</span>
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <FiMail className="w-3 h-3 text-teal-400" /> {a.email}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-200 block">{a.phone}</span>
                      <span className="text-[10px] text-slate-500 font-bold">{a.momoNetwork}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-teal-400 font-bold">{a.referralCode}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{a.totalSales} units</td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-400">{formatCedi(a.totalCommission)}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={a.status === 'ACTIVE' ? 'success' : a.status === 'PENDING' ? 'warning' : 'error'}
                        className="text-[10px]"
                      >
                        {a.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Button variant="secondary" size="sm" onClick={() => setSelectedAffiliate(a)}>
                        Review
                      </Button>
                      {a.status === 'PENDING' && (
                        <Button
                          variant="gradient"
                          size="sm"
                          onClick={() => handleApprove(a.id, a.name)}
                          leftIcon={<FiCheck />}
                        >
                          Approve
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 font-semibold">
                    No affiliates matching the selected view filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Affiliate Review Modal */}
      <Modal isOpen={!!selectedAffiliate} onClose={() => setSelectedAffiliate(null)} title="Partner KYC & Commission Review">
        {selectedAffiliate && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center font-black text-lg">
                {selectedAffiliate.name[0]}
              </div>
              <div>
                <h4 className="text-base font-extrabold text-white">{selectedAffiliate.name}</h4>
                <p className="text-xs text-slate-400">{selectedAffiliate.email} • Applied on {selectedAffiliate.appliedDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <p className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
                  <FiSmartphone /> Registered MoMo Wallet
                </p>
                <p className="text-sm font-bold text-white">{selectedAffiliate.phone}</p>
                <p className="text-teal-400 text-[11px] font-semibold">{selectedAffiliate.momoNetwork} Verified</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <p className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
                  <FiExternalLink /> Referral Handle Attribution
                </p>
                <p className="text-sm font-mono font-bold text-teal-300">?ref={selectedAffiliate.referralCode}</p>
                <p className="text-slate-400 text-[11px]">Standard 10% Commission Rate</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="text-slate-300 font-bold block">Compliance & Fraud Check Summary</span>
              <ul className="space-y-1 text-slate-400 list-disc list-inside">
                <li>No duplicate mobile money numbers registered in active affiliate database.</li>
                <li>Email domain syntax verified and operational.</li>
                <li>Agreed to OWELYN Holdings Ltd terms & anti-spam marketing guidelines.</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="danger"
                leftIcon={<FiX />}
                onClick={() => handleReject(selectedAffiliate.id, selectedAffiliate.name)}
              >
                Reject Application
              </Button>
              <Button
                type="button"
                variant="gradient"
                leftIcon={<FiCheck />}
                onClick={() => handleApprove(selectedAffiliate.id, selectedAffiliate.name)}
              >
                Approve & Activate Partner
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
