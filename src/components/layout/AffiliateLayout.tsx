import React, { useState } from 'react';
import type { BaseComponentProps } from '../../types/ui';
import { Button } from '../ui/Button';
import { formatCedi, copyToClipboard } from '../../utils/formatters';
import {
  FiGrid,
  FiLink,
  FiTrendingUp,
  FiDollarSign,
  FiCreditCard,
  FiUser,
  FiCopy,
  FiCheck,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';

export const AffiliateLayout: React.FC<BaseComponentProps> = ({ children }) => {
  const [copied, setCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const referralCode = 'REF-GH-8823';
  const referralLink = `https://resulta.com.gh/?ref=${referralCode}`;
  const pendingPayout = 320.0;

  const handleCopyLink = async () => {
    const success = await copyToClipboard(referralLink);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: FiGrid },
    { id: 'links', label: 'Link & Code Generator', icon: FiLink },
    { id: 'referrals', label: 'Referrals & Sales', icon: FiTrendingUp },
    { id: 'commissions', label: 'Commission Ledger', icon: FiDollarSign },
    { id: 'withdrawals', label: 'Withdrawal History', icon: FiCreditCard },
    { id: 'profile', label: 'MoMo Payout Details', icon: FiUser },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 relative">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 transform shadow-sm ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2">
              <img src="/assets/logo.png" alt="Resulta Logo" className="h-8 w-auto object-contain" />
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-700 p-1"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 border border-teal-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Affiliate Profile Footer */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-500 font-semibold">Available Balance:</span>
              <span className="font-bold text-emerald-700">{formatCedi(pendingPayout)}</span>
            </div>
            <button className="w-full text-xs py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors">
              Cashout to MoMo
            </button>
          </div>

          <Button variant="ghost" size="sm" fullWidth leftIcon={<FiLogOut />}>
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Sticky Bar */}
        <header className="sticky top-0 z-30 h-16 glass-panel border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 capitalize">
              {navItems.find((i) => i.id === activeTab)?.label || 'Affiliate Dashboard'}
            </h1>
          </div>

          {/* Quick Referral Link Banner */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-500">Referral Code:</span>
            <span className="font-mono font-bold text-teal-700">{referralCode}</span>
            <button
              onClick={handleCopyLink}
              className="ml-2 text-slate-600 hover:text-slate-900 p-1 rounded hover:bg-slate-200 transition-colors"
              title="Copy referral link"
            >
              {copied ? <FiCheck className="w-4 h-4 text-emerald-600" /> : <FiCopy className="w-4 h-4" />}
            </button>
          </div>

          {/* Balance & Payout Actions */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="block text-[10px] uppercase font-semibold text-slate-500">Available Balance</span>
              <span className="text-sm font-bold text-emerald-700">{formatCedi(pendingPayout)}</span>
            </div>
            <Button variant="primary" size="sm" leftIcon={<FiCreditCard />}>
              Request Payout
            </Button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
