import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../ui/Button';
import { FiBarChart2, FiDownload, FiLoader } from 'react-icons/fi';

interface ReportsHeaderProps {
  onExportCsv: () => void;
  onExportPdf: () => void;
  isExportingCsv?: boolean;
  isExportingPdf?: boolean;
}

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  onExportCsv,
  onExportPdf,
  isExportingCsv = false,
  isExportingPdf = false,
}) => {
  const { isLight } = useAdminTheme();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className={`p-2.5 rounded-2xl ${
          isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/20 text-teal-400'
        }`}>
          <FiBarChart2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Reports & Commercial Analytics
          </h1>
          <p className={`text-xs sm:text-sm font-semibold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Aggregate revenue performance, examination product volume attribution, and USSD/Web channel telemetry.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Button
          variant={isLight ? 'outline' : 'secondary'}
          size="md"
          disabled={isExportingCsv}
          leftIcon={isExportingCsv ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiDownload className="w-4 h-4" />}
          onClick={onExportCsv}
          className="font-black text-xs h-11 px-4 rounded-2xl"
        >
          {isExportingCsv ? 'Exporting...' : 'Export CSV'}
        </Button>
        <Button
          variant={isLight ? 'primary' : 'gradient'}
          size="md"
          disabled={isExportingPdf}
          leftIcon={isExportingPdf ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiDownload className="w-4 h-4" />}
          onClick={onExportPdf}
          className="font-black text-xs h-11 px-5 rounded-2xl shadow-md"
        >
          {isExportingPdf ? 'Exporting...' : 'Export PDF'}
        </Button>
      </div>
    </div>
  );
};
