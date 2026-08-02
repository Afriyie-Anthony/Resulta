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
        <div className="flex items-center gap-2 mb-1">
          <h1 className={`text-2xl font-black tracking-tight transition-colors ${
            isLight ? 'text-primary' : 'text-white'
          }`}>
            Orders Database & SMS Fulfillment
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
            <FiCheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" /> Live SMS Gateway Connect
          </span>
        </div>
        <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Investigate customer checkout lifecycle, verify Mobile Money payment attribution, and manage automated SMS voucher reshipments.
        </p>
      </div>

      <div className="flex items-center gap-3">
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
