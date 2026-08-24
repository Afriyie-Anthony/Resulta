import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { formatCedi, formatDate, copyToClipboard } from '../../../../utils/formatters';
import {
  FiTrendingUp,
  FiDollarSign,
  FiCreditCard,
  FiUsers,
  FiCopy,
  FiCheck,
  FiChevronRight,
  FiBarChart2,
  FiPieChart
} from 'react-icons/fi';

interface AffiliateOverviewViewProps {
  onNavigateTab: (tabId: string) => void;
  onRequestPayout: () => void;
}

const EarningsChart: React.FC = () => {
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(6);
  const data: any[] = [];
  const maxRevenue = data.length > 0 ? Math.max(...data.map((d) => d.revenue)) : 1;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FiBarChart2 className="text-teal-600" /> Commission Trajectory (7 Days)
          </h3>
          <p className="text-xs text-slate-500 mt-1">Daily commission earnings from referred sales.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase font-bold text-slate-500">7-Day Total</p>
          <p className="text-lg font-bold text-teal-600">{formatCedi(2805)}</p>
        </div>
      </div>
      
      <div className="flex-1 flex items-end justify-between gap-2 border-b border-dashed border-slate-200 pb-2 relative min-h-[160px]">
        {data.map((item, idx) => {
          const heightPct = Math.max(15, (item.revenue / maxRevenue) * 100);
          const isSelected = selectedBarIndex === idx;
          
          return (
            <div 
              key={item.label} 
              className="flex-1 flex flex-col items-center justify-end gap-2 group cursor-pointer h-full"
              onClick={() => setSelectedBarIndex(idx)}
            >
              <span className={`text-[10px] font-bold transition-opacity duration-200 ${isSelected ? 'opacity-100 text-teal-600' : 'opacity-0 group-hover:opacity-100 text-slate-500'}`}>
                {formatCedi(item.revenue)}
              </span>
              <div 
                className={`w-full max-w-[40px] rounded-t-xl transition-all duration-300 relative overflow-hidden ${isSelected ? 'bg-teal-500 shadow-md shadow-teal-500/20' : 'bg-slate-100 group-hover:bg-teal-100'}`}
                style={{ height: `${heightPct}%` }}
              >
                 {isSelected && <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />}
              </div>
              <span className={`text-[11px] font-bold ${isSelected ? 'text-teal-700' : 'text-slate-400 group-hover:text-slate-600'}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SalesPieChart: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm h-full flex flex-col">
       <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FiPieChart className="text-teal-600" /> Clicks vs Orders
          </h3>
          <p className="text-xs text-slate-500 mt-1">Conversion breakdown by traffic source.</p>
       </div>
       
       <div className="flex-1 py-6 flex items-center justify-center relative">
         <svg className="w-48 h-48 transform -rotate-90 drop-shadow-sm" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="58"
              stroke="currentColor"
              strokeWidth="16"
              fill="transparent"
              className="text-emerald-500"
            />
            <circle
              cx="80"
              cy="80"
              r="58"
              stroke="currentColor"
              strokeWidth="16"
              fill="transparent"
              strokeDasharray={364.4}
              strokeDashoffset={364.4 * 0.65}
              strokeLinecap="round"
              className="text-blue-500"
            />
         </svg>
         <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-6">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">TOTAL CLICKS</span>
            <span className="text-xl font-bold text-slate-900">2,680</span>
         </div>
       </div>

       <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-center">
          <div>
             <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> WhatsApp
             </div>
             <span className="text-sm font-bold text-slate-900 mt-1 block">65%</span>
          </div>
          <div>
             <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Facebook
             </div>
             <span className="text-sm font-bold text-slate-900 mt-1 block">35%</span>
          </div>
       </div>
    </div>
  );
};

export const AffiliateOverviewView: React.FC<AffiliateOverviewViewProps> = ({
  onNavigateTab,
  onRequestPayout,
}) => {
  const [copied, setCopied] = useState(false);
  const referralCode = 'REF-GH-8823';
  const referralLink = `https://resulta.com.gh/?ref=${referralCode}`;

  const handleCopyLink = async () => {
    const success = await copyToClipboard(referralLink);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const recentSales: any[] = [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header (Admin Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-md tracking-wider bg-primary/10 text-primary">
              Direct Partner Account
            </span>
            <span className="text-xs flex items-center gap-1 font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" /> 10% Tier Rate Active
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 transition-colors text-primary">
            Welcome back, Kofi Mensah!
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="primary" size="sm" leftIcon={<FiCreditCard className="w-3.5 h-3.5" />} onClick={onRequestPayout}>
            Request MoMo Cashout
          </Button>
        </div>
      </div>

      {/* Metrics Grid (Admin Style KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Referrals */}
        <div className="p-5 rounded-2xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 shadow-sm bg-emerald-100 border border-emerald-300 hover:bg-emerald-200/70" onClick={() => onNavigateTab('referrals')}>
          <div className="flex justify-between items-start gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider truncate text-emerald-900">
                TOTAL REFERRALS
              </p>
              <p className="text-2xl font-bold tracking-tight truncate text-emerald-950">
                496
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center text-lg bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
              <FiTrendingUp />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-200/80 text-emerald-950">
              +14.2% from last month
            </span>
          </div>
        </div>

        {/* Card 2: Total Earned */}
        <div className="p-5 rounded-2xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 shadow-sm bg-slate-200/90 border border-slate-300 hover:bg-slate-300/80" onClick={() => onNavigateTab('sales')}>
          <div className="flex justify-between items-start gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider truncate text-slate-800">
                TOTAL EARNED
              </p>
              <p className="text-2xl font-bold tracking-tight truncate text-slate-950">
                GH₵ 1,240.00
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center text-lg bg-slate-800 text-white shadow-md shadow-slate-800/30">
              <FiDollarSign />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-300/80 text-slate-900">
              Lifetime earned commissions
            </span>
          </div>
        </div>

        {/* Card 3: Available Cashout */}
        <div className="p-5 rounded-2xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 shadow-sm bg-[#0F8B8D]/20 border border-[#0F8B8D]/40 hover:bg-[#0F8B8D]/30" onClick={() => onNavigateTab('withdrawals')}>
          <div className="flex justify-between items-start gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider truncate text-[#0A2540]">
                AVAILABLE CASHOUT
              </p>
              <p className="text-2xl font-bold tracking-tight truncate text-[#0A2540]">
                {formatCedi(320.0)}
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center text-lg bg-[#0F8B8D] text-white shadow-md shadow-[#0F8B8D]/30">
              <FiCreditCard />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#0F8B8D]/30 text-[#0A2540]">
              Ready for immediate withdrawal
            </span>
          </div>
        </div>

        {/* Card 4: Conversion Rate */}
        <div className="p-5 rounded-2xl transition-all duration-200 shadow-sm bg-cyan-100 border border-cyan-300">
          <div className="flex justify-between items-start gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider truncate text-cyan-950">
                CONVERSION RATE
              </p>
              <p className="text-2xl font-bold tracking-tight truncate text-cyan-950">
                18.5%
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center text-lg bg-cyan-600 text-white shadow-md shadow-cyan-600/30">
              <FiUsers />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-cyan-200/80 text-cyan-950">
              2,680 link clicks → 496 orders
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EarningsChart />
        </div>
        <div>
          <SalesPieChart />
        </div>
      </div>

      {/* Referral Link & Social Sharing Section */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Your Unique Referral Link</span>
              <Badge variant="primary">Active</Badge>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Share this link on WhatsApp, Facebook, or SMS to automatically earn 10% commission per voucher sold.
            </p>
          </div>
          <div className="text-xs text-slate-600 font-medium">
            Affiliate Code: <span className="font-mono font-bold text-teal-600 text-sm ml-1">{referralCode}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-mono focus:outline-none focus:border-teal-500 shadow-inner"
            />
          </div>
          <Button
            variant="primary"
            leftIcon={copied ? <FiCheck className="w-4 h-4 text-white" /> : <FiCopy className="w-4 h-4" />}
            onClick={handleCopyLink}
            className="sm:w-auto shadow-md"
          >
            {copied ? 'Copied Link!' : 'Copy Referral Link'}
          </Button>
        </div>

        {/* Quick Social Action Shortcuts */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-bold mr-2 uppercase tracking-wider">Share directly:</span>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Buy WASSCE/NOVDEC & BECE Result Vouchers instantly on Resulta! ${referralLink}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-all shadow-sm"
          >
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-all shadow-sm"
          >
            Facebook
          </a>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Referral Sales</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Latest voucher sales attributed to your link
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('sales')}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            View All Sales <FiChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-y border-slate-200">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Customer Phone</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Commission</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-teal-600">{sale.id}</td>
                  <td className="px-4 py-3.5 text-slate-600 font-medium">{formatDate(sale.date)}</td>
                  <td className="px-4 py-3.5 text-slate-900 font-bold">
                    {sale.product} <span className="text-slate-500 font-medium text-[10px] ml-1">({sale.qty}x)</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 font-mono font-medium">{sale.customerPhone}</td>
                  <td className="px-4 py-3.5 text-right text-slate-700 font-bold">{formatCedi(sale.totalAmount)}</td>
                  <td className="px-4 py-3.5 text-right font-bold text-emerald-600">{formatCedi(sale.commission)}</td>
                  <td className="px-4 py-3.5 text-center">
                    {sale.status === 'AVAILABLE' ? (
                      <Badge variant="success">Available</Badge>
                    ) : (
                      <Badge variant="warning">Pending</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

