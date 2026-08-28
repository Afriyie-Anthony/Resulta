import React, { useState } from 'react';
import {
  useNotifications,
  useNotificationTypes,
  useMarkRead,
  useMarkAllRead,
} from '../../../hooks/useNotifications';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';
import { useToast } from '../../../components/ui/Toast';
import {
  FiBell,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
  FiShoppingBag,
  FiUsers,
  FiSearch,
  FiRefreshCw,
  FiCheckSquare,
  FiLayers,
} from 'react-icons/fi';

type FilterType = 'ALL' | 'UNREAD' | 'SECURITY' | 'SYSTEM' | 'STOCK' | 'AFFILIATE';

const ITEMS_PER_PAGE = 15;

export const NotificationsView: React.FC = () => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();

  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [markingId, setMarkingId] = useState<string | null>(null);

  // Derive query params from active filter
  const queryParams = {
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    type:
      activeFilter === 'ALL' || activeFilter === 'UNREAD' ? undefined : activeFilter,
    read: activeFilter === 'UNREAD' ? false : undefined,
  };

  // TanStack Query hooks
  const { data: notificationsData, isLoading, isError, isFetching, refetch } =
    useNotifications(queryParams);

  const { data: typesData } = useNotificationTypes();

  const markReadMutation = useMarkRead();
  const markAllReadMutation = useMarkAllRead();

  const alerts = notificationsData?.notifications || [];
  const totalItems = notificationsData?.pagination?.total ?? alerts.length;
  const totalPages = notificationsData?.pagination?.totalPages ?? 1;
  const unreadCount = notificationsData?.unreadCount ?? typesData?.totalUnreadCount ?? 0;

  // Per-type unread counts from the types breakdown endpoint
  const getTypeUnread = (type: string): number => {
    if (!typesData?.byType) return 0;
    return typesData.byType.find((t) => t.type === type)?.unreadCount ?? 0;
  };

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkAllRead = () => {
    if (unreadCount === 0) return;

    markAllReadMutation.mutate(undefined, {
      onSuccess: () => {
        addToast({
          title: 'All Alerts Cleared',
          message: 'All notifications marked as read.',
          type: 'success',
          duration: 3000,
        });
      },
      onError: () => {
        addToast({
          title: 'Error',
          message: 'Failed to mark notifications as read.',
          type: 'error',
          duration: 3000,
        });
      },
    });
  };

  const handleToggleRead = (id: string, currentlyRead: boolean) => {
    if (currentlyRead) return;

    setMarkingId(id);
    markReadMutation.mutate(id, {
      onSuccess: () => {
        setMarkingId(null);
        addToast({
          title: 'Marked as Read',
          message: 'Notification marked as read.',
          type: 'success',
          duration: 2000,
        });
      },
      onError: () => {
        setMarkingId(null);
        addToast({
          title: 'Error',
          message: 'Failed to mark notification as read.',
          type: 'error',
          duration: 3000,
        });
      },
    });
  };

  // Client-side search filter (within current page)
  const filteredAlerts = alerts.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.message.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q)
    );
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SECURITY':
        return <FiAlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'SYSTEM':
        return <FiInfo className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
      case 'STOCK':
        return <FiShoppingBag className="w-5 h-5 text-amber-700 dark:text-amber-300" />;
      case 'AFFILIATE':
        return <FiUsers className="w-5 h-5 text-[#0F8B8D] dark:text-teal-400" />;
      default:
        return <FiBell className="w-5 h-5 text-slate-700 dark:text-slate-300" />;
    }
  };

  // Filter tab config
  const filterTabs: {
    id: FilterType;
    label: string;
    activeClass: string;
    badgeCount?: number;
  }[] = [
    {
      id: 'ALL',
      label: 'All Alerts',
      activeClass: isLight
        ? 'bg-slate-900 text-white border-slate-900'
        : 'bg-slate-100 text-slate-950 border-white',
    },
    {
      id: 'UNREAD',
      label: 'Unread',
      activeClass: isLight
        ? 'bg-[#0F8B8D] text-white border-[#0F8B8D]'
        : 'bg-teal-500 text-slate-950 border-teal-400',
      badgeCount: unreadCount,
    },
    {
      id: 'SECURITY',
      label: 'Security',
      activeClass: 'bg-rose-600 text-white border-rose-500',
      badgeCount: getTypeUnread('SECURITY'),
    },
    {
      id: 'SYSTEM',
      label: 'System',
      activeClass: 'bg-cyan-600 text-white border-cyan-500',
      badgeCount: getTypeUnread('SYSTEM'),
    },
    {
      id: 'STOCK',
      label: 'Stock',
      activeClass: 'bg-amber-500 text-slate-950 border-amber-400',
      badgeCount: getTypeUnread('STOCK'),
    },
    {
      id: 'AFFILIATE',
      label: 'Affiliate',
      activeClass: isLight
        ? 'bg-[#0F8B8D] text-white border-[#0F8B8D]'
        : 'bg-teal-600 text-white border-teal-500',
      badgeCount: getTypeUnread('AFFILIATE'),
    },
  ];

  const inactiveTabClass = isLight
    ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 hover:text-slate-950 shadow-2xs'
    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 flex-wrap">
          <div
            className={`p-3 rounded-2xl relative shadow-xs ${
              isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/20 text-teal-300'
            }`}
          >
            <FiBell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900 animate-in fade-in zoom-in-75">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1
                className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}
              >
                System Alerts &amp; Notification Center
              </h1>
              {isFetching && <FiRefreshCw className="w-4 h-4 text-teal-500 animate-spin" />}
            </div>
            <p
              className={`text-xs sm:text-sm font-semibold mt-1 ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
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
            {markAllReadMutation.isPending ? 'Marking...' : 'Mark All Read'}
          </Button>
        </div>
      </div>

      {/* KPI Type Breakdown Strip */}
      {typesData?.byType && typesData.byType.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total Unread */}
          <div
            className={`p-3 rounded-2xl border text-center shadow-2xs ${
              isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <span
              className={`text-[10px] font-black uppercase tracking-wider block ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              Total Unread
            </span>
            <p
              className={`text-2xl font-black mt-0.5 ${
                unreadCount > 0 ? 'text-rose-600 dark:text-rose-400' : isLight ? 'text-slate-950' : 'text-white'
              }`}
            >
              {typesData.totalUnreadCount}
            </p>
          </div>
          {/* Per-type breakdown */}
          {typesData.byType.map((t) => (
            <button
              key={t.type}
              type="button"
              onClick={() => handleFilterChange(t.type as FilterType)}
              className={`p-3 rounded-2xl border text-center shadow-2xs transition-all hover:shadow-sm ${
                activeFilter === t.type
                  ? isLight
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-teal-500/20 border-teal-500/60 text-teal-300'
                  : isLight
                  ? 'bg-white border-slate-300 hover:border-slate-400'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span
                className={`text-[10px] font-black uppercase tracking-wider block ${
                  activeFilter === t.type
                    ? isLight ? 'text-slate-300' : 'text-teal-400'
                    : isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {t.type}
              </span>
              <p
                className={`text-xl font-black mt-0.5 ${
                  t.unreadCount > 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : activeFilter === t.type
                    ? isLight ? 'text-white' : 'text-teal-300'
                    : isLight ? 'text-slate-950' : 'text-white'
                }`}
              >
                {t.unreadCount > 0 ? t.unreadCount : t.totalCount}
              </p>
              <span
                className={`text-[9px] font-bold ${
                  t.unreadCount > 0
                    ? 'text-rose-500 dark:text-rose-400'
                    : isLight ? 'text-slate-500' : 'text-slate-500'
                }`}
              >
                {t.unreadCount > 0 ? `${t.unreadCount} unread` : `${t.totalCount} total`}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Filter Tabs & Search Toolbar */}
      <div
        className={`p-4 rounded-3xl border transition-colors shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleFilterChange(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black transition-all border shadow-xs ${
                activeFilter === tab.id ? tab.activeClass : inactiveTabClass
              }`}
            >
              <span>{tab.label}</span>
              {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                    activeFilter === tab.id
                      ? 'bg-white/25 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {tab.badgeCount > 99 ? '99+' : tab.badgeCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <FiSearch
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notification messages..."
            className={`w-full rounded-2xl pl-10 pr-4 py-2 text-xs font-bold focus:outline-none transition-colors border ${
              isLight
                ? 'bg-slate-50 border-slate-300 text-slate-950 placeholder:text-slate-500 focus:border-[#0F8B8D] focus:bg-white'
                : 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-400 focus:border-teal-500 focus:bg-slate-900'
            }`}
          />
        </div>
      </div>

      {/* Results Meta Bar */}
      {!isLoading && !isError && (
        <div
          className={`flex items-center justify-between px-1 text-xs font-bold ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}
        >
          <span>
            {searchQuery
              ? `${filteredAlerts.length} result${filteredAlerts.length !== 1 ? 's' : ''} on this page`
              : `${totalItems} notification${totalItems !== 1 ? 's' : ''} total`}{' '}
            {activeFilter !== 'ALL' && (
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  isLight ? 'bg-slate-200 text-slate-900' : 'bg-slate-800 text-slate-200'
                }`}
              >
                {activeFilter}
              </span>
            )}
          </span>
          {isFetching && !isLoading && (
            <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
              <FiRefreshCw className="w-3 h-3 animate-spin" /> Refreshing...
            </span>
          )}
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div
            className={`p-12 text-center rounded-3xl border transition-colors ${
              isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <FiRefreshCw className="w-8 h-8 mx-auto mb-3 text-slate-400 animate-spin" />
            <p
              className={`text-sm font-bold ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
              Loading notifications...
            </p>
          </div>
        ) : isError ? (
          <div
            className={`p-12 text-center rounded-3xl border transition-colors ${
              isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <FiAlertTriangle className="w-10 h-10 mx-auto mb-3 text-rose-500" />
            <p className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-2">
              Failed to load notifications.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div
            className={`p-12 text-center rounded-3xl border transition-colors ${
              isLight
                ? 'bg-white border-slate-300 text-slate-700'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}
          >
            <FiLayers className="w-10 h-10 mx-auto mb-3 text-slate-400" />
            <p
              className={`text-base font-black ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}
            >
              {searchQuery ? 'No Results Found' : 'All Caught Up!'}
            </p>
            <p className="text-xs font-semibold mt-1 text-slate-500 dark:text-slate-400">
              {searchQuery
                ? `No notifications match "${searchQuery}". Try adjusting your search.`
                : 'There are currently no notifications matching the selected filter.'}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs font-bold text-[#0F8B8D] dark:text-teal-400 hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filteredAlerts.map((a) => (
            <div
              key={a.id}
              className={`p-4 sm:p-5 rounded-3xl border flex items-start justify-between gap-4 transition-all shadow-sm ${
                !a.read
                  ? isLight
                    ? 'bg-white border-[#0F8B8D]/50 border-l-[5px] border-l-[#0F8B8D]'
                    : 'bg-slate-900 border-teal-500/50 border-l-[5px] border-l-teal-400'
                  : isLight
                  ? 'bg-slate-50/90 border-slate-300'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex gap-3.5 items-start flex-1 min-w-0">
                <div
                  className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center ${
                    a.type === 'SECURITY'
                      ? 'bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-950/60 dark:border-rose-700/60 dark:text-rose-300'
                      : a.type === 'STOCK'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:border-amber-700/60 dark:text-amber-300'
                      : a.type === 'AFFILIATE'
                      ? 'bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-950/60 dark:border-teal-700/60 dark:text-teal-300'
                      : 'bg-cyan-100 text-cyan-800 border border-cyan-300 dark:bg-cyan-950/60 dark:border-cyan-700/60 dark:text-cyan-300'
                  }`}
                >
                  {getCategoryIcon(a.type)}
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4
                      className={`text-sm sm:text-base font-black ${
                        isLight ? 'text-slate-950' : 'text-white'
                      }`}
                    >
                      {a.title}
                    </h4>
                    {!a.read && (
                      <span
                        className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block shrink-0 shadow-2xs"
                        title="Unread Alert"
                      />
                    )}
                    <span
                      className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-md border shrink-0 ${
                        isLight
                          ? 'bg-slate-100 border-slate-300 text-slate-900'
                          : 'bg-slate-800 border-slate-700 text-slate-200'
                      }`}
                    >
                      {a.type}
                    </span>
                  </div>

                  <p
                    className={`text-xs sm:text-sm font-medium mt-1.5 leading-relaxed break-words ${
                      isLight ? 'text-slate-800' : 'text-slate-200'
                    }`}
                  >
                    {a.message}
                  </p>

                  <div
                    className={`flex items-center gap-2 mt-2.5 text-[11px] font-mono font-bold ${
                      isLight ? 'text-slate-600' : 'text-slate-400'
                    }`}
                  >
                    <span>{new Date(a.createdAt).toLocaleString()}</span>
                    <span>•</span>
                    <span>{a.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!a.read ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleRead(a.id, a.read);
                    }}
                    disabled={markingId === a.id || markReadMutation.isPending}
                    title="Mark this alert as read"
                    className={`px-3.5 py-2 rounded-2xl border text-xs font-black transition-all flex items-center gap-2 shadow-2xs cursor-pointer ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-800'
                        : 'bg-slate-800 border-slate-700 text-slate-100 hover:bg-teal-950 hover:border-teal-500 hover:text-teal-200'
                    }`}
                  >
                    {markingId === a.id ? (
                      <FiRefreshCw className="w-4 h-4 text-emerald-500 animate-spin" />
                    ) : (
                      <FiCheckCircle className="w-4 h-4 text-emerald-600 dark:text-teal-400" />
                    )}
                    <span className="hidden sm:inline text-xs font-bold">Mark as read</span>
                  </button>
                ) : (
                  <div
                    title="Already Read"
                    className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold ${
                      isLight
                        ? 'text-slate-600 bg-slate-100 border-slate-200'
                        : 'text-slate-400 bg-slate-800/60 border-slate-700/50'
                    }`}
                  >
                    <FiCheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="hidden sm:inline">Read</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!isLoading && !isError && totalItems > ITEMS_PER_PAGE && (
        <div
          className={`px-6 py-4 rounded-3xl border transition-colors ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};
