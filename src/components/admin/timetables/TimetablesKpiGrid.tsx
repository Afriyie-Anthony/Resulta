import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import type { ExamSchedule } from './types';
import { FiFileText, FiDownloadCloud, FiAlertCircle, FiActivity } from 'react-icons/fi';

interface TimetablesKpiGridProps {
  schedules: ExamSchedule[];
}

export const TimetablesKpiGrid: React.FC<TimetablesKpiGridProps> = ({ schedules }) => {
  const { isLight } = useAdminTheme();

  // Statistics calculations
  const totalUploads = schedules.filter(s => s.fileName !== '').length;
  const totalDownloads = schedules.reduce((sum, s) => sum + s.downloads, 0);
  const draftCount = schedules.filter(s => s.portalStatus === 'DRAFT').length;

  // Approximate bandwidth consumed (MB to GB conversion)
  const calcBandwidth = () => {
    let totalMB = 0;
    schedules.forEach(s => {
      const sizeNum = parseFloat(s.fileSize);
      if (!isNaN(sizeNum)) {
        totalMB += sizeNum * s.downloads;
      }
    });
    return totalMB > 1000 ? `${(totalMB / 1024).toFixed(1)} GB` : `${totalMB.toFixed(0)} MB`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Timetables Hosted (Subtle Cyan / Teal Tint) */}
      <div className={`p-5 rounded-3xl border transition-all shadow-sm ${
        isLight ? 'bg-cyan-50/50 border-cyan-200/70' : 'bg-teal-950/20 border-teal-500/30'
      }`}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-black uppercase tracking-wider ${
            isLight ? 'text-cyan-900/80' : 'text-slate-400'
          }`}>
            Timetables Hosted
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
            isLight ? 'bg-cyan-600/15 text-cyan-800' : 'bg-teal-500/20 text-teal-400 font-black'
          }`}>
            <FiFileText className="w-4 h-4" />
          </div>
        </div>
        <p className={`text-2xl font-black tracking-tight ${isLight ? 'text-cyan-950' : 'text-white'}`}>
          {totalUploads} Documents
        </p>
        <p className="text-xs font-semibold text-slate-400 mt-2.5">
          Active GES releases on site
        </p>
      </div>

      {/* 2. Total Downloads (Subtle Emerald / Mint Tint) */}
      <div className={`p-5 rounded-3xl border transition-all shadow-sm ${
        isLight ? 'bg-emerald-50/50 border-emerald-200/70' : 'bg-emerald-950/20 border-emerald-500/30'
      }`}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-black uppercase tracking-wider ${
            isLight ? 'text-emerald-900/80' : 'text-slate-400'
          }`}>
            Student Downloads
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
            isLight ? 'bg-emerald-600/15 text-emerald-800' : 'bg-emerald-500/20 text-emerald-400 font-black'
          }`}>
            <FiDownloadCloud className="w-4 h-4" />
          </div>
        </div>
        <p className={`text-2xl font-black tracking-tight ${isLight ? 'text-emerald-950' : 'text-emerald-400'}`}>
          {totalDownloads.toLocaleString()} Hits
        </p>
        <p className="text-xs font-semibold text-slate-400 mt-2.5">
          Direct website PDF downloads
        </p>
      </div>

      {/* 3. Draft Campaigns (Subtle Amber / Warm Cream Tint) */}
      <div className={`p-5 rounded-3xl border transition-all shadow-sm ${
        isLight ? 'bg-amber-50/50 border-amber-200/70' : 'bg-amber-950/20 border-amber-500/30'
      }`}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-black uppercase tracking-wider ${
            isLight ? 'text-amber-900/80' : 'text-slate-400'
          }`}>
            Draft Schedules
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
            isLight ? 'bg-amber-500/15 text-amber-800' : 'bg-amber-500/20 text-amber-400'
          }`}>
            <FiAlertCircle className="w-4 h-4" />
          </div>
        </div>
        <p className={`text-2xl font-black tracking-tight ${isLight ? 'text-amber-950' : 'text-amber-400'}`}>
          {draftCount} Pending
        </p>
        <p className="text-xs font-semibold text-slate-400 mt-2.5">
          Awaiting GES official upload
        </p>
      </div>

      {/* 4. Estimated Traffic (Subtle Sky Blue / Indigo Tint) */}
      <div className={`p-5 rounded-3xl border transition-all shadow-sm ${
        isLight ? 'bg-blue-50/40 border-blue-200/60' : 'bg-blue-950/20 border-blue-500/30'
      }`}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-black uppercase tracking-wider ${
            isLight ? 'text-blue-900/80' : 'text-slate-400'
          }`}>
            Traffic Distributed
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
            isLight ? 'bg-blue-600/15 text-blue-800' : 'bg-blue-500/20 text-blue-400 font-black'
          }`}>
            <FiActivity className="w-4 h-4" />
          </div>
        </div>
        <p className={`text-2xl font-black tracking-tight ${isLight ? 'text-blue-950' : 'text-white'}`}>
          {calcBandwidth()}
        </p>
        <p className="text-xs font-semibold text-slate-400 mt-2.5">
          Timetable document bandwidth
        </p>
      </div>
    </div>
  );
};
