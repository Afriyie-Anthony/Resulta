import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import type { ExamSchedule, PortalStatus, ExamType } from './types';
import { FiSave, FiAlertCircle, FiUpload, FiFileText } from 'react-icons/fi';

interface ScheduleConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: ExamSchedule | null;
  onSave: (schedule: ExamSchedule) => void;
}

export const ScheduleConfigModal: React.FC<ScheduleConfigModalProps> = ({
  isOpen,
  onClose,
  schedule,
  onSave
}) => {
  const { isLight } = useAdminTheme();
  const [exam, setExam] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [portalStatus, setPortalStatus] = useState<PortalStatus>('DRAFT');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [examType, setExamType] = useState<ExamType>('BECE');
  const [downloads, setDownloads] = useState(0);

  // Sync state with selected schedule
  useEffect(() => {
    if (schedule) {
      setExam(schedule.exam);
      setAcademicYear(schedule.academicYear);
      setPortalStatus(schedule.portalStatus);
      setFileName(schedule.fileName);
      setFileSize(schedule.fileSize);
      setExamType(schedule.examType);
      setDownloads(schedule.downloads);
    } else {
      setExam('');
      setAcademicYear('2026');
      setPortalStatus('DRAFT');
      setFileName('');
      setFileSize('');
      setExamType('BECE');
      setDownloads(0);
    }
  }, [schedule, isOpen]);

  // Simulate file upload choice
  const handleSimulateUpload = () => {
    const defaultName = `${exam.toLowerCase().replace(/[^a-z0-9]/g, '_')}_timetable_2026.pdf`;
    setFileName(defaultName);
    setFileSize('1.8 MB');
    setPortalStatus('PUBLISHED'); // auto-promote to published when file is uploaded
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam) return;
    onSave({
      exam,
      academicYear,
      portalStatus,
      fileName,
      fileSize,
      downloads,
      uploadedAt: fileName ? 'Just now' : '',
      examType
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={schedule ? 'Configure GES Timetable Settings' : 'Add New GES Timetable'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form Inputs */}
        <div>
          <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-350'}`}>
            Examination Campaign Title
          </label>
          <input
            type="text"
            required
            value={exam}
            onChange={(e) => setExam(e.target.value)}
            placeholder="e.g. WASSCE School Candidates"
            className={`w-full rounded-2xl px-4 py-2 text-xs font-semibold focus:outline-none border ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-primary focus:border-[#0F8B8D] focus:bg-white'
                : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500 focus:bg-slate-900'
            }`}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-350'}`}>
              Academic Year
            </label>
            <input
              type="text"
              required
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="e.g. 2025/2026"
              className={`w-full rounded-2xl px-4 py-2 text-xs font-semibold focus:outline-none border ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-primary focus:border-[#0F8B8D] focus:bg-white'
                  : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500 focus:bg-slate-900'
              }`}
            />
          </div>
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-350'}`}>
              Exam Category
            </label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value as ExamType)}
              className={`w-full rounded-2xl px-3 py-2 text-xs font-semibold focus:outline-none border ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-primary focus:border-[#0F8B8D] focus:bg-white'
                  : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500 focus:bg-slate-900'
              }`}
            >
              <option value="BECE">BECE</option>
              <option value="WASSCE/NOVDEC">WASSCE / NOVDEC</option>
            </select>
          </div>
        </div>

        {/* Portal Status Option */}
        <div>
          <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-350'}`}>
            Portal Hosting Status
          </label>
          <select
            value={portalStatus}
            onChange={(e) => setPortalStatus(e.target.value as PortalStatus)}
            className={`w-full rounded-2xl px-3 py-2 text-xs font-semibold focus:outline-none border ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-primary focus:border-[#0F8B8D] focus:bg-white'
                : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500 focus:bg-slate-900'
            }`}
          >
            <option value="PUBLISHED">PUBLISHED (Live on Web for Students)</option>
            <option value="DRAFT">DRAFT (Awaiting File Upload)</option>
            <option value="ARCHIVED">ARCHIVED (Awaits next year's window)</option>
          </select>
        </div>

        {/* File Uploader Mock Section */}
        <div>
          <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-350'}`}>
            GES Timetable File (PDF)
          </label>
          {fileName ? (
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
              isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-emerald-950/20 border-emerald-900/30'
            }`}>
              <div className="flex items-center gap-2 font-semibold">
                <FiFileText className="text-emerald-600 shrink-0 w-4 h-4" />
                <span className={`truncate max-w-[200px] ${isLight ? 'text-primary' : 'text-white'}`}>{fileName}</span>
                <span className="text-[10px] text-slate-400 font-medium">({fileSize})</span>
              </div>
              <button
                type="button"
                onClick={() => { setFileName(''); setFileSize(''); setPortalStatus('DRAFT'); }}
                className="text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSimulateUpload}
              className={`w-full p-4 rounded-2xl border border-dashed flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold ${
                isLight 
                  ? 'bg-slate-50 border-slate-300 hover:bg-slate-100 hover:border-slate-400 text-slate-500' 
                  : 'bg-slate-950 border-slate-800 hover:bg-slate-900 hover:border-slate-700 text-slate-400'
              }`}
            >
              <FiUpload className="w-5 h-5 text-slate-400 shrink-0" />
              <span>Click to Upload official GES Timetable Document (PDF)</span>
            </button>
          )}
        </div>

        {/* Dynamic Warning Helper */}
        <div className={`p-3 rounded-2xl border flex items-start gap-2.5 text-[11px] font-semibold leading-relaxed ${
          isLight ? 'bg-amber-50/50 border-amber-200 text-amber-800' : 'bg-amber-950/20 border-amber-900/40 text-amber-300'
        }`}>
          <FiAlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>Setting portal status to PUBLISHED instantly publishes the uploaded PDF to the public-facing download widget for candidates.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" size="sm" onClick={onClose} className="!rounded-xl">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            leftIcon={<FiSave className="w-3.5 h-3.5" />}
            className="!rounded-xl px-6"
          >
            Save Settings
          </Button>
        </div>
      </form>
    </Modal>
  );
};
