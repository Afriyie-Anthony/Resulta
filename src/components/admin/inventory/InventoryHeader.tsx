import React from 'react';
import { Button } from '../../ui/Button';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiUploadCloud } from 'react-icons/fi';

interface InventoryHeaderProps {
  stats?: {
    wassce: { available: number };
    bece: { available: number };
  };
  onOpenImport: () => void;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({ onOpenImport }) => {
  const { isLight } = useAdminTheme();

  return (
    <div className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 ${
      isLight
        ? 'bg-white/90 border-slate-200/90 shadow-sm'
        : 'bg-slate-900/80 border-slate-800/90 shadow-lg shadow-black/20 backdrop-blur-xl'
    }`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Header Content */}
        <div className="space-y-2 max-w-3xl">

          {/* Title */}
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight transition-colors ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Voucher Inventory & Batch Ingestion
          </h1>

          {/* Description */}
          <p className={`text-xs sm:text-sm font-medium leading-relaxed ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Monitor examination result-checker PIN pools, manage cryptographic batch imports, track fulfillment cycles, and configure automated low-stock safety triggers.
          </p>
        </div>

        {/* Right Action Bar (Active Pool Valuation Removed) */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            variant={isLight ? 'primary' : 'gradient'}
            size="lg"
            leftIcon={<FiUploadCloud className="w-5 h-5" />}
            onClick={onOpenImport}
            className="font-black px-6 py-3.5 rounded-2xl shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Import Stock (CSV/Excel)
          </Button>
        </div>
      </div>
    </div>
  );
};

