import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../ui/Button';
import { FiCalendar, FiPlus } from 'react-icons/fi';

interface TimetablesHeaderProps {
  onAddSchedule: () => void;
}

export const TimetablesHeader: React.FC<TimetablesHeaderProps> = ({ onAddSchedule }) => {
  const { isLight } = useAdminTheme();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${
            isLight ? 'bg-secondary/10 text-secondary' : 'bg-teal-500/20 text-teal-400'
          }`}>
            <FiCalendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-2xl font-black tracking-tight ${isLight ? 'text-primary' : 'text-white'}`}>
              Examination & Result Release Timetables
            </h1>
          </div>
        </div>
        <p className={`text-xs mt-1.5 ml-12 ${isLight ? 'text-slate-500 font-semibold' : 'text-slate-400'}`}>
          Configure automated SMS notifications and promotional voucher discounts aligned with official WAEC result release dates
        </p>
      </div>
      <Button 
        variant={isLight ? 'primary' : 'secondary'} 
        size="sm" 
        onClick={onAddSchedule}
        leftIcon={<FiPlus />}
      >
        Add Schedule Event
      </Button>
    </div>
  );
};
