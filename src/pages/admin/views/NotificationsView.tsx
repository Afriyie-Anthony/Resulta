import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import {
  FiBell,
  FiAlertTriangle,
  FiCheckCircle,
  FiTrash2,
  FiCheckSquare,
  FiInfo,
  FiSearch,
  FiShoppingBag,
  FiUsers
} from 'react-icons/fi';

interface NotificationItem {
  id: string;
  title: string;
  category: 'STOCK' | 'CRITICAL' | 'AFFILIATE' | 'SYSTEM';
  time: string;
  desc: string;
  read: boolean;
}

export const NotificationsView: React.FC = () => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'CRITICAL' | 'STOCK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [alerts, setAlerts] = useState<NotificationItem[]>([
    { id: 'ALT-101', title: 'BECE 2026 PIN Stock Below 15%', category: 'STOCK', time: '10 mins ago', desc: 'Current unallocated BECE voucher stock is at 133 units. Recommended safety import threshold is 500 PINs.', read: false },
    { id: 'ALT-102', title: 'Mobile Money Gateway High Response Latency', category: 'CRITICAL', time: '42 mins ago', desc: 'Average payment provider response time reached 140ms due to high traffic volume. Automated SMS dispatch remains operational.', read: false },
    { id: 'ALT-103', title: 'New Affiliate Partner Payout Request', category: 'AFFILIATE', time: '1 hour ago', desc: 'Kwabena Mensah requested withdrawal of GH₵ 450.00 to assigned payout phone number.', read: false },
    { id: 'ALT-104', title: 'WASSCE 2026 Low Stock Alert Triggered', category: 'STOCK', time: '2 hours ago', desc: 'Unallocated WASSCE checker stock has dropped below 500 units.', read: false },
    { id: 'ALT-105', title: 'Database Automated Backup Successful', category: 'SYSTEM', time: '4 hours ago', desc: 'Cryptographic PIN registry backup snapshot successfully archived to secure cloud storage.', read: true },
    { id: 'ALT-106', title: 'New Super Admin Account Provisioned', category: 'SYSTEM', time: '5 hours ago', desc: 'System Administrator provisioned new Super Admin account for Ama Serwaa.', read: true },
    { id: 'ALT-107', title: 'Bulk SMS Campaign Broadcast Completed', category: 'SYSTEM', time: '6 hours ago', desc: 'Dispatched 2,216 SMS messages to BECE Candidates cohort with 99.94% delivery rate.', read: true },
    { id: 'ALT-108', title: 'Affiliate Application Pending Review', category: 'AFFILIATE', time: '8 hours ago', desc: 'Kofi Mensah submitted a new partner distributor application for approval.', read: false },
    { id: 'ALT-109', title: 'USSD Shortcode *713# Traffic Spike', category: 'SYSTEM', time: '12 hours ago', desc: 'USSD feature phone checkout experienced a 35% surge in hourly voucher purchases.', read: false },
    { id: 'ALT-110', title: 'Security Audit Log Snapshot Compiled', category: 'SYSTEM', time: '1 day ago', desc: 'Admin authentication and privilege modification log compiled for review.', read: true },
  ]);

  const unreadCount = alerts.filter(a => !a.read).length;
  const criticalCount = alerts.filter(a => a.category === 'CRITICAL').length;
  const stockCount = alerts.filter(a => a.category === 'STOCK').length;

  const handleMarkAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    addToast({
      title: 'Notifications Marked as Read',
      message: 'All system notifications marked as read.',
      type: 'success',
      duration: 3000
    });
  };

  const handleClearAll = () => {
    setAlerts([]);
    addToast({
      title: 'Notification Center Cleared',
      message: 'Removed all notification alerts.',
      type: 'info',
      duration: 3000
    });
  };

  const handleDismissSingle = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleToggleRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: !a.read } : a));
  };

  const filteredAlerts = alerts.filter(a => {
    const matchesFilter =
      activeFilter === 'ALL' ||
      (activeFilter === 'UNREAD' && !a.read) ||
      (activeFilter === 'CRITICAL' && a.category === 'CRITICAL') ||
      (activeFilter === 'STOCK' && a.category === 'STOCK');

    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'CRITICAL':
        return <FiAlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'STOCK':
        return <FiShoppingBag className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'AFFILIATE':
        return <FiUsers className="w-5 h-5 text-[#0F8B8D] dark:text-teal-400" />;
      default:
        return <FiInfo className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className={`p-2.5 rounded-2xl relative ${
            isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/20 text-teal-400'
          }`}>
            <FiBell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              System Alerts & Notification Center
            </h1>
            <p className={`text-xs sm:text-sm font-semibold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Real-time automated alarms for voucher inventory depletion, payment gateway anomalies, and administrative events.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant={isLight ? 'outline' : 'secondary'}
            size="md"
            onClick={handleMarkAllRead}
            leftIcon={<FiCheckSquare />}
            className="font-black text-xs h-11 px-4 rounded-2xl"
          >
            Mark All Read
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={handleClearAll}
            leftIcon={<FiTrash2 className="text-rose-600" />}
            className="font-black text-xs h-11 px-4 rounded-2xl text-rose-700 hover:bg-rose-50"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search Toolbar */}
      <div className={`p-4 rounded-3xl border transition-colors shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all border ${
              activeFilter === 'ALL'
                ? isLight
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-700 text-white border-slate-600 shadow-xs'
                : isLight
                ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 font-extrabold shadow-2xs'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>All Alerts</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-300">
              {alerts.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('UNREAD')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all border ${
              activeFilter === 'UNREAD'
                ? isLight
                  ? 'bg-[#0F8B8D] text-white border-[#0F8B8D] shadow-xs'
                  : 'bg-teal-500 text-slate-950 border-teal-400 shadow-xs'
                : isLight
                ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 font-extrabold shadow-2xs'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>Unread Alerts</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-rose-600 text-white">
              {unreadCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('CRITICAL')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all border ${
              activeFilter === 'CRITICAL'
                ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                : isLight
                ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 font-extrabold shadow-2xs'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>System Critical</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-300">
              {criticalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('STOCK')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all border ${
              activeFilter === 'STOCK'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                : isLight
                ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 font-extrabold shadow-2xs'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>Voucher Stock</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-300">
              {stockCount}
            </span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notification titles..."
            className={`w-full rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none transition-colors border ${
              isLight
                ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D] focus:bg-white'
                : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500 focus:bg-slate-900'
            }`}
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className={`p-12 text-center rounded-3xl border transition-colors ${
            isLight ? 'bg-white border-slate-300 text-slate-600' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <FiCheckCircle className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
            <p className="text-base font-black text-slate-950 dark:text-white">All Caught Up!</p>
            <p className="text-xs font-semibold mt-1 text-slate-600 dark:text-slate-400">
              There are currently no active automated system warnings or unhandled notifications matching your filter.
            </p>
          </div>
        ) : (
          filteredAlerts.map((a) => (
            <div
              key={a.id}
              className={`p-4 sm:p-5 rounded-3xl border flex items-start justify-between gap-4 transition-all shadow-2xs ${
                !a.read
                  ? isLight
                    ? 'bg-white border-[#0F8B8D]/40 border-l-4 border-l-[#0F8B8D]'
                    : 'bg-slate-900 border-teal-500/40 border-l-4 border-l-teal-500'
                  : isLight
                  ? 'bg-slate-50/70 border-slate-300 opacity-80'
                  : 'bg-slate-900/60 border-slate-800 opacity-80'
              }`}
            >
              <div className="flex gap-3.5 items-start">
                <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center ${
                  a.category === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-400'
                    : a.category === 'STOCK'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-400'
                    : 'bg-cyan-100 text-cyan-800 border border-cyan-300 dark:bg-teal-500/20 dark:text-teal-400'
                }`}>
                  {getCategoryIcon(a.category)}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`text-sm font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                      {a.title}
                    </h4>
                    {!a.read && (
                      <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" title="Unread Alert" />
                    )}
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${
                      isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}>
                      {a.category}
                    </span>
                  </div>

                  <p className={`text-xs font-semibold mt-1 leading-relaxed ${
                    isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    {a.desc}
                  </p>

                  <span className={`inline-block mt-2 text-[10px] font-mono font-bold ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {a.time} • {a.id}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleRead(a.id)}
                  title={a.read ? 'Mark as Unread' : 'Mark as Read'}
                  className={`p-2 rounded-xl border text-xs font-black transition-all ${
                    isLight
                      ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <FiCheckCircle className={`w-4 h-4 ${a.read ? 'text-emerald-600' : 'text-slate-400'}`} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDismissSingle(a.id)}
                  title="Dismiss Notification"
                  className={`p-2 rounded-xl border text-xs font-black transition-all ${
                    isLight
                      ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100'
                      : 'bg-rose-950/40 border-rose-900/50 text-rose-400 hover:bg-rose-900/60'
                  }`}
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
