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
  const [activeTab, setActiveTab] = useState('overview');

  const adminNav = [
    { id: 'overview', label: 'Dashboard Overview', icon: FiGrid },
    { id: 'inventory', label: 'Voucher Inventory', icon: FiBox, badge: 'Low Stock', badgeColor: 'warning' as const },
    { id: 'orders', label: 'Orders & Fulfillment', icon: FiShoppingBag },
    { id: 'payments', label: 'Payments & Callbacks', icon: FiDollarSign },
    { id: 'affiliates', label: 'Affiliates & Partners', icon: FiUsers, badge: '4 Pending', badgeColor: 'info' as const },
    { id: 'withdrawals', label: 'Withdrawal Approvals', icon: FiCreditCard, badge: '2 Requests', badgeColor: 'warning' as const },
    { id: 'reports', label: 'Reports & Analytics', icon: FiBarChart2 },
    { id: 'audit', label: 'Audit Logs & Security', icon: FiShield },
    { id: 'settings', label: 'System Settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 relative selection:bg-teal-500 selection:text-white">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Admin Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-teal-900/40">
                R
              </div>
              <div>
                <span className="font-extrabold text-base text-white tracking-tight">RESULTA</span>
                <span className="block text-[10px] text-teal-400 font-bold uppercase tracking-widest -mt-0.5">
                  Control Center
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
          <div className="p-4 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
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
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
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
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-teal-600/30 border border-teal-500/40 text-teal-300 font-bold flex items-center justify-center text-sm">
              SA
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">System Administrator</p>
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
        <header className="sticky top-0 z-30 h-16 glass-panel border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <div className="relative w-full hidden sm:block">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, phone numbers, vouchers, affiliates..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Right Status Indicators */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              System Live
            </div>

            <button className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
              <FiBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
