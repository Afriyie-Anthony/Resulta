import React, { useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';
import { useToast } from '../../../components/ui/Toast';
import { Modal } from '../../../components/ui/Modal';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { formatCedi } from '../../../utils/formatters';
import { AffiliateDetailsView } from '../../../components/admin/affiliates';
import { useDebounce } from '../../../hooks/useDebounce';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAffiliateService } from '../../../services/admin-affiliates.service';
import {
  useAdminAffiliatesList,
  useAdminAffiliateStats,
  useAdminAffiliateConfig,
  useAdminAffiliateAnalytics,
  useUpdateAdminAffiliateConfig,
  useCreateAdminAffiliate,
  adminAffiliateKeys
} from '../../../hooks/useAdminAffiliates';
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
  FiAlertOctagon,
  FiSettings,
  FiDownload,
  FiPlus,
  FiBarChart2
} from 'react-icons/fi';

export const AffiliatesPartnersView: React.FC = () => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();

  // State
  const [activeTab, setActiveTab] = useState<'PENDING' | 'ACTIVE' | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modals state
  const [viewingAffiliateId, setViewingAffiliateId] = useState<string | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  // Queries
  const { data: statsData } = useAdminAffiliateStats();
  const { data: listData, isLoading: isListLoading } = useAdminAffiliatesList({
    page: currentPage,
    limit: itemsPerPage,
    status: activeTab === 'ALL' ? undefined : activeTab,
    search: debouncedSearch || undefined,
  });

  const affiliates = listData?.data || [];
  const totalItems = listData?.meta?.total || 0;
  const totalPages = listData?.meta?.totalPages || 1;

  // Mutations for table quick-actions
  const queryClient = useQueryClient();
  const suspendMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) => adminAffiliateService.updateAffiliate(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminAffiliateKeys.list({}) });
      queryClient.invalidateQueries({ queryKey: adminAffiliateKeys.stats() });
    }
  });
  
  const handleQuickApprove = (id: string, _name: string) => {
    // Open detail view for proper approval flow (which needs USSD code input)
    setViewingAffiliateId(id);
  };

  const handleQuickSuspend = (id: string, name: string) => {
    suspendMutation.mutate({ id, status: 'SUSPENDED' }, {
      onSuccess: () => {
        addToast({
          title: 'Account Suspended',
          message: `Suspended partner account for ${name}.`,
          type: 'warning',
        });
      }
    });
  };

  const handleExportCsv = () => {
    window.location.href = adminAffiliateService.exportCsv();
  };

  if (viewingAffiliateId) {
    const aff = affiliates.find(a => a.id === viewingAffiliateId);
    if (aff) {
      return (
        <AffiliateDetailsView
          affiliate={aff}
          onBack={() => setViewingAffiliateId(null)}
          onApprove={() => {}} 
          onSuspend={() => {}}
          onDeactivate={() => {}}
          onDelete={() => {}}
          onUpdateUssdCode={() => {}}
        />
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className={`p-2.5 rounded-2xl ${isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/20 text-teal-400'}`}>
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
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Badge variant="warning" className="text-xs py-1.5 px-3 font-black shadow-2xs">
            {statsData?.pendingApprovals || 0} Pending Approval
          </Badge>
          <Button variant={isLight ? 'primary' : 'gradient'} size="md" onClick={() => setIsCreateOpen(true)} leftIcon={<FiPlus />} className="font-black text-xs h-10 px-4 rounded-xl shadow-md">
            Add Partner
          </Button>
          <Button variant="outline" size="md" onClick={() => setIsAnalyticsOpen(true)} leftIcon={<FiBarChart2 />} className="font-black text-xs h-10 px-4 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-slate-300 dark:border-slate-700">
            Analytics
          </Button>
          <Button variant="outline" size="md" onClick={() => setIsConfigOpen(true)} leftIcon={<FiSettings />} className="font-black text-xs h-10 px-4 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-slate-300 dark:border-slate-700">
            Config
          </Button>
          <Button variant="outline" size="md" onClick={handleExportCsv} leftIcon={<FiDownload />} className="font-black text-xs h-10 px-4 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-slate-300 dark:border-slate-700">
            Export
          </Button>
        </div>
      </div>

      {/* Modern KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => setActiveTab('ALL')} className={`p-3.5 rounded-2xl border border-t-4 transition-all cursor-pointer shadow-2xs hover:shadow-sm ${isLight ? 'bg-white border-slate-300 border-t-cyan-500 hover:border-slate-400' : 'bg-slate-900/90 border-slate-800 border-t-cyan-500'}`}>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Total Partners</span>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${isLight ? 'bg-cyan-100/80 text-cyan-800 border border-cyan-200' : 'bg-teal-500/20 text-teal-400 font-black'}`}>
              <FiUsers className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>{statsData?.totalAffiliates || 0} Partners</p>
          <p className={`text-[11px] font-semibold mt-1.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>{statsData?.approvedAffiliates || 0} Active • {statsData?.pendingApprovals || 0} Pending</p>
        </div>

        <div onClick={() => setActiveTab('PENDING')} className={`p-3.5 rounded-2xl border border-t-4 transition-all cursor-pointer shadow-2xs hover:shadow-sm ${isLight ? 'bg-white border-slate-300 border-t-amber-500 hover:border-slate-400' : 'bg-slate-900/90 border-slate-800 border-t-amber-500'}`}>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Pending Review</span>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${isLight ? 'bg-amber-100/80 text-amber-800 border border-amber-200' : 'bg-amber-500/20 text-amber-400'}`}>
              <FiClock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className={`text-xl font-black tracking-tight ${isLight ? 'text-amber-950' : 'text-amber-400'}`}>{statsData?.pendingApprovals || 0} Applications</p>
          <p className={`text-[11px] font-semibold mt-1.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Action required for activation</p>
        </div>

        <div onClick={() => setActiveTab('ACTIVE')} className={`p-3.5 rounded-2xl border border-t-4 transition-all cursor-pointer shadow-2xs hover:shadow-sm ${isLight ? 'bg-white border-slate-300 border-t-emerald-500 hover:border-slate-400' : 'bg-slate-900/90 border-slate-800 border-t-emerald-500'}`}>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Referral Volume</span>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${isLight ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200' : 'bg-emerald-500/20 text-emerald-400 font-black'}`}>
              <FiShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>0 Units Sold</p>
          <p className={`text-[11px] font-semibold mt-1.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Total vouchers via affiliate links</p>
        </div>

        <div onClick={() => setActiveTab('ACTIVE')} className={`p-3.5 rounded-2xl border border-t-4 transition-all cursor-pointer shadow-2xs hover:shadow-sm ${isLight ? 'bg-white border-slate-300 border-t-purple-500 hover:border-slate-400' : 'bg-slate-900/90 border-slate-800 border-t-purple-500'}`}>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Commission Earned</span>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${isLight ? 'bg-purple-100/80 text-purple-800 border border-purple-200' : 'bg-purple-500/20 text-purple-400 font-black'}`}>
              <FiDollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>{formatCedi(statsData?.totalCommissionsEarned || 0)}</p>
          <p className={`text-[11px] font-semibold mt-1.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Total partner payouts</p>
        </div>
      </div>

      {/* Tabs & Search Toolbar */}
      <div className={`p-4 rounded-3xl border transition-colors shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 ${isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'}`}>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => { setActiveTab('ALL'); setCurrentPage(1); }} className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all border ${activeTab === 'ALL' ? isLight ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-700 text-white border-slate-600 shadow-xs' : isLight ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 font-extrabold shadow-2xs' : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>
            <span>All Records</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-300">{statsData?.totalAffiliates || 0}</span>
          </button>
          <button type="button" onClick={() => { setActiveTab('PENDING'); setCurrentPage(1); }} className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all border ${activeTab === 'PENDING' ? isLight ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs' : 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs' : isLight ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 font-extrabold shadow-2xs' : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>
            <span>Pending Review</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-black/15 text-slate-950 dark:bg-white/20 dark:text-white">{statsData?.pendingApprovals || 0}</span>
          </button>
          <button type="button" onClick={() => { setActiveTab('ACTIVE'); setCurrentPage(1); }} className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all border ${activeTab === 'ACTIVE' ? isLight ? 'bg-[#0F8B8D] text-white border-[#0F8B8D] shadow-xs' : 'bg-teal-500 text-slate-950 border-teal-400 shadow-xs' : isLight ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 font-extrabold shadow-2xs' : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>
            <span>Active Partners</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-white/20 text-white dark:bg-black/20 dark:text-slate-950">{statsData?.approvedAffiliates || 0}</span>
          </button>
        </div>
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search partner name, email or ref code..."
            className={`w-full rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none transition-colors border ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D] focus:bg-white' : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500 focus:bg-slate-900'}`}
          />
        </div>
      </div>

      {/* Affiliates List Table */}
      <div className={`rounded-3xl border overflow-hidden transition-colors ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/90 border-slate-800 shadow-xl'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] uppercase font-black ${isLight ? 'border-slate-300 bg-slate-100/90 text-slate-700' : 'border-slate-800 bg-slate-950/50 text-slate-400'}`}>
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
              {isListLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 font-semibold">Loading...</td>
                </tr>
              ) : affiliates.length > 0 ? (
                affiliates.map((a) => (
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
                      {formatCedi(a.totalEarnings)}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <Badge variant={a.status === 'ACTIVE' ? 'success' : a.status === 'PENDING' ? 'warning' : 'error'} className="text-[10px] font-black tracking-wide uppercase px-2.5 py-0.5">
                        {a.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => setViewingAffiliateId(a.id)} title="View Full Affiliate Profile" className={`p-2 rounded-xl border transition-all shadow-2xs ${isLight ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200 hover:text-slate-950' : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white'}`}>
                          <FiEye className="w-4 h-4 text-[#0F8B8D] dark:text-teal-400" />
                        </button>
                        {a.status === 'PENDING' && (
                          <Button variant={isLight ? 'primary' : 'gradient'} size="sm" onClick={() => handleQuickApprove(a.id, a.name)} leftIcon={<FiCheck />} className="font-black text-xs h-8 px-3 rounded-xl shadow-2xs">
                            Approve
                          </Button>
                        )}
                        {a.status === 'ACTIVE' && (
                          <button type="button" onClick={() => handleQuickSuspend(a.id, a.name)} title="Suspend Partner Account" className={`p-2 rounded-xl border transition-all shadow-2xs ${isLight ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100' : 'bg-amber-950/40 border-amber-900/50 text-amber-300 hover:bg-amber-900/60'}`}>
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
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newSize) => { setItemsPerPage(newSize); setCurrentPage(1); }}
          />
        </div>
      </div>
      
      {isConfigOpen && <GlobalConfigModal onClose={() => setIsConfigOpen(false)} />}
      {isCreateOpen && <CreateAffiliateModal onClose={() => setIsCreateOpen(false)} />}
      {isAnalyticsOpen && <AnalyticsModal onClose={() => setIsAnalyticsOpen(false)} />}
    </div>
  );
};

// -- Mini Components for Modals --

const GlobalConfigModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data, isLoading } = useAdminAffiliateConfig();
  const updateMutation = useUpdateAdminAffiliateConfig();
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    commissionPercentage: 0,
    beceSellingPrice: 0,
    wassceSellingPrice: 0,
    beceCommissionGhs: 0,
    wassceCommissionGhs: 0,
    oneTimeRecruitmentBonusGhs: 0,
  });

  React.useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData, {
      onSuccess: () => {
        addToast({ title: 'Config Updated', message: 'Global affiliate config updated successfully.', type: 'success' });
        onClose();
      }
    });
  };

  return (
    <Modal isOpen onClose={onClose} title="Global Affiliate Config">
      {isLoading ? <p>Loading...</p> : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase mb-1">Commission %</label>
              <input type="number" value={formData.commissionPercentage} onChange={e => setFormData({...formData, commissionPercentage: Number(e.target.value)})} className={`w-full p-2 text-sm border rounded-xl ${isLight ? 'bg-white' : 'bg-slate-900'}`} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase mb-1">Recruit Bonus (GHS)</label>
              <input type="number" value={formData.oneTimeRecruitmentBonusGhs} onChange={e => setFormData({...formData, oneTimeRecruitmentBonusGhs: Number(e.target.value)})} className={`w-full p-2 text-sm border rounded-xl ${isLight ? 'bg-white' : 'bg-slate-900'}`} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase mb-1">BECE Selling Price</label>
              <input type="number" value={formData.beceSellingPrice} onChange={e => setFormData({...formData, beceSellingPrice: Number(e.target.value)})} className={`w-full p-2 text-sm border rounded-xl ${isLight ? 'bg-white' : 'bg-slate-900'}`} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase mb-1">WASSCE Selling Price</label>
              <input type="number" value={formData.wassceSellingPrice} onChange={e => setFormData({...formData, wassceSellingPrice: Number(e.target.value)})} className={`w-full p-2 text-sm border rounded-xl ${isLight ? 'bg-white' : 'bg-slate-900'}`} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase mb-1">BECE Commission (GHS)</label>
              <input type="number" value={formData.beceCommissionGhs} onChange={e => setFormData({...formData, beceCommissionGhs: Number(e.target.value)})} className={`w-full p-2 text-sm border rounded-xl ${isLight ? 'bg-white' : 'bg-slate-900'}`} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase mb-1">WASSCE Commission (GHS)</label>
              <input type="number" value={formData.wassceCommissionGhs} onChange={e => setFormData({...formData, wassceCommissionGhs: Number(e.target.value)})} className={`w-full p-2 text-sm border rounded-xl ${isLight ? 'bg-white' : 'bg-slate-900'}`} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
            <Button variant="primary" type="submit" isLoading={updateMutation.isPending}>Save</Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

const CreateAffiliateModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const createMutation = useCreateAdminAffiliate();
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    businessName: '',
    paymentChannel: 'MOBILE_MONEY',
    ussdCode: '',
    status: 'APPROVED' as any,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData, {
      onSuccess: () => {
        addToast({ title: 'Affiliate Created', message: 'Partner created successfully.', type: 'success' });
        onClose();
      },
      onError: () => {
        addToast({ title: 'Error', message: 'Failed to create partner.', type: 'error' });
      }
    });
  };

  return (
    <Modal isOpen onClose={onClose} title="Add New Partner">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-black uppercase mb-1">Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full p-2 text-sm border rounded-xl ${isLight ? 'bg-white' : 'bg-slate-900'}`} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase mb-1">Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full p-2 text-sm border rounded-xl ${isLight ? 'bg-white' : 'bg-slate-900'}`} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase mb-1">Phone</label>
            <input required type="text" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className={`w-full p-2 text-sm border rounded-xl ${isLight ? 'bg-white' : 'bg-slate-900'}`} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase mb-1">Password</label>
            <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className={`w-full p-2 text-sm border rounded-xl ${isLight ? 'bg-white' : 'bg-slate-900'}`} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase mb-1">USSD Code</label>
            <input type="text" value={formData.ussdCode} onChange={e => setFormData({...formData, ussdCode: e.target.value})} placeholder="*920*15#" className={`w-full p-2 text-sm border rounded-xl ${isLight ? 'bg-white' : 'bg-slate-900'}`} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase mb-1">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className={`w-full p-2 text-sm border rounded-xl ${isLight ? 'bg-white' : 'bg-slate-900'}`}>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" type="submit" isLoading={createMutation.isPending}>Create</Button>
        </div>
      </form>
    </Modal>
  );
};

const AnalyticsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [period, setPeriod] = useState('ALL');
  const { data, isLoading } = useAdminAffiliateAnalytics(period);
  const { isLight } = useAdminTheme();

  return (
    <Modal isOpen onClose={onClose} title="Affiliate Analytics & Leaderboards">
      <div className="mb-4">
        <select value={period} onChange={e => setPeriod(e.target.value)} className={`w-full p-2 text-sm border rounded-xl font-black ${isLight ? 'bg-white' : 'bg-slate-900'}`}>
          <option value="ALL">All Time</option>
          <option value="30D">Last 30 Days</option>
          <option value="90D">Last 90 Days</option>
        </select>
      </div>

      {isLoading ? <p className="p-4 text-center">Loading Analytics...</p> : data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border ${isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-900 border-slate-700'}`}>
              <h4 className="text-xs font-black uppercase mb-3">Top 10 Earners</h4>
              {data.topEarners?.length > 0 ? data.topEarners.map((e, idx) => (
                <div key={e.affiliateId} className="flex justify-between text-sm py-1 font-bold border-b last:border-0 border-slate-200 dark:border-slate-800">
                  <span>{idx + 1}. {e.name}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{formatCedi(e.totalEarnings)}</span>
                </div>
              )) : <p className="text-xs opacity-50">No earners yet.</p>}
            </div>
            
            <div className={`p-4 rounded-2xl border ${isLight ? 'bg-blue-50 border-blue-200' : 'bg-slate-900 border-slate-700'}`}>
              <h4 className="text-xs font-black uppercase mb-3">Top 10 Recruiters</h4>
              {data.topRecruiters?.length > 0 ? data.topRecruiters.map((e, idx) => (
                <div key={e.affiliateId} className="flex justify-between text-sm py-1 font-bold border-b last:border-0 border-slate-200 dark:border-slate-800">
                  <span>{idx + 1}. {e.name}</span>
                  <span className="text-blue-600 dark:text-blue-400">{e.recruitsCount} recruits</span>
                </div>
              )) : <p className="text-xs opacity-50">No recruiters yet.</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700'}`}>
              <h4 className="text-xs font-black uppercase mb-2">Voucher Breakdown</h4>
              <div className="flex justify-between text-sm font-bold"><span>BECE:</span> <span>{data.salesBreakdown?.bece || 0}</span></div>
              <div className="flex justify-between text-sm font-bold"><span>WASSCE:</span> <span>{data.salesBreakdown?.wassce || 0}</span></div>
            </div>
            <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700'}`}>
              <h4 className="text-xs font-black uppercase mb-2">Commission Breakdown</h4>
              <div className="flex justify-between text-sm font-bold"><span>Sales:</span> <span>{formatCedi(data.commissionTypes?.sales || 0)}</span></div>
              <div className="flex justify-between text-sm font-bold"><span>Recruitment:</span> <span>{formatCedi(data.commissionTypes?.recruitment || 0)}</span></div>
            </div>
          </div>
        </div>
      ) : <p className="text-xs opacity-50">No data available.</p>}
      
      <div className="flex justify-end mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};
