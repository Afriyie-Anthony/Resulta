import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiRefreshCw, FiBox } from 'react-icons/fi';

export const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { isLight } = useAdminTheme();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-black uppercase px-2 py-0.5 rounded-md tracking-wider ${
            isLight ? 'bg-primary/10 text-primary' : 'bg-teal-500/20 text-teal-400'
          }`}>
            Live Telemetry & Controls
          </span>
          <span className={`text-xs flex items-center gap-1 font-semibold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" /> All Systems Nominal
          </span>
        </div>
        <h1 className={`text-2xl font-black tracking-tight mt-1 transition-colors ${isLight ? 'text-primary' : 'text-white'}`}>
          Executive Control Center
        </h1>
      </div>
      <div className="flex items-center gap-2.5">
        <Button variant="outline" size="sm" leftIcon={<FiRefreshCw className="w-3.5 h-3.5" />} onClick={() => window.location.reload()}>
          Refresh Telemetry
        </Button>
        <Button variant={isLight ? 'primary' : 'gradient'} size="sm" leftIcon={<FiBox className="w-3.5 h-3.5" />} onClick={() => navigate('/admin/inventory')}>
          Inventory Settings
        </Button>
      </div>
    </div>
  );
};
