import React from 'react';
import { Button } from '../../ui/Button';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiUploadCloud, FiDollarSign, FiShield } from 'react-icons/fi';

interface InventoryHeaderProps {
  stats?: {
    wassce: { available: number };
    bece: { available: number };
  };
  onOpenImport: () => void;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({ stats, onOpenImport }) => {
  const { isLight } = useAdminTheme();

  const totalValue = stats
    ? stats.wassce.available * 25 + stats.bece.available * 20
    : 39100;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className={`text-2xl font-black tracking-tight transition-colors ${
            isLight ? 'text-primary' : 'text-white'
          }`}>
            Voucher Inventory & Batch Ingestion
          </h1>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
            <FiShield className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> HSM Protected
          </span>
        </div>
        <p className={`text-xs font-medium ${
          isLight ? 'text-slate-500' : 'text-slate-400'
        }`}>
          Monitor examination result-checker PIN pools, manage cryptographic batch imports, and configure low-stock triggers.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Live Total Asset Valuation Ticker */}
        <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border font-bold transition-all shadow-2xs ${
          isLight
            ? 'bg-slate-50/90 border-slate-200/90 text-slate-700'
            : 'bg-slate-900/90 border-slate-800 text-slate-300'
        }`}>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${
            isLight ? 'bg-secondary text-white shadow-2xs' : 'bg-teal-500 text-slate-950 font-black'
          }`}>
            <FiDollarSign />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-extrabold uppercase tracking-wider opacity-70">Active Pool Valuation</p>
            <p className={`text-sm font-black tracking-tight ${isLight ? 'text-primary' : 'text-white'}`}>
              GH₵ {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <Button
          variant={isLight ? 'primary' : 'gradient'}
          size="md"
          leftIcon={<FiUploadCloud />}
          onClick={onOpenImport}
          className="font-black shadow-md px-5 h-12 rounded-2xl"
        >
          Import Stock (CSV/Excel)
        </Button>
      </div>
    </div>
  );
};
