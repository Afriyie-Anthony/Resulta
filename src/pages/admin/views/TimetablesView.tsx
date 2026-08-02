import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { FiCalendar, FiPlus, FiClock, FiCheckCircle } from 'react-icons/fi';

export const TimetablesView: React.FC = () => {
  const { isLight } = useAdminTheme();

  const schedules = [
    { exam: 'WASSCE School Candidates 2026', releaseWindow: 'August 18, 2026 - September 25, 2026', portalStatus: 'READY FOR CHECKING', autoRelease: 'Active', targetSales: '15,000 PINs' },
    { exam: 'BECE School Candidates 2026', releaseWindow: 'July 10, 2026 - July 15, 2026', portalStatus: 'PENDING WAEC RELEASE', autoRelease: 'Scheduled', targetSales: '22,000 PINs' },
    { exam: 'WASSCE Private / Nov-Dec 2026', releaseWindow: 'December 05, 2026', portalStatus: 'SCHEDULED', autoRelease: 'On Hold', targetSales: '8,500 PINs' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <FiCalendar className={`w-6 h-6 ${isLight ? 'text-secondary' : 'text-teal-400'}`} />
            <h1 className={`text-2xl font-black tracking-tight ${isLight ? 'text-primary' : 'text-white'}`}>
              Examination & Result Release Timetables
            </h1>
          </div>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500 font-semibold' : 'text-slate-400'}`}>
            Configure automated SMS notifications and promotional voucher discounts aligned with official WAEC result dates
          </p>
        </div>
        <Button variant={isLight ? 'primary' : 'gradient'} size="sm" leftIcon={<FiPlus />}>
          Add Schedule Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {schedules.map((item, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-3xl border transition-all ${
              isLight ? 'bg-white border-slate-200/90 shadow-md hover:shadow-lg' : 'bg-slate-900 border-slate-800 shadow-xl'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg ${
                isLight ? 'bg-secondary/10 text-secondary' : 'bg-teal-500/20 text-teal-400'
              }`}>
                <FiCalendar />
              </span>
              <Badge variant={item.portalStatus.includes('READY') ? 'success' : 'warning'} className="font-extrabold text-[10px]">
                {item.portalStatus}
              </Badge>
            </div>
            
            <h3 className={`text-lg font-black leading-tight ${isLight ? 'text-primary' : 'text-white'}`}>
              {item.exam}
            </h3>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-2">
              <FiClock className="text-amber-500 shrink-0" /> Window: {item.releaseWindow}
            </p>

            <div className={`mt-5 pt-4 border-t space-y-2.5 text-xs font-bold ${
              isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800 text-slate-300'
            }`}>
              <div className="flex justify-between items-center">
                <span>Automated Dispatch</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold">
                  <FiCheckCircle /> {item.autoRelease}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Expected Volume</span>
                <span className={isLight ? 'text-primary font-black' : 'text-white font-black'}>{item.targetSales}</span>
              </div>
            </div>

            <Button variant="outline" size="sm" fullWidth className="mt-6 font-bold">
              Configure Timetable Settings
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
