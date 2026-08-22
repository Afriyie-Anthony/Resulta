import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import type { TimetableItem } from './types';
import { FiFileText, FiDownloadCloud, FiAlertCircle, FiActivity } from 'react-icons/fi';

interface TimetablesKpiGridProps {
  schedules: TimetableItem[];
}

export const TimetablesKpiGrid: React.FC<TimetablesKpiGridProps> = ({ schedules }) => {
  const { isLight } = useAdminTheme();

  // Statistics calculations
  const totalUploads = schedules.filter(s => Boolean(s.fileUrl || s.filename)).length;
  const totalDownloads = schedules.reduce((sum, s) => sum + (s.downloadCount || 0), 0);
  const draftCount = schedules.filter(s => s.status === 'DRAFT').length;

  // Bandwidth calculation based on file size (bytes or KB/MB)
  const calcBandwidth = () => {
    let totalBytes = 0;
    schedules.forEach(s => {
      let bytes = 0;
      if (typeof s.fileSize === 'number') {
        bytes = s.fileSize;
      } else if (typeof s.fileSize === 'string') {
        const val = parseFloat(s.fileSize);
        if (!isNaN(val)) {
          if (s.fileSize.toLowerCase().includes('kb')) bytes = val * 1024;
          else if (s.fileSize.toLowerCase().includes('gb')) bytes = val * 1024 * 1024 * 1024;
          else bytes = val * 1024 * 1024; // default MB
        }
      }
      totalBytes += bytes * (s.downloadCount || 0);
    });

    const totalMB = totalBytes / (1024 * 1024);
    if (totalMB >= 1024) {
      return `${(totalMB / 1024).toFixed(1)} GB`;
    }
    return `${totalMB.toFixed(1)} MB`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Timetables Hosted */}
      <div className={`p-3.5 rounded-2xl border border-t-4 transition-all shadow-2xs hover:shadow-sm ${
        isLight ? 'bg-white border-slate-300 border-t-cyan-500 hover:border-slate-400' : 'bg-slate-900/90 border-slate-800 border-t-cyan-500'
      }`}>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            Timetables Hosted
          </span>
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
            isLight ? 'bg-cyan-100/80 text-cyan-800 border border-cyan-200' : 'bg-teal-500/20 text-teal-400 font-black'
          }`}>
            <FiFileText className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
          {totalUploads} Documents
        </p>
        <p className={`text-[11px] font-semibold mt-1.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
          Active GES releases on site
        </p>
      </div>

      {/* 2. Total Downloads */}
      <div className={`p-3.5 rounded-2xl border border-t-4 transition-all shadow-2xs hover:shadow-sm ${
        isLight ? 'bg-white border-slate-300 border-t-emerald-500 hover:border-slate-400' : 'bg-slate-900/90 border-slate-800 border-t-emerald-500'
      }`}>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            Student Downloads
          </span>
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
            isLight ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200' : 'bg-emerald-500/20 text-emerald-400 font-black'
          }`}>
            <FiDownloadCloud className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className={`text-xl font-black tracking-tight ${isLight ? 'text-emerald-950' : 'text-emerald-400'}`}>
          {totalDownloads.toLocaleString()} Hits
        </p>
        <p className={`text-[11px] font-semibold mt-1.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
          Direct website PDF downloads
        </p>
      </div>

      {/* 3. Draft Schedules */}
      <div className={`p-3.5 rounded-2xl border border-t-4 transition-all shadow-2xs hover:shadow-sm ${
        isLight ? 'bg-white border-slate-300 border-t-amber-500 hover:border-slate-400' : 'bg-slate-900/90 border-slate-800 border-t-amber-500'
      }`}>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            Draft Schedules
          </span>
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
            isLight ? 'bg-amber-100/80 text-amber-800 border border-amber-200' : 'bg-amber-500/20 text-amber-400'
          }`}>
            <FiAlertCircle className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className={`text-xl font-black tracking-tight ${isLight ? 'text-amber-950' : 'text-amber-400'}`}>
          {draftCount} Pending
        </p>
        <p className={`text-[11px] font-semibold mt-1.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
          Awaiting GES official upload
        </p>
      </div>

      {/* 4. Traffic Distributed */}
      <div className={`p-3.5 rounded-2xl border border-t-4 transition-all shadow-2xs hover:shadow-sm ${
        isLight ? 'bg-white border-slate-300 border-t-purple-500 hover:border-slate-400' : 'bg-slate-900/90 border-slate-800 border-t-purple-500'
      }`}>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            isLight ? 'text-slate-700' : 'text-slate-400'
          }`}>
            Traffic Distributed
          </span>
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
            isLight ? 'bg-purple-100/80 text-purple-800 border border-purple-200' : 'bg-purple-500/20 text-purple-400 font-black'
          }`}>
            <FiActivity className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
          {calcBandwidth()}
        </p>
        <p className={`text-[11px] font-semibold mt-1.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
          Timetable document bandwidth
        </p>
      </div>
    </div>
  );
};
