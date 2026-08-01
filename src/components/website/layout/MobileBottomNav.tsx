import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiShoppingCart, FiUsers, FiMoreHorizontal } from 'react-icons/fi';

const tabs = [
  {
    label: 'Home',
    icon: FiHome,
    href: '/',
    match: (path: string) => path === '/',
  },
  {
    label: 'Retrieve',
    icon: FiShoppingBag,
    href: '/retrieve-voucher',
    match: (path: string) => path === '/retrieve-voucher',
  },
  {
    label: 'Buy',
    icon: FiShoppingCart,
    href: '#buy',
    isBuy: true,
    match: (path: string) => path.startsWith('/purchase'),
  },
  {
    label: 'Affiliate',
    icon: FiUsers,
    href: '/affiliate',
    match: (path: string) => path === '/affiliate' || path.startsWith('/affiliate/'),
  },
  {
    label: 'More',
    icon: FiMoreHorizontal,
    href: '#more',
    isMore: true,
    match: (path: string) => path.startsWith('/help') || path.startsWith('/legal') || path === '/help',
  },
];

interface MobileBottomNavProps {
  onBuyClick: () => void;
  onMoreClick: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onBuyClick, onMoreClick }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="Mobile bottom navigation">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = tab.match ? tab.match(pathname) : false;
          const Icon = tab.icon;

          if (tab.isBuy) {
            return (
              <button
                key={tab.label}
                type="button"
                onClick={onBuyClick}
                className="flex flex-col items-center justify-center -mt-4"
                aria-label="Buy voucher"
              >
                <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/30">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-text-primary mt-1">{tab.label}</span>
              </button>
            );
          }

          if (tab.isMore) {
            return (
              <button
                key={tab.label}
                type="button"
                onClick={onMoreClick}
                className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 ${
                  isActive ? 'text-accent' : 'text-text-secondary'
                }`}
                aria-label="More options"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-semibold">{tab.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 ${
                isActive ? 'text-accent' : 'text-text-secondary'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
