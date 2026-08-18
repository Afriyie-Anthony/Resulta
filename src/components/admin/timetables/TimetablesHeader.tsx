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
        <div className="flex items-center gap-3 flex-wrap">
          <div className={`p-2.5 rounded-2xl ${
            isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/20 text-teal-400'
          }`}>
            <FiCalendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Examination & Result Release Timetables
            </h1>
            <p className={`text-xs sm:text-sm font-semibold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Configure automated SMS notifications and promotional voucher discounts aligned with official WAEC result release dates.
            </p>
          </div>
        </div>
      </div>
      <div className="shrink-0">
        <Button 
          variant={isLight ? 'primary' : 'secondary'} 
          size="md" 
          onClick={onAddSchedule}
          leftIcon={<FiPlus />}
          className="font-black text-xs h-11 px-5 rounded-2xl shadow-md"
        >
          Add Schedule Event
        </Button>
      </div>
    </div>
  );
};
