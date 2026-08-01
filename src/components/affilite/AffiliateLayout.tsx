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
    <div className="min-h-screen flex bg-slate-950 text-slate-100 relative">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
                A
              </div>
              <div>
                <span className="font-bold text-base text-white tracking-wide">RESULTA</span>
                <span className="block text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                  Affiliate Portal
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
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
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Affiliate Profile Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-sm border border-teal-500/30">
              KA
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Kofi Mensah</p>
              <p className="text-[10px] text-slate-400 truncate">024 123 4567 (MTN)</p>
            </div>
          </div>

          <Button variant="ghost" size="sm" fullWidth leftIcon={<FiLogOut />}>
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Sticky Bar */}
        <header className="sticky top-0 z-30 h-16 glass-panel border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-white capitalize">
              {navItems.find((i) => i.id === activeTab)?.label || 'Affiliate Dashboard'}
            </h1>
          </div>

          {/* Quick Referral Link Banner */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-400">Referral Code:</span>
            <span className="font-mono font-bold text-teal-400">{referralCode}</span>
            <button
              onClick={handleCopyLink}
              className="ml-2 text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
              title="Copy referral link"
            >
              {copied ? <FiCheck className="w-4 h-4 text-emerald-400" /> : <FiCopy className="w-4 h-4" />}
            </button>
          </div>

          {/* Balance & Payout Actions */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="block text-[10px] uppercase font-semibold text-slate-400">Available Balance</span>
              <span className="text-sm font-extrabold text-emerald-400">{formatCedi(pendingPayout)}</span>
            </div>
            <Button variant="gradient" size="sm" leftIcon={<FiCreditCard />}>
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
