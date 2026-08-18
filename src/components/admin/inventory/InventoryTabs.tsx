import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import {
  FiGrid,
  FiDatabase,
  FiCheckSquare,
  FiList,
  FiBell,
  FiSettings,
} from 'react-icons/fi';

export type InventoryTabId = 'overview' | 'registry' | 'sold' | 'history' | 'alerts' | 'config';

interface InventoryTabsProps {
  activeTab: InventoryTabId;
  onChangeTab: (tab: InventoryTabId) => void;
  alertCount?: number;
}

interface TabItem {
  id: InventoryTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const InventoryTabs: React.FC<InventoryTabsProps> = ({
  activeTab,
  onChangeTab,
  alertCount = 1,
}) => {
  const { isLight } = useAdminTheme();

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    { id: 'registry', label: 'Inventory Registry', icon: FiDatabase },
    { id: 'sold', label: 'Sold Vouchers', icon: FiCheckSquare },
    { id: 'history', label: 'Upload History', icon: FiList },
    { id: 'alerts', label: 'Stock Alerts', icon: FiBell, badge: alertCount },
    { id: 'config', label: 'Setup Config', icon: FiSettings },
  ];

  return (
    <div className={`p-2 rounded-2xl border transition-all duration-300 shadow-sm ${
      isLight
        ? 'bg-slate-100/90 border-slate-200/90'
        : 'bg-slate-900/90 border-slate-800/90 backdrop-blur-md'
    }`}>
      <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? isLight
                    ? 'bg-[#0F8B8D] text-white shadow-md shadow-[#0F8B8D]/20 scale-[1.01]'
                    : 'bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 shadow-md shadow-teal-500/20 scale-[1.01]'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                isActive ? 'scale-110' : 'opacity-70'
              }`} />
              <span>{tab.label}</span>

              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`ml-0.5 px-2 py-0.5 rounded-full text-[10px] font-black transition-all ${
                  isActive
                    ? isLight ? 'bg-white/30 text-white' : 'bg-slate-950/40 text-slate-950'
                    : isLight
                    ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
