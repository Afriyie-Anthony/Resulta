import React from 'react';
import { Button } from '../../ui/Button';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiDownload, FiCheckCircle } from 'react-icons/fi';

interface OrdersHeaderProps {
  onExportCsv: () => void;
  totalOrdersCount: number;
}

export const OrdersHeader: React.FC<OrdersHeaderProps> = ({ onExportCsv, totalOrdersCount }) => {
  const { isLight } = useAdminTheme();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight transition-colors ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Order Management
          </h1>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
            isLight ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
          }`}>
            <FiCheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" /> Live SMS Gateway Connect
          </span>
        </div>
        <p className={`text-xs sm:text-sm font-semibold mt-1 max-w-3xl leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
          Complete visibility and control over every transaction placed via the website or USSD channel, with full filtering, search, and admin action capabilities.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Button
          variant={isLight ? 'primary' : 'gradient'}
          size="md"
          leftIcon={<FiDownload />}
          onClick={onExportCsv}
          className="font-black shadow-md px-5 h-11 rounded-2xl text-xs"
        >
          Export Logs ({totalOrdersCount})
        </Button>
      </div>
    </div>
  );
};
