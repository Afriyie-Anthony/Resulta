import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { FiUsers, FiDownload, FiCheckCircle } from 'react-icons/fi';

export const CustomersHeader: React.FC = () => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();

  const handleExport = () => {
    addToast({
      title: 'Customer Directory Exported',
      message: 'Generating CSV audit list for 4,227 MoMo customer accounts.',
      type: 'success',
      duration: 4000
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${
            isLight ? 'bg-secondary/10 text-secondary' : 'bg-teal-500/20 text-teal-400'
          }`}>
            <FiUsers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className={`text-2xl font-black tracking-tight ${isLight ? 'text-primary' : 'text-white'}`}>
                Customer Directory & Telemetry
              </h1>
              <span className={`inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isLight 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                <FiCheckCircle className="w-3 h-3 text-emerald-500" /> 4,227 Total Active
              </span>
            </div>
          </div>
        </div>
        <p className={`text-xs mt-1.5 ml-12 ${isLight ? 'text-slate-500 font-semibold' : 'text-slate-400'}`}>
          Manage registered MoMo phone numbers and inspect lifetime voucher purchase histories across all telecom gateways
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant={isLight ? 'primary' : 'secondary'} 
          size="sm" 
          onClick={handleExport}
          leftIcon={<FiDownload />}
        >
          Export Customer List (CSV)
        </Button>
      </div>
    </div>
  );
};
