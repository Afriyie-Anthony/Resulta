import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import { useNotifications, useMarkAllRead, useMarkRead } from '../../../hooks/useNotifications';
import {
  FiBell,
  FiAlertTriangle,
  FiCheckCircle,
  FiCheckSquare,
  FiInfo,
  FiSearch,
  FiShoppingBag,
  FiUsers,
  FiRefreshCw
} from 'react-icons/fi';

export const NotificationsView: React.FC = () => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();
  
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'SECURITY' | 'SYSTEM'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch real data
  const { data: notificationsData, isLoading, isError, refetch, isFetching } = useNotifications({
    read: activeFilter === 'UNREAD' ? false : undefined,
    type: activeFilter === 'SECURITY' ? 'SECURITY' : activeFilter === 'SYSTEM' ? 'SYSTEM' : undefined,
    limit: 50, // Fetch up to 50 recent notifications
  });

  const markAllReadMutation = useMarkAllRead();
  const markReadMutation = useMarkRead();

  const alerts = notificationsData?.notifications || [];
  const unreadCount = notificationsData?.unreadCount || 0;

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate(undefined, {
      onSuccess: () => {
        addToast({
          title: 'Notifications Marked as Read',
          message: 'All system notifications marked as read.',
          type: 'success',
          duration: 3000
        });
      },
      onError: () => {
        addToast({
          title: 'Error',
          message: 'Failed to mark notifications as read.',
          type: 'error',
          duration: 3000
        });
      }
    });
  };

  const handleToggleRead = (id: string, currentlyRead: boolean) => {
    if (currentlyRead) return; // API only supports marking as read, not unread
    
    markReadMutation.mutate(id, {
      onSuccess: () => {
        // Success handled by query invalidation
      }
    });
  };

  // Client-side search filter
  const filteredAlerts = alerts.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SECURITY':
        return <FiAlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'SYSTEM':
        return <FiInfo className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
      case 'STOCK':
        return <FiShoppingBag className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'AFFILIATE':
        return <FiUsers className="w-5 h-5 text-[#0F8B8D] dark:text-teal-400" />;
      default:
        return <FiBell className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
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
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                System Alerts & Notification Center
              </h1>
              {isFetching && <FiRefreshCw className="w-4 h-4 text-teal-500 animate-spin" />}
            </div>
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
            disabled={unreadCount === 0 || markAllReadMutation.isPending}
            leftIcon={<FiCheckSquare />}
            className="font-black text-xs h-11 px-4 rounded-2xl"
          >
            Mark All Read
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
            {unreadCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-rose-600 text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('SECURITY')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all border ${
              activeFilter === 'SECURITY'
                ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                : isLight
                ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 font-extrabold shadow-2xs'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>Security</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('SYSTEM')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all border ${
              activeFilter === 'SYSTEM'
                ? 'bg-cyan-600 text-white border-cyan-500 shadow-xs'
                : isLight
                ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 font-extrabold shadow-2xs'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>System</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notification messages..."
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
        {isLoading ? (
          <div className={`p-12 text-center rounded-3xl border transition-colors ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
          }`}>
            <FiRefreshCw className="w-8 h-8 mx-auto mb-3 text-slate-400 animate-spin" />
            <p className="text-sm font-bold text-slate-500">Loading notifications...</p>
          </div>
        ) : isError ? (
          <div className={`p-12 text-center rounded-3xl border transition-colors ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
          }`}>
            <p className="text-sm font-bold text-rose-500 mb-2">Failed to load notifications.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>Try Again</Button>
          </div>
        ) : filteredAlerts.length === 0 ? (
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
                  a.type === 'SECURITY'
                    ? 'bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-400'
                  : a.type === 'STOCK'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-400'
                  : 'bg-cyan-100 text-cyan-800 border border-cyan-300 dark:bg-teal-500/20 dark:text-teal-400'
                }`}>
                  {getCategoryIcon(a.type)}
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
                      {a.type}
                    </span>
                  </div>

                  <p className={`text-xs font-semibold mt-1 leading-relaxed ${
                    isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    {a.message}
                  </p>

                  <span className={`inline-block mt-2 text-[10px] font-mono font-bold ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {new Date(a.createdAt).toLocaleString()} • {a.id}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!a.read && (
                  <button
                    type="button"
                    onClick={() => handleToggleRead(a.id, a.read)}
                    disabled={markReadMutation.isPending}
                    title="Mark as Read"
                    className={`p-2 rounded-xl border text-xs font-black transition-all ${
                      isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <FiCheckCircle className="w-4 h-4 text-slate-400 hover:text-emerald-500 transition-colors" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
