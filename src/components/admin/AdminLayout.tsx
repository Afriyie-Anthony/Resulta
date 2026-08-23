import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { BaseComponentProps } from '../../types/ui';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/Toast';
import { AdminThemeProvider, useAdminTheme } from '../../contexts/AdminThemeContext';
import {
  FiGrid,
  FiTag,
  FiShoppingBag,
  FiUsers,
  FiCalendar,
  FiUserCheck,
  FiInbox,
  FiUserPlus,
  FiMessageSquare,
  FiBarChart2,
  FiSettings,
  FiBell,
  FiSearch,
  FiMenu,
  FiX,
  FiLogOut,
  FiSun,
  FiMoon,
  FiDollarSign,
  FiShield
} from 'react-icons/fi';

export interface AdminLayoutProps extends BaseComponentProps {
  userRole?: 'SUPER_ADMIN' | 'ADMIN' | 'INVENTORY_MANAGER' | 'FINANCE_MANAGER' | 'SUPPORT_AGENT';
}

const AdminLayoutContent: React.FC<AdminLayoutProps> = ({
  children,
  userRole: _userRole = 'SUPER_ADMIN',
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { addToast } = useToast();
  const { isLight, toggleTheme } = useAdminTheme();

  // Grouped Navigation Structure matching reference specification
  const navGroups = [
    {
      title: 'GENERAL',
      items: [
        { id: 'overview', path: '/admin/overview', label: 'Dashboard', icon: FiGrid },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { id: 'inventory', path: '/admin/inventory', label: 'Voucher Stock', icon: FiTag },
        { id: 'orders', path: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
        { id: 'customers', path: '/admin/customers', label: 'Customers', icon: FiUsers },
        { id: 'timetables', path: '/admin/timetables', label: 'Timetables', icon: FiCalendar },
        { id: 'users', path: '/admin/users', label: 'Users', icon: FiUserCheck },
        { id: 'contacts', path: '/admin/contacts', label: 'Support Inbox', icon: FiInbox },
        { id: 'affiliates', path: '/admin/affiliates', label: 'Affiliates', icon: FiUserPlus },
      ],
    },
    {
      title: 'FINANCE & PAYMENTS',
      items: [
        { id: 'withdrawals', path: '/admin/withdrawals', label: 'Withdrawals', icon: FiDollarSign },
      ],
    },
    {
      title: 'TOOLS & REPORTS',
      items: [
        { id: 'sms', path: '/admin/sms', label: 'SMS Module', icon: FiMessageSquare },
        { id: 'reports', path: '/admin/reports', label: 'Reports', icon: FiBarChart2 },
        { id: 'audit', path: '/admin/audit', label: 'Audit Logs', icon: FiShield },
        { id: 'settings', path: '/admin/settings', label: 'Settings', icon: FiSettings },
        { id: 'notifications', path: '/admin/notifications', label: 'Notifications', icon: FiBell },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    addToast({
      title: 'Admin Signed Out',
      message: 'You have securely logged out of the Control Center.',
      type: 'info',
    });
    navigate('/admin/login');
  };

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 relative ${
        isLight
          ? 'bg-slate-200/80 text-text-primary selection:bg-secondary selection:text-white font-primary'
          : 'bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-white font-primary'
      }`}
    >
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Fixed Admin Sidebar Navigation – W-[300PX] to prevent item wrapping */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col justify-between overflow-y-auto transition-transform duration-300 transform border-r ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          isLight
            ? 'bg-primary border-primary/95 text-white shadow-2xl shadow-primary/20'
            : 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl'
        }`}
      >
        <div>
          {/* Admin Header with Brand Logo */}
          <div
            className={`h-16 px-6 flex items-center justify-between border-b shrink-0 transition-colors ${
              isLight ? 'border-white/10' : 'border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src="/res copy 2-white.png"
                alt="Resulta Logo"
                className="h-8 sm:h-9 w-auto object-contain transition-all shrink-0"
              />
              <span
                className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border shrink-0 ${
                  isLight
                    ? 'bg-white/15 text-teal-200 border-white/20'
                    : 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                }`}
              >
                ADMIN
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white p-1 transition-colors shrink-0"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Grouped Navigation Items */}
          <div className="p-3 space-y-6">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-1.5">
                <div
                  className={`px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider ${
                    isLight ? 'text-white/65' : 'text-slate-400'
                  }`}
                >
                  {group.title}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      location.pathname === item.path ||
                      (item.id === 'overview' && (location.pathname === '/admin' || location.pathname === '/admin/'));
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(item.path);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 rounded-r-xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-black/20 text-[#F2C14E] font-black border-l-4 border-[#F2C14E] shadow-sm'
                            : isLight
                            ? 'text-white/90 hover:text-white hover:bg-white/10 border-l-4 border-transparent'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#F2C14E]' : (isLight ? 'text-white/80' : 'text-slate-400')}`} />
                          <span className="text-left whitespace-nowrap truncate">{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer with Logout Button */}
        <div
          className={`p-4 border-t shrink-0 transition-colors ${
            isLight ? 'border-white/10 bg-primary/95' : 'border-slate-800 bg-slate-900'
          }`}
        >
          <Button
            variant="danger"
            size="sm"
            fullWidth
            leftIcon={<FiLogOut className="shrink-0" />}
            onClick={handleLogout}
            className="bg-rose-600! hover:bg-rose-500! text-white! font-bold shadow-md shadow-rose-950/50 border border-rose-400/20 transition-all"
          >
            Logout Admin
          </Button>
        </div>
      </aside>

      {/* Main Admin Content Container (with lg:pl-64 offset to accommodate fixed w-64 sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Admin Topbar */}
        <header
          className={`sticky top-0 z-30 h-16 border-b px-4 sm:px-6 flex items-center justify-between gap-4 transition-all duration-300 ${
            isLight ? 'bg-surface/90 backdrop-blur-md border-border shadow-2xs' : 'glass-panel border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isLight ? 'text-text-secondary hover:text-text-primary hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <div className="relative w-full hidden sm:block">
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? 'text-text-secondary/70' : 'text-slate-400'}`} />
              <input
                type="text"
                placeholder="Search orders, phone numbers, vouchers, affiliates..."
                className={`w-full rounded-xl pl-9 pr-4 py-1.5 text-xs font-medium focus:outline-none transition-all border ${
                  isLight
                    ? 'bg-slate-100 border-border text-text-primary placeholder-text-secondary/60 focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/15'
                    : 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-teal-500'
                }`}
              />
            </div>
          </div>

          {/* Right Status Indicators & Theme Switcher */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-2xs ${
                isLight
                  ? 'bg-slate-100 border-border text-text-primary hover:bg-slate-200/60'
                  : 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
              }`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLight ? (
                <>
                  <FiMoon className="w-3.5 h-3.5 text-primary" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <FiSun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              )}
            </button>

            <div
              className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold border ${
                isLight
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-2xs'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Live
            </div>

            <button
              type="button"
              onClick={() => navigate('/admin/notifications')}
              title="View Notifications & System Alerts"
              className={`relative p-2 rounded-xl transition-all shadow-2xs ${
                isLight
                  ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-300'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <FiBell className="w-5 h-5 text-[#0F8B8D] dark:text-teal-400" />
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-xs border-2 border-white dark:border-slate-900">
                10
              </span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};

export const AdminLayout: React.FC<AdminLayoutProps> = (props) => {
  return (
    <AdminThemeProvider>
      <AdminLayoutContent {...props} />
    </AdminThemeProvider>
  );
};
