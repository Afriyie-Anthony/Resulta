import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import type { TimetableItem, TimetableStatus, TimetableVoucherType } from '../../../schemas/timetable';
import { FiSave, FiAlertCircle, FiUpload, FiFileText, FiX, FiExternalLink, FiLoader } from 'react-icons/fi';

interface ScheduleConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: TimetableItem | null;
  onSave: (formData: FormData) => void;
  isSaving?: boolean;
}

export const ScheduleConfigModal: React.FC<ScheduleConfigModalProps> = ({
  isOpen,
  onClose,
  schedule,
  onSave,
  isSaving = false,
}) => {
  const { isLight } = useAdminTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [voucherType, setVoucherType] = useState<TimetableVoucherType>('BECE');
  const [status, setStatus] = useState<TimetableStatus>('DRAFT');
  
  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state with selected schedule
  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title || '');
      setAcademicYear(schedule.academicYear || '');
      setVoucherType(schedule.voucherType || 'BECE');
      setStatus(schedule.status || 'DRAFT');
      setSelectedFile(null);
      setErrorMsg('');
    } else {
      setTitle('');
      setAcademicYear(new Date().getFullYear().toString());
      setVoucherType('BECE');
      setStatus('DRAFT');
      setSelectedFile(null);
      setErrorMsg('');
    }
  }, [schedule, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setErrorMsg('Only PDF documents are supported for official timetables.');
        return;
      }
      setErrorMsg('');
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setErrorMsg('Only PDF documents are supported for official timetables.');
        return;
      }
      setErrorMsg('');
      setSelectedFile(file);
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !academicYear.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('academicYear', academicYear.trim());
    formData.append('voucherType', voucherType);
    formData.append('status', status);

    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={schedule ? 'Configure GES Timetable Settings' : 'Add New GES Timetable'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <div>
          <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Examination Campaign Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. WASSCE School Candidates"
            className={`w-full rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none border transition-all ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-primary focus:border-[#0F8B8D] focus:bg-white'
                : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500 focus:bg-slate-900'
            }`}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Academic Year <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="e.g. 2026"
              className={`w-full rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none border transition-all ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-primary focus:border-[#0F8B8D] focus:bg-white'
                  : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500 focus:bg-slate-900'
              }`}
            />
          </div>
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Exam Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={voucherType}
              onChange={(e) => setVoucherType(e.target.value as TimetableVoucherType)}
              className={`w-full rounded-2xl px-3 py-2.5 text-xs font-semibold focus:outline-none border transition-all ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-primary focus:border-[#0F8B8D] focus:bg-white'
                  : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500 focus:bg-slate-900'
              }`}
            >
              <option value="BECE">BECE</option>
              <option value="WASSCE_NOVDEC">WASSCE / NOVDEC</option>
            </select>
          </div>
        </div>

        {/* Portal Status Option */}
        <div>
          <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Portal Hosting Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TimetableStatus)}
            className={`w-full rounded-2xl px-3 py-2.5 text-xs font-semibold focus:outline-none border transition-all ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-primary focus:border-[#0F8B8D] focus:bg-white'
                : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500 focus:bg-slate-900'
            }`}
          >
            <option value="DRAFT">DRAFT (Awaiting File Upload or Approval)</option>
            <option value="PUBLISHED">PUBLISHED (Live on Web for Students)</option>
            <option value="ARCHIVED">ARCHIVED (Past Year Archive)</option>
          </select>
        </div>

        {/* File Uploader Section */}
        <div>
          <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Official Timetable Document (PDF)
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            className="hidden"
          />

          {/* If new file selected */}
          {selectedFile ? (
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
              isLight ? 'bg-emerald-50/70 border-emerald-300' : 'bg-emerald-950/20 border-emerald-800'
            }`}>
              <div className="flex items-center gap-2.5 font-semibold truncate">
                <FiFileText className="text-emerald-600 shrink-0 w-4 h-4" />
                <span className={`truncate max-w-[200px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {selectedFile.name}
                </span>
                <span className="text-[11px] text-slate-500 font-medium shrink-0">
                  ({formatBytes(selectedFile.size)})
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="text-rose-600 dark:text-rose-400 p-1 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                title="Remove selected file"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ) : schedule?.fileUrl ? (
            /* If existing file exists on server */
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center gap-2.5 font-semibold truncate">
                <FiFileText className="text-[#0F8B8D] dark:text-teal-400 shrink-0 w-4 h-4" />
                <span className={`truncate max-w-[180px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {schedule.filename || 'Hosted Timetable.pdf'}
                </span>
                {schedule.fileSize && (
                  <span className="text-[11px] text-slate-500 font-medium shrink-0">
                    ({typeof schedule.fileSize === 'number' ? formatBytes(schedule.fileSize) : schedule.fileSize})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={schedule.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 dark:text-teal-400 p-1 hover:bg-teal-100 dark:hover:bg-teal-950/50 rounded-lg transition-colors"
                  title="View PDF"
                >
                  <FiExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-[#0F8B8D] dark:text-teal-400 hover:underline px-2 py-1"
                >
                  Replace PDF
                </button>
              </div>
            </div>
          ) : (
            /* Upload area when no file exists */
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full p-5 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold cursor-pointer ${
                isDragOver
                  ? 'border-teal-500 bg-teal-50/30 dark:bg-teal-950/20'
                  : isLight
                  ? 'bg-slate-50 border-slate-300 hover:bg-slate-100 hover:border-slate-400 text-slate-500'
                  : 'bg-slate-950 border-slate-800 hover:bg-slate-900 hover:border-slate-700 text-slate-400'
              }`}
            >
              <FiUpload className="w-5 h-5 text-slate-400 shrink-0" />
              <span>Click or drag & drop official GES Timetable (PDF)</span>
              <span className="text-[10px] text-slate-400">Max size 25MB • PDF only</span>
            </div>
          )}
        </div>

        {/* Dynamic Warning Helper */}
        <div className={`p-3 rounded-2xl border flex items-start gap-2.5 text-[11px] font-semibold leading-relaxed ${
          isLight ? 'bg-amber-50/70 border-amber-200 text-amber-900' : 'bg-amber-950/20 border-amber-900/40 text-amber-300'
        }`}>
          <FiAlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>Setting portal status to <strong>PUBLISHED</strong> immediately makes the uploaded PDF available on public student widgets.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isSaving} className="!rounded-xl">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={isSaving}
            leftIcon={isSaving ? <FiLoader className="w-3.5 h-3.5 animate-spin" /> : <FiSave className="w-3.5 h-3.5" />}
            className="!rounded-xl px-6 font-bold"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
