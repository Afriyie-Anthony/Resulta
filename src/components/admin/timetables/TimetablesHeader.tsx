import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../ui/Button';
import { FiCalendar, FiPlus, FiSearch } from 'react-icons/fi';

interface TimetablesHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  voucherType: string;
  onVoucherTypeChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onAddSchedule: () => void;
}

export const TimetablesHeader: React.FC<TimetablesHeaderProps> = ({
  search,
  onSearchChange,
  voucherType,
  onVoucherTypeChange,
  status,
  onStatusChange,
  onAddSchedule,
}) => {
  const { isLight } = useAdminTheme();

  return (
    <div className="space-y-4">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              Manage official GES examination timetables and downloadable candidate PDF releases.
            </p>
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isLight ? 'text-slate-400' : 'text-slate-500'
          }`} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search timetable title or filename..."
            className={`w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-2xl border transition-all focus:outline-none ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900 focus:border-[#0F8B8D] focus:ring-2 focus:ring-[#0F8B8D]/10'
                : 'bg-slate-900 border-slate-800 text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10'
            }`}
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-44">
          <select
            value={voucherType}
            onChange={(e) => onVoucherTypeChange(e.target.value)}
            className={`w-full px-3 py-2.5 text-xs font-semibold rounded-2xl border transition-all focus:outline-none ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900 focus:border-[#0F8B8D]'
                : 'bg-slate-900 border-slate-800 text-white focus:border-teal-500'
            }`}
          >
            <option value="">All Categories</option>
            <option value="BECE">BECE</option>
            <option value="WASSCE_NOVDEC">WASSCE / NOVDEC</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-44">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={`w-full px-3 py-2.5 text-xs font-semibold rounded-2xl border transition-all focus:outline-none ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900 focus:border-[#0F8B8D]'
                : 'bg-slate-900 border-slate-800 text-white focus:border-teal-500'
            }`}
          >
            <option value="">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>
    </div>
  );
};
