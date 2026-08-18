import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Pagination } from '../../../components/ui/Pagination';
import { useToast } from '../../../components/ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
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
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'PENDING' | 'ACTIVE' | 'ALL'>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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
            Affiliates & Partner Management
          </h1>
          <p className={`text-xs font-semibold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Review distribution applications, configure commission percentages, and audit partner sales performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning" className="text-xs py-1.5 px-3 font-bold shadow-2xs">
            {pendingCount} Pending Approval
          </Badge>
          <Button variant={isLight ? 'outline' : 'secondary'} size="sm" onClick={() => setActiveTab('PENDING')} className="font-extrabold text-xs">
            Review Applications
          </Button>
        </div>
      </div>

      {/* Tabs & Search */}
      <Card glass className={`p-4 border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isLight ? 'bg-slate-100/90 border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('PENDING')}
            className={`px-4 py-2 rounded-xl text-xs transition-all ${
              activeTab === 'PENDING'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : isLight ? 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-200 font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Pending Review ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-4 py-2 rounded-xl text-xs transition-all ${
              activeTab === 'ACTIVE'
                ? isLight ? 'bg-[#0F8B8D] text-white font-black shadow-xs' : 'bg-teal-500 text-slate-950 font-black shadow-xs'
                : isLight ? 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-200 font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Active Partners ({affiliates.filter(a => a.status === 'ACTIVE').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-xl text-xs transition-all ${
              activeTab === 'ALL'
                ? isLight ? 'bg-slate-800 text-white font-black shadow-xs' : 'bg-slate-700 text-white font-black'
                : isLight ? 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-200 font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search name, email or ref code..."
            className={`w-full rounded-xl pl-9 pr-4 py-1.5 text-xs font-semibold focus:outline-none border ${
              isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-teal-500'
            }`}
          />
        </div>
      </Card>

      {/* Affiliates List Table */}
      <Card glass className={`border overflow-hidden ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/90 border-slate-800'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] uppercase font-black ${
                isLight ? 'border-slate-300 bg-slate-100/90 text-slate-700' : 'border-slate-800 bg-slate-900/40 text-slate-400'
              }`}>
                <th className="py-3.5 px-4">Partner Details</th>
                <th className="py-3.5 px-4">MoMo Payout Account</th>
                <th className="py-3.5 px-4">Referral Handle</th>
                <th className="py-3.5 px-4">Sales Vol</th>
                <th className="py-3.5 px-4">Commission Earned</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-semibold ${isLight ? 'divide-slate-200' : 'divide-slate-800/50'}`}>
              {paginated.length > 0 ? (
                paginated.map((a) => (
                  <tr key={a.id} className={`transition-colors ${isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-900/60'}`}>
                    <td className="py-3.5 px-4">
                      <span className={`font-black block text-sm ${isLight ? 'text-slate-950' : 'text-white'}`}>{a.name}</span>
                      <span className={`text-[11px] font-bold flex items-center gap-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                        <FiMail className="w-3 h-3 text-[#0F8B8D] dark:text-teal-400" /> {a.email}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold block ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{a.phone}</span>
                      <span className={`text-[10px] font-extrabold ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>{a.momoNetwork}</span>
                    </td>
                    <td className={`py-3.5 px-4 font-mono font-black ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`}>{a.referralCode}</td>
                    <td className={`py-3.5 px-4 font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>{a.totalSales} units</td>
                    <td className="py-3.5 px-4 font-black text-emerald-700 dark:text-emerald-400">{formatCedi(a.totalCommission)}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={a.status === 'ACTIVE' ? 'success' : a.status === 'PENDING' ? 'warning' : 'error'}
                        className="text-[10px] font-bold"
                      >
                        {a.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Button variant={isLight ? 'outline' : 'secondary'} size="sm" onClick={() => setSelectedAffiliate(a)} className="font-bold text-xs">
                        Review
                      </Button>
                      {a.status === 'PENDING' && (
                        <Button
                          variant={isLight ? 'primary' : 'gradient'}
                          size="sm"
                          onClick={() => handleApprove(a.id, a.name)}
                          leftIcon={<FiCheck />}
                          className="font-black text-xs"
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
        <div className={`p-4 border-t ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newSize) => { setItemsPerPage(newSize); setCurrentPage(1); }}
          />
        </div>
      </Card>

      {/* Affiliate Review Modal */}
      <Modal isOpen={!!selectedAffiliate} onClose={() => setSelectedAffiliate(null)} title="Partner KYC & Commission Review">
        {selectedAffiliate && (
          <div className="space-y-6">
            <div className={`flex items-center gap-4 p-4 rounded-2xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="w-12 h-12 rounded-xl bg-[#0F8B8D]/20 border border-[#0F8B8D]/40 text-[#0F8B8D] dark:bg-teal-500/20 dark:border-teal-500/40 dark:text-teal-300 flex items-center justify-center font-black text-lg">
                {selectedAffiliate.name[0]}
              </div>
              <div>
                <h4 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{selectedAffiliate.name}</h4>
                <p className={`text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{selectedAffiliate.email} • Applied on {selectedAffiliate.appliedDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className={`p-3.5 rounded-xl border space-y-1 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <p className={`font-black uppercase text-[10px] flex items-center gap-1 ${isLight ? 'text-slate-700' : 'text-slate-500'}`}>
                  <FiSmartphone /> Registered MoMo Wallet
                </p>
                <p className={`text-sm font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>{selectedAffiliate.phone}</p>
                <p className="text-[#0F8B8D] dark:text-teal-400 text-[11px] font-bold">{selectedAffiliate.momoNetwork} Verified</p>
              </div>

              <div className={`p-3.5 rounded-xl border space-y-1 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <p className={`font-black uppercase text-[10px] flex items-center gap-1 ${isLight ? 'text-slate-700' : 'text-slate-500'}`}>
                  <FiExternalLink /> Referral Handle Attribution
                </p>
                <p className="text-sm font-mono font-bold text-[#0F8B8D] dark:text-teal-300">?ref={selectedAffiliate.referralCode}</p>
                <p className={`text-[11px] font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Standard 10% Commission Rate</p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border space-y-2 text-xs ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <span className={`font-black block ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>Compliance & Fraud Check Summary</span>
              <ul className={`space-y-1 font-semibold list-disc list-inside ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                <li>No duplicate mobile money numbers registered in active affiliate database.</li>
                <li>Email domain syntax verified and operational.</li>
                <li>Agreed to OWELYN Holdings Ltd terms & anti-spam marketing guidelines.</li>
              </ul>
            </div>

            <div className={`flex justify-end gap-3 pt-4 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <Button
                type="button"
                variant="danger"
                leftIcon={<FiX />}
                onClick={() => handleReject(selectedAffiliate.id, selectedAffiliate.name)}
                className="font-bold"
              >
                Reject Application
              </Button>
              <Button
                type="button"
                variant={isLight ? 'primary' : 'gradient'}
                leftIcon={<FiCheck />}
                onClick={() => handleApprove(selectedAffiliate.id, selectedAffiliate.name)}
                className="font-black"
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
