import React from 'react';
import { Button } from '../../ui/Button';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiUploadCloud } from 'react-icons/fi';

interface InventoryHeaderProps {
  onOpenImport: () => void;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({ onOpenImport }) => {
  const { isLight } = useAdminTheme();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/50">
      <div>
        <h1 className={`text-2xl font-black tracking-tight transition-colors ${
          isLight ? 'text-primary' : 'text-white'
        }`}>
          Voucher Inventory & Batch Ingestion
        </h1>
        <p className={`text-xs mt-1 font-medium ${
          isLight ? 'text-slate-500' : 'text-slate-400'
        }`}>
          Monitor examination result-checker PIN pools, manage cryptographic batch imports, and configure low-stock triggers.
        </p>
      </div>
      <div>
        <Button
          variant={isLight ? 'primary' : 'gradient'}
          leftIcon={<FiUploadCloud />}
          onClick={onOpenImport}
        >
          Import Stock (CSV/Excel)
        </Button>
      </div>
    </div>
  );
};
