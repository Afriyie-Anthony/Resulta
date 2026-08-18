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

        // Color-coded borders based on exam type & status
        let cardBorderClass = '';
        if (isDraft) {
          cardBorderClass = isLight
            ? 'border-2 border-amber-500 hover:border-amber-600'
            : 'border-2 border-amber-500/50 hover:border-amber-400';
        } else if (item.examType === 'BECE') {
          cardBorderClass = isLight
            ? 'border-2 border-blue-500 hover:border-blue-600'
            : 'border-2 border-blue-500/50 hover:border-blue-400';
        } else {
          cardBorderClass = isLight
            ? 'border-2 border-purple-500 hover:border-purple-600'
            : 'border-2 border-purple-500/50 hover:border-purple-400';
        }

        return (
          <div
            key={idx}
            className={`p-5 rounded-3xl transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between hover:-translate-y-0.5 ${cardBorderClass} ${
              isLight ? 'bg-white' : 'bg-slate-900/90'
            }`}
          >
            <div>
              {/* Header: File Status Badge & Exam Icon */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg ${
                  isDraft
                    ? isLight ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-amber-500/20 text-amber-400'
                    : item.examType === 'BECE'
                    ? isLight ? 'bg-blue-100 text-blue-900 border border-blue-300' : 'bg-blue-500/20 text-blue-400'
                    : isLight ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  <FiFileText className="w-5 h-5" />
                </div>
                <Badge
                  variant={isPublished ? 'success' : isDraft ? 'warning' : 'info'}
                  className="font-black text-[10px] tracking-wider uppercase px-3 py-1 rounded-lg shadow-2xs"
                >
                  {item.portalStatus}
                </Badge>
              </div>

              {/* Title & Category Badge */}
              <div>
                <h3 className={`text-lg font-black leading-tight ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}>
                  {item.exam}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    item.examType === 'BECE'
                      ? isLight ? 'bg-blue-100 text-blue-900 border border-blue-300' : 'bg-blue-950 text-blue-300 border border-blue-900/30'
                      : isLight ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-purple-950 text-purple-300 border border-purple-900/30'
                  }`}>
                    {item.examType}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black ${
                    isLight ? 'bg-slate-100 text-slate-800 border border-slate-300' : 'bg-slate-800/80 text-slate-300'
                  }`}>
                    Year: {item.academicYear}
                  </span>
                </div>
              </div>

              {/* Document Information / Status Alert */}
              <div className="mt-4">
                {item.fileName ? (
                  <div className={`p-3.5 rounded-2xl border text-xs font-semibold ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                  }`}>
                    <p className={`font-black flex items-center gap-2 truncate ${isLight ? 'text-slate-950' : 'text-white'}`}>
                      <FiFileText className="text-[#0F8B8D] dark:text-teal-400 shrink-0 w-4 h-4" /> {item.fileName}
                    </p>
                    <p className={`text-[11px] mt-1.5 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                      File Size: {item.fileSize} • Uploaded: {item.uploadedAt}
                    </p>
                  </div>
                ) : (
                  <div className={`p-3.5 rounded-2xl border flex items-center gap-2.5 text-xs font-bold ${
                    isLight ? 'bg-amber-50 text-amber-950 border-amber-300' : 'bg-amber-950/30 border-amber-900/40 text-amber-300'
                  }`}>
                    <FiAlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Awaiting official GES timetable PDF upload</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions & Downloads Telemetry */}
            <div className="mt-5">
              <div className={`pt-3.5 mb-4 border-t space-y-2 text-xs font-bold ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}>
                <div className="flex justify-between items-center">
                  <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    <FiDownloadCloud className="text-[#0F8B8D] dark:text-teal-400" /> Student Downloads
                  </span>
                  <span className={`font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    {item.downloads.toLocaleString()} hits
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    <FiActivity className="text-[#0F8B8D] dark:text-teal-400" /> Portal Sync Status
                  </span>
                  <span className={`font-black ${
                    item.fileName ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
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
                leftIcon={<FiSettings className="w-4 h-4" />}
                className="font-black text-xs h-10 rounded-xl"
              >
                Configure Settings
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
