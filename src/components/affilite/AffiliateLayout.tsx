import React, { useState } from 'react';
import type { BaseComponentProps } from '../../types/ui';
import { Button } from '../ui/Button';
import { copyToClipboard, formatGhanaPhone } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import { useAffiliateProfile } from '../../hooks/useAffiliate';
import {
  FiGrid,
  FiCreditCard,
  FiUser,
  FiCopy,
  FiCheck,
  FiLogOut,
  FiMenu,
  FiX,
  FiUsers,
  FiDollarSign,
  FiLayers,
  FiFileText
} from 'react-icons/fi';

export interface AffiliateLayoutProps extends BaseComponentProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  onRequestPayout?: () => void;
}

export const AffiliateLayout: React.FC<AffiliateLayoutProps> = ({
  children,
  activeTab = 'overview',
  onTabChange = () => {},
  onRequestPayout = () => {},
}) => {
  const { user, logout } = useAuth();
  const { data: profile } = useAffiliateProfile();
  const [copied, setCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const referralCode = profile?.affiliateCode || '';
  const referralLink = referralCode ? `https://resulta.com.gh/?ref=${referralCode}` : 'https://resulta.com.gh/';

  const displayName = profile?.user?.name || user?.name || profile?.accountName || 'Affiliate Partner';
  const rawPhone = profile?.phoneNumber || profile?.accountNumber || '';
  const formattedPhone = rawPhone ? formatGhanaPhone(rawPhone) : '';
  const networkText = profile?.network ? ` (${profile.network})` : '';
  const subtitle = formattedPhone ? `${formattedPhone}${networkText}` : (user?.email || 'Affiliate Account');

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase() || 'AN';

  const handleCopyLink = async () => {
    const success = await copyToClipboard(referralLink);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: FiGrid },
    { id: 'referrals', label: 'Referrals (Leads)', icon: FiUsers },
    { id: 'sales', label: 'Sales', icon: FiFileText },
    { id: 'earnings', label: 'Earnings', icon: FiDollarSign },
    { id: 'withdrawals', label: 'Withdrawals', icon: FiLayers },
    { id: 'profile', label: 'Profile', icon: FiUser },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 relative font-sans">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col justify-between overflow-y-auto overflow-x-hidden transition-transform duration-300 transform border-r ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } bg-primary border-primary/95 text-white shadow-2xl shadow-primary/20`}
      >
        <div>
          {/* Header */}
          <div className="h-16 px-4 sm:px-5 flex items-center justify-between border-b shrink-0 border-white/10">
            <div className="flex items-center gap-2">
              <img
                src="/res copy 2-white.png"
                alt="Resulta Logo"
                className="h-6 sm:h-7 w-auto object-contain transition-all shrink-0"
              />
              <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border shrink-0 bg-white/15 text-teal-200 border-white/20">
                AFFILIATE
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white p-1 transition-colors shrink-0"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-6">
            <div className="space-y-1.5">
              <div className="px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white/65">
                PORTAL
              </div>
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 rounded-r-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-black/20 text-[#F2C14E] font-bold border-l-4 border-[#F2C14E] shadow-sm'
                          : 'text-white/90 hover:text-white hover:bg-white/10 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#F2C14E]' : 'text-white/80'}`} />
                        <span className="text-left whitespace-nowrap truncate">{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>

        {/* Affiliate Profile Footer */}
        <div className="p-4 border-t shrink-0 transition-colors border-white/10 bg-primary/95 space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-black/20 border border-white/10 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-white/10 text-white font-semibold flex items-center justify-center text-sm border border-white/20 shrink-0">
              {initials}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{displayName}</p>
              <p className="text-[10px] text-white/60 font-medium truncate">{subtitle}</p>
            </div>
          </div>

          <Button
            variant="danger"
            size="sm"
            fullWidth
            leftIcon={<FiLogOut className="shrink-0" />}
            onClick={logout}
            className="bg-rose-600! hover:bg-rose-500! text-white! font-medium shadow-md shadow-rose-950/50 border border-rose-400/20 transition-all"
          >
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Sticky Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            {/* Quick Referral Link Banner */}
            <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs shadow-sm">
              <span className="text-slate-500 font-medium">Referral Code:</span>
              <span className="font-mono font-bold text-teal-600">{referralCode}</span>
              <button
                onClick={handleCopyLink}
                className="ml-2 text-slate-400 hover:text-teal-600 p-1 rounded hover:bg-slate-200/50 transition-colors"
                title="Copy referral link"
              >
                {copied ? <FiCheck className="w-4 h-4 text-emerald-500" /> : <FiCopy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Balance & Payout Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="gradient"
              size="sm"
              leftIcon={<FiCreditCard className="w-4 h-4" />}
              onClick={onRequestPayout}
              className="!shadow-sm"
            >
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

