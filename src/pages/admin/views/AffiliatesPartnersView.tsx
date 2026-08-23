import React, { useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';
import { useToast } from '../../../components/ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { formatCedi } from '../../../utils/formatters';
import { AffiliateDetailsView, type Affiliate } from '../../../components/admin/affiliates';
import {
  FiCheck,
  FiSearch,
  FiMail,
  FiSmartphone,
  FiUsers,
  FiClock,
  FiShoppingBag,
  FiDollarSign,
  FiEye,
  FiAlertOctagon
} from 'react-icons/fi';

export const AffiliatesPartnersView: React.FC = () => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'PENDING' | 'ACTIVE' | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingAffiliate, setViewingAffiliate] = useState<Affiliate | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);

  const pendingCount = affiliates.filter(a => a.status === 'PENDING').length;
  const activeCount = affiliates.filter(a => a.status === 'ACTIVE').length;
  const totalSalesUnits = affiliates.reduce((sum, a) => sum + a.totalSales, 0);
  const totalCommissionPaid = affiliates.reduce((sum, a) => sum + a.totalCommission, 0);

  const handleApprove = (id: string, name: string) => {
    setAffiliates(prev => prev.map(a => a.id === id ? { ...a, status: 'ACTIVE' } : a));
    if (viewingAffiliate && viewingAffiliate.id === id) {
      setViewingAffiliate(prev => prev ? { ...prev, status: 'ACTIVE' } : null);
    }
    addToast({
      title: 'Affiliate Application Approved',
      message: `${name} is now approved! USSD code and commission payouts activated.`,
      type: 'success',
    });
  };

  const handleSuspend = (id: string, name: string) => {
    setAffiliates(prev => prev.map(a => a.id === id ? { ...a, status: 'SUSPENDED' } : a));
    if (viewingAffiliate && viewingAffiliate.id === id) {
      setViewingAffiliate(prev => prev ? { ...prev, status: 'SUSPENDED' } : null);
    }
    addToast({
      title: 'Account Suspended',
      message: `Suspended partner account and deactivated USSD referral code for ${name}.`,
      type: 'warning',
    });
  };

  const handleDeactivate = (id: string, name: string) => {
    setAffiliates(prev => prev.map(a => a.id === id ? { ...a, status: 'SUSPENDED' } : a));
    if (viewingAffiliate && viewingAffiliate.id === id) {
      setViewingAffiliate(prev => prev ? { ...prev, status: 'SUSPENDED' } : null);
    }
    addToast({
      title: 'Account Deactivated',
      message: `Deactivated affiliate access for ${name}.`,
      type: 'info',
    });
  };

  const handleDelete = (id: string, name: string) => {
    setAffiliates(prev => prev.filter(a => a.id !== id));
    if (viewingAffiliate && viewingAffiliate.id === id) {
      setViewingAffiliate(null);
    }
    addToast({
      title: 'Affiliate Profile Deleted',
      message: `Removed profile for ${name}.`,
      type: 'info',
    });
  };

  const handleUpdateUssdCode = (id: string, newCode: string) => {
    setAffiliates(prev => prev.map(a => a.id === id ? { ...a, ussdCode: newCode } : a));
    if (viewingAffiliate && viewingAffiliate.id === id) {
      setViewingAffiliate(prev => prev ? { ...prev, ussdCode: newCode } : null);
    }
  };

  // If a specific affiliate is selected for full page view, render AffiliateDetailsView
  if (viewingAffiliate) {
    return (
      <AffiliateDetailsView
        affiliate={viewingAffiliate}
        onBack={() => setViewingAffiliate(null)}
        onApprove={handleApprove}
        onSuspend={handleSuspend}
        onDeactivate={handleDeactivate}
        onDelete={handleDelete}
        onUpdateUssdCode={handleUpdateUssdCode}
      />
    );
  }

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className={`p-2.5 rounded-2xl ${
              isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/20 text-teal-400'
            }`}>
              <FiUsers className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Affiliates & Partner Management
              </h1>
              <p className={`text-xs sm:text-sm font-semibold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Review partner applications, configure commission structures, and audit referral sales performance.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Badge variant="warning" className="text-xs py-1.5 px-3 font-black shadow-2xs">
            {pendingCount} Pending Approval
          </Badge>
          <Button
            variant={isLight ? 'primary' : 'gradient'}
            size="md"
            onClick={() => setActiveTab('PENDING')}
            className="font-black text-xs h-11 px-5 rounded-2xl shadow-md"
          >
            Review Applications
          </Button>
        </div>
      </div>

      {/* Modern KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Partners */}
        <div
          onClick={() => setActiveTab('ALL')}
          className={`p-3.5 rounded-2xl border border-t-4 transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
            isLight
              ? 'bg-white border-slate-300 border-t-cyan-500 hover:border-slate-400'
              : 'bg-slate-900/90 border-slate-800 border-t-cyan-500'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[10px] font-black uppercase tracking-wider ${
              isLight ? 'text-slate-700' : 'text-slate-400'
            }`}>
              Total Partners
            </span>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
              isLight ? 'bg-cyan-100/80 text-cyan-800 border border-cyan-200' : 'bg-teal-500/20 text-teal-400 font-black'
            }`}>
              <FiUsers className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
            {affiliates.length} Partners
          </p>
          <p className={`text-[11px] font-semibold mt-1.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            {activeCount} Active • {pendingCount} Pending
          </p>
        </div>

        {/* 2. Pending Review */}
        <div
          onClick={() => setActiveTab('PENDING')}
          className={`p-3.5 rounded-2xl border border-t-4 transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
            isLight
              ? 'bg-white border-slate-300 border-t-amber-500 hover:border-slate-400'
              : 'bg-slate-900/90 border-slate-800 border-t-amber-500'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[10px] font-black uppercase tracking-wider ${
              isLight ? 'text-slate-700' : 'text-slate-400'
            }`}>
              Pending Review
            </span>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
              isLight ? 'bg-amber-100/80 text-amber-800 border border-amber-200' : 'bg-amber-500/20 text-amber-400'
            }`}>
              <FiClock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className={`text-xl font-black tracking-tight ${isLight ? 'text-amber-950' : 'text-amber-400'}`}>
            {pendingCount} Applications
          </p>
          <p className={`text-[11px] font-semibold mt-1.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            Action required for activation
          </p>
        </div>

        {/* 3. Referral Sales Vol */}
        <div
          onClick={() => setActiveTab('ACTIVE')}
          className={`p-3.5 rounded-2xl border border-t-4 transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
            isLight
              ? 'bg-white border-slate-300 border-t-emerald-500 hover:border-slate-400'
              : 'bg-slate-900/90 border-slate-800 border-t-emerald-500'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[10px] font-black uppercase tracking-wider ${
              isLight ? 'text-slate-700' : 'text-slate-400'
            }`}>
              Referral Volume
            </span>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
              isLight ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200' : 'bg-emerald-500/20 text-emerald-400 font-black'
            }`}>
              <FiShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
            {totalSalesUnits} Units Sold
          </p>
          <p className={`text-[11px] font-semibold mt-1.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            Total vouchers via affiliate links
          </p>
        </div>

        {/* 4. Commission Paid */}
        <div
          onClick={() => setActiveTab('ACTIVE')}
          className={`p-3.5 rounded-2xl border border-t-4 transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
            isLight
              ? 'bg-white border-slate-300 border-t-purple-500 hover:border-slate-400'
              : 'bg-slate-900/90 border-slate-800 border-t-purple-500'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[10px] font-black uppercase tracking-wider ${
              isLight ? 'text-slate-700' : 'text-slate-400'
            }`}>
              Commission Earned
            </span>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
              isLight ? 'bg-purple-100/80 text-purple-800 border border-purple-200' : 'bg-purple-500/20 text-purple-400 font-black'
            }`}>
              <FiDollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
            {formatCedi(totalCommissionPaid)}
          </p>
          <p className={`text-[11px] font-semibold mt-1.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            Total partner payouts
          </p>
        </div>
      </div>

      {/* Tabs & Search Toolbar */}
      <div className={`p-4 rounded-3xl border transition-colors shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all border ${
              activeTab === 'ALL'
                ? isLight
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-700 text-white border-slate-600 shadow-xs'
                : isLight
                ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 font-extrabold shadow-2xs'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>All Records</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-300">
              {affiliates.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PENDING')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all border ${
              activeTab === 'PENDING'
                ? isLight
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                  : 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                : isLight
                ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 font-extrabold shadow-2xs'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>Pending Review</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-black/15 text-slate-950 dark:bg-white/20 dark:text-white">
              {pendingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ACTIVE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all border ${
              activeTab === 'ACTIVE'
                ? isLight
                  ? 'bg-[#0F8B8D] text-white border-[#0F8B8D] shadow-xs'
                  : 'bg-teal-500 text-slate-950 border-teal-400 shadow-xs'
                : isLight
                ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 font-extrabold shadow-2xs'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>Active Partners</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-white/20 text-white dark:bg-black/20 dark:text-slate-950">
              {activeCount}
            </span>
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search partner name, email or ref code..."
            className={`w-full rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none transition-colors border ${
              isLight
                ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D] focus:bg-white'
                : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500 focus:bg-slate-900'
            }`}
          />
        </div>
      </div>

      {/* Affiliates List Table */}
      <div className={`rounded-3xl border overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/90 border-slate-800 shadow-xl'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] uppercase font-black ${
                isLight ? 'border-slate-300 bg-slate-100/90 text-slate-700' : 'border-slate-800 bg-slate-950/50 text-slate-400'
              }`}>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Partner Details</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Payout Phone</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Referral Handle</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Sales Vol</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Commission Earned</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Status</th>
                <th className="py-2.5 px-3.5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-semibold ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
              {paginated.length > 0 ? (
                paginated.map((a) => (
                  <tr key={a.id} className={`transition-colors ${isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-950/40'}`}>
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span className={`font-black block text-sm ${isLight ? 'text-slate-950' : 'text-white'}`}>{a.name}</span>
                      <span className={`text-xs font-bold flex items-center gap-1 mt-0.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                        <FiMail className="w-3.5 h-3.5 text-[#0F8B8D] dark:text-teal-400" /> {a.email}
                      </span>
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2 font-black text-sm">
                        <FiSmartphone className="text-[#0F8B8D] dark:text-teal-400 w-4 h-4 shrink-0" />
                        <span className={isLight ? 'text-slate-950' : 'text-white'}>{a.phone}</span>
                      </div>
                    </td>

                    <td className={`py-2.5 px-3.5 whitespace-nowrap font-mono font-black text-xs ${isLight ? 'text-[#0B2545]' : 'text-teal-400'}`}>
                      {a.referralCode}
                    </td>

                    <td className={`py-2.5 px-3.5 whitespace-nowrap font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                      {a.totalSales} units
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap font-black text-sm text-emerald-700 dark:text-emerald-400">
                      {formatCedi(a.totalCommission)}
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <Badge
                        variant={a.status === 'ACTIVE' ? 'success' : a.status === 'PENDING' ? 'warning' : 'error'}
                        className="text-[10px] font-black tracking-wide uppercase px-2.5 py-0.5"
                      >
                        {a.status}
                      </Badge>
                    </td>

                    <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* Eye Icon View Details Page Button */}
                        <button
                          type="button"
                          onClick={() => setViewingAffiliate(a)}
                          title="View Full Affiliate Profile"
                          className={`p-2 rounded-xl border transition-all shadow-2xs ${
                            isLight
                              ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200 hover:text-slate-950'
                              : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          <FiEye className="w-4 h-4 text-[#0F8B8D] dark:text-teal-400" />
                        </button>

                        {/* Approve Button */}
                        {a.status === 'PENDING' && (
                          <Button
                            variant={isLight ? 'primary' : 'gradient'}
                            size="sm"
                            onClick={() => handleApprove(a.id, a.name)}
                            leftIcon={<FiCheck />}
                            className="font-black text-xs h-8 px-3 rounded-xl shadow-2xs"
                          >
                            Approve
                          </Button>
                        )}

                        {/* Suspend Button */}
                        {a.status === 'ACTIVE' && (
                          <button
                            type="button"
                            onClick={() => handleSuspend(a.id, a.name)}
                            title="Suspend Partner Account"
                            className={`p-2 rounded-xl border transition-all shadow-2xs ${
                              isLight
                                ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                                : 'bg-amber-950/40 border-amber-900/50 text-amber-300 hover:bg-amber-900/60'
                            }`}
                          >
                            <FiAlertOctagon className="w-4 h-4 text-amber-600" />
                          </button>
                        )}
                      </div>
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

        <div className={`px-6 py-4 border-t ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newSize) => { setItemsPerPage(newSize); setCurrentPage(1); }}
          />
        </div>
      </div>
    </div>
  );
};
