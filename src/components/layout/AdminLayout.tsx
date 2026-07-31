import React, { useState } from 'react';
import type { BaseComponentProps } from '../../types/ui';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  FiGrid,
  FiBox,
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiCreditCard,
  FiBarChart2,
  FiShield,
  FiSettings,
  FiBell,
  FiSearch,
  FiMenu,
  FiX,
  FiLogOut
} from 'react-icons/fi';

export interface AdminLayoutProps extends BaseComponentProps {
  userRole?: 'SUPER_ADMIN' | 'ADMIN' | 'INVENTORY_MANAGER' | 'FINANCE_MANAGER' | 'SUPPORT_AGENT';
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  userRole = 'SUPER_ADMIN',
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const adminNav = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: FiGrid },
    { id: 'inventory', label: 'Voucher Inventory Vault', icon: FiBox, badge: '1.4k', badgeColor: 'success' as const },
    { id: 'orders', label: 'Transactions & Fulfillment', icon: FiShoppingBag },
    { id: 'affiliates', label: 'Affiliates & Partners', icon: FiUsers },
    { id: 'payouts', label: 'Commission Payout Queue', icon: FiDollarSign, badge: '2 Pending', badgeColor: 'warning' as const },
    { id: 'ussd', label: 'USSD Channel Monitoring', icon: FiCreditCard },
    { id: 'analytics', label: 'Revenue & Sales Reports', icon: FiBarChart2 },
    { id: 'security', label: 'Audit Trail & Fraud Prevention', icon: FiShield },
    { id: 'settings', label: 'System Settings & Rates', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 relative selection:bg-teal-600 selection:text-white">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 transform shadow-sm ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Admin Header */}
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
          <div className="p-4 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Management Suite
            </div>
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 border border-teal-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant={item.badgeColor || 'neutral'} className="text-[10px]">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Profile & Role Info */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-9 h-9 rounded-xl bg-teal-100 border border-teal-200 text-teal-800 font-bold flex items-center justify-center text-sm">
              SA
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">System Administrator</p>
              <Badge variant="primary" className="text-[9px] mt-0.5">
                {userRole}
              </Badge>
            </div>
          </div>

          <Button variant="ghost" size="sm" fullWidth leftIcon={<FiLogOut />}>
            Logout Admin
          </Button>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Topbar */}
        <header className="sticky top-0 z-30 h-16 glass-panel border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <div className="relative w-full hidden sm:block">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, phone numbers, vouchers, affiliates..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 shadow-xs"
              />
            </div>
          </div>

          {/* Right Status Indicators */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Live
            </div>

            <button className="relative p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors">
              <FiBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-600" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
