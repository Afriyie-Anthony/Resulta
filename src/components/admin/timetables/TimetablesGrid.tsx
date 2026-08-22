import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import type { TimetableItem } from '../../../schemas/timetable';
import {
  FiFileText,
  FiDownloadCloud,
  FiAlertCircle,
  FiSettings,
  FiActivity,
  FiTrash2,
  FiExternalLink,
  FiInbox,
} from 'react-icons/fi';

interface TimetablesGridProps {
  schedules: TimetableItem[];
  isLoading?: boolean;
  onConfigureSchedule: (schedule: TimetableItem) => void;
  onDeleteSchedule: (schedule: TimetableItem) => void;
}

export const TimetablesGrid: React.FC<TimetablesGridProps> = ({
  schedules,
  isLoading = false,
  onConfigureSchedule,
  onDeleteSchedule,
}) => {
  const { isLight } = useAdminTheme();

  const formatFileSize = (size: number | string | null | undefined) => {
    if (!size) return '';
    if (typeof size === 'string') return size;
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return `${parseFloat((size / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`p-6 rounded-3xl animate-pulse space-y-4 border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="w-20 h-6 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="w-3/4 h-6 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="w-1/2 h-4 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="w-full h-16 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="w-full h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className={`p-12 rounded-3xl border text-center space-y-3 ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900/50 border-slate-800'
      }`}>
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center mx-auto text-xl">
          <FiInbox />
        </div>
        <h3 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
          No Timetables Found
        </h3>
        <p className={`text-xs max-w-sm mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          No timetable entries match your search criteria. Add a new timetable or clear your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {schedules.map((item) => {
        const isPublished = item.status === 'PUBLISHED';
        const isDraft = item.status === 'DRAFT';
        const isBece = item.voucherType === 'BECE';

        // Color-coded borders based on exam type & status
        let cardBorderClass = '';
        if (isDraft) {
          cardBorderClass = isLight
            ? 'border-2 border-amber-400 hover:border-amber-500'
            : 'border-2 border-amber-500/50 hover:border-amber-400';
        } else if (isBece) {
          cardBorderClass = isLight
            ? 'border-2 border-blue-400 hover:border-blue-500'
            : 'border-2 border-blue-500/50 hover:border-blue-400';
        } else {
          cardBorderClass = isLight
            ? 'border-2 border-purple-400 hover:border-purple-500'
            : 'border-2 border-purple-500/50 hover:border-purple-400';
        }

        const formattedSize = formatFileSize(item.fileSize);

        return (
          <div
            key={item.id}
            className={`p-5 rounded-3xl transition-all shadow-sm hover:shadow-md flex flex-col justify-between hover:-translate-y-0.5 ${cardBorderClass} ${
              isLight ? 'bg-white' : 'bg-slate-900/90'
            }`}
          >
            <div>
              {/* Header: File Status Badge & Exam Icon */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg ${
                  isDraft
                    ? isLight ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-amber-500/20 text-amber-400'
                    : isBece
                    ? isLight ? 'bg-blue-100 text-blue-900 border border-blue-300' : 'bg-blue-500/20 text-blue-400'
                    : isLight ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  <FiFileText className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={isPublished ? 'success' : isDraft ? 'warning' : 'info'}
                    className="font-black text-[10px] tracking-wider uppercase px-3 py-1 rounded-lg shadow-2xs"
                  >
                    {item.status}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => onDeleteSchedule(item)}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      isLight
                        ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                        : 'text-slate-500 hover:text-rose-400 hover:bg-rose-950/40'
                    }`}
                    title="Delete Timetable"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Category Badge */}
              <div>
                <h3 className={`text-lg font-black leading-tight ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}>
                  {item.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    isBece
                      ? isLight ? 'bg-blue-100 text-blue-900 border border-blue-300' : 'bg-blue-950 text-blue-300 border border-blue-900/30'
                      : isLight ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-purple-950 text-purple-300 border border-purple-900/30'
                  }`}>
                    {item.voucherType.replace('_', ' ')}
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
                {item.fileUrl || item.filename ? (
                  <div className={`p-3.5 rounded-2xl border text-xs font-semibold ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-black flex items-center gap-2 truncate ${isLight ? 'text-slate-950' : 'text-white'}`}>
                        <FiFileText className="text-[#0F8B8D] dark:text-teal-400 shrink-0 w-4 h-4" />
                        <span className="truncate">{item.filename || 'Timetable Document.pdf'}</span>
                      </p>
                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 dark:text-teal-400 p-1 hover:bg-teal-100 dark:hover:bg-teal-950/50 rounded-lg shrink-0"
                          title="Open PDF"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    {formattedSize && (
                      <p className={`text-[11px] mt-1.5 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                        File Size: {formattedSize}
                      </p>
                    )}
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
                    {(item.downloadCount || 0).toLocaleString()} hits
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    <FiActivity className="text-[#0F8B8D] dark:text-teal-400" /> Portal Sync Status
                  </span>
                  <span className={`font-black ${
                    item.status === 'PUBLISHED' && (item.fileUrl || item.filename)
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-amber-700 dark:text-amber-400'
                  }`}>
                    {item.status === 'PUBLISHED' && (item.fileUrl || item.filename) ? 'Hosted & Live' : 'Drafting'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={isLight ? 'outline' : 'secondary'}
                  size="sm"
                  fullWidth
                  onClick={() => onConfigureSchedule(item)}
                  leftIcon={<FiSettings className="w-4 h-4" />}
                  className="font-black text-xs h-10 rounded-xl"
                >
                  Configure
                </Button>
                {item.fileUrl && (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center px-3 h-10 rounded-xl border text-xs font-black transition-all ${
                      isLight
                        ? 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                        : 'border-slate-800 bg-slate-950 text-slate-200 hover:bg-slate-900'
                    }`}
                    title="View PDF Document"
                  >
                    <FiDownloadCloud className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
