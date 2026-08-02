import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import type { ExamSchedule } from './types';
import { FiFileText, FiDownloadCloud, FiAlertCircle, FiSettings, FiActivity } from 'react-icons/fi';

interface TimetablesGridProps {
  schedules: ExamSchedule[];
  onConfigureSchedule: (schedule: ExamSchedule) => void;
}

export const TimetablesGrid: React.FC<TimetablesGridProps> = ({ schedules, onConfigureSchedule }) => {
  const { isLight } = useAdminTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {schedules.map((item, idx) => {
        const isPublished = item.portalStatus === 'PUBLISHED';
        const isDraft = item.portalStatus === 'DRAFT';

        // Choose color palette based on status
        let cardBgClass = '';
        if (isLight) {
          if (isPublished) cardBgClass = 'bg-emerald-50/50 border-emerald-200/80 hover:bg-emerald-50/80 hover:border-emerald-300';
          else if (isDraft) cardBgClass = 'bg-amber-50/50 border-amber-200/80 hover:bg-amber-50/80 hover:border-amber-300';
          else cardBgClass = 'bg-blue-50/40 border-blue-200/60 hover:bg-blue-50/75 hover:border-blue-300';
        } else {
          if (isPublished) cardBgClass = 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50';
          else if (isDraft) cardBgClass = 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50';
          else cardBgClass = 'bg-blue-950/20 border-blue-500/30 hover:border-blue-500/50';
        }

        return (
          <div
            key={idx}
            className={`p-6 rounded-3xl border transition-all shadow-sm flex flex-col justify-between transform hover:scale-[1.01] active:scale-100 ${cardBgClass}`}
          >
            <div>
              {/* Header: File Status Badge & Exam Icon */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg ${
                  isPublished
                    ? isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-400'
                    : isDraft
                    ? isLight ? 'bg-amber-100 text-amber-800' : 'bg-amber-500/20 text-amber-400'
                    : isLight ? 'bg-blue-100 text-blue-800' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  <FiFileText />
                </span>
                <Badge
                  variant={isPublished ? 'success' : isDraft ? 'warning' : 'info'}
                  className="font-extrabold text-[10px] tracking-wide uppercase px-2.5 py-0.5 rounded-lg"
                >
                  {item.portalStatus}
                </Badge>
              </div>

              {/* Title & Category Badge */}
              <div>
                <h3 className={`text-lg font-black leading-tight ${
                  isLight 
                    ? isPublished ? 'text-emerald-950' : isDraft ? 'text-amber-950' : 'text-blue-950'
                    : 'text-white'
                }`}>
                  {item.exam}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    item.examType === 'BECE'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900/30'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-900/30'
                  }`}>
                    {item.examType}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    isLight ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-slate-800/60 text-slate-400'
                  }`}>
                    Year: {item.academicYear}
                  </span>
                </div>
              </div>

              {/* Document Information / Status Alert */}
              <div className="mt-4">
                {item.fileName ? (
                  <div className={`p-3 rounded-2xl border text-xs font-semibold ${
                    isLight ? 'bg-white/80 border-slate-200/90' : 'bg-slate-950/40 border-slate-800'
                  }`}>
                    <p className={`font-bold flex items-center gap-1.5 truncate ${isLight ? 'text-primary' : 'text-white'}`}>
                      <FiFileText className="text-slate-400 shrink-0" /> {item.fileName}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">
                      File Size: {item.fileSize} • Uploaded: {item.uploadedAt}
                    </p>
                  </div>
                ) : (
                  <div className={`p-3 rounded-2xl border flex items-center gap-2 text-xs font-semibold ${
                    isLight ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-amber-950/20 border-amber-900/30 text-amber-400'
                  }`}>
                    <FiAlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                    <span>Awaiting GES timetable document upload</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions & Downloads Telemetry */}
            <div>
              <div className={`mt-5 pt-4 border-t space-y-2.5 text-xs font-bold ${
                isLight 
                  ? isPublished ? 'border-emerald-200 text-emerald-800' : isDraft ? 'border-amber-200 text-amber-800' : 'border-blue-200 text-blue-800'
                  : 'border-slate-800 text-slate-350'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-400">
                    <FiDownloadCloud /> Student Downloads
                  </span>
                  <span className={isLight ? 'text-slate-900 font-black' : 'text-white font-black'}>
                    {item.downloads.toLocaleString()} hits
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-400">
                    <FiActivity /> Sync Status
                  </span>
                  <span className={`font-extrabold ${
                    item.fileName ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'
                  }`}>
                    {item.fileName ? 'Hosted & Live' : 'Drafting'}
                  </span>
                </div>
              </div>

              <Button
                variant={isLight ? 'outline' : 'secondary'}
                size="sm"
                fullWidth
                onClick={() => onConfigureSchedule(item)}
                leftIcon={<FiSettings className="w-3.5 h-3.5" />}
                className="mt-5 font-extrabold !rounded-2xl"
              >
                Configure Settings & PDF
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
