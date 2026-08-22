import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { FiUsers, FiDownload, FiCheckCircle } from 'react-icons/fi';

interface CustomersHeaderProps {
  totalCustomers?: number;
  onExport: () => void;
  isExporting?: boolean;
}

export const CustomersHeader: React.FC<CustomersHeaderProps> = ({
  totalCustomers,
  onExport,
  isExporting = false,
}) => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();

  const handleExport = () => {
    onExport();
    addToast({
      title: 'Customer Directory Exported',
      message: 'Generating CSV export for customer accounts.',
      type: 'success',
      duration: 4000,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className={`p-2.5 rounded-2xl ${
            isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/20 text-teal-400'
          }`}>
            <FiUsers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Customer Directory &amp; Telemetry
              </h1>
              {totalCustomers !== undefined && (
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                  isLight
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-2xs'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {totalCustomers.toLocaleString()} Total Active
                </span>
              )}
            </div>
            <p className={`text-xs sm:text-sm font-semibold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Audit verified customer accounts, inspect lifetime purchasing history, and export records.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Button
          variant={isLight ? 'primary' : 'gradient'}
          size="md"
          leftIcon={<FiDownload />}
          onClick={handleExport}
          disabled={isExporting}
          className="font-black shadow-md px-5 h-11 rounded-2xl text-xs"
        >
          {isExporting ? 'Exporting…' : 'Export Directory'}
        </Button>
      </div>
    </div>
  );
};
