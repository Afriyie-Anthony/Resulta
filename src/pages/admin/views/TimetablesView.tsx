import React, { useState } from 'react';
import { useToast } from '../../../components/ui/Toast';
import type { ExamSchedule } from '../../../components/admin/timetables';
import {
  TimetablesHeader,
  TimetablesGrid,
  ScheduleConfigModal
} from '../../../components/admin/timetables';

export const TimetablesView: React.FC = () => {
  const { addToast } = useToast();
  const [schedules, setSchedules] = useState<ExamSchedule[]>([
    {
      exam: 'WASSCE School Candidates',
      academicYear: '2025/2026',
      portalStatus: 'PUBLISHED',
      fileName: 'ges_wassce_timetable_2026.pdf',
      fileSize: '1.4 MB',
      downloads: 12450,
      uploadedAt: '3 days ago',
      examType: 'WASSCE/NOVDEC'
    },
    {
      exam: 'BECE School Candidates',
      academicYear: '2025/2026',
      portalStatus: 'PUBLISHED',
      fileName: 'ges_bece_timetable_2026.pdf',
      fileSize: '980 KB',
      downloads: 9120,
      uploadedAt: '1 week ago',
      examType: 'BECE'
    },
    {
      exam: 'WASSCE Private Candidates (Nov-Dec)',
      academicYear: '2026',
      portalStatus: 'DRAFT',
      fileName: '',
      fileSize: '',
      downloads: 0,
      uploadedAt: '',
      examType: 'WASSCE/NOVDEC'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ExamSchedule | null>(null);

  const handleAddSchedule = () => {
    setSelectedSchedule(null);
    setIsModalOpen(true);
  };

  const handleConfigureSchedule = (schedule: ExamSchedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleSaveSchedule = (savedData: ExamSchedule) => {
    if (selectedSchedule) {
      // Edit existing schedule
      setSchedules((prev) =>
        prev.map((item) => (item.exam === selectedSchedule.exam ? savedData : item))
      );
      addToast({
        title: 'GES Timetable Published',
        message: `Updated hosting preferences for ${savedData.exam} on the student portal.`,
        type: 'success',
        duration: 4000
      });
    } else {
      // Create new schedule
      setSchedules((prev) => [...prev, savedData]);
      addToast({
        title: 'GES Timetable Added',
        message: `Registered ${savedData.exam} in database directory.`,
        type: 'success',
        duration: 4000
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header without horizontal dividers */}
      <TimetablesHeader onAddSchedule={handleAddSchedule} />

      {/* Grid of Schedules Color-coded by status */}
      <TimetablesGrid
        schedules={schedules}
        onConfigureSchedule={handleConfigureSchedule}
      />

      {/* Create / Edit Schedule configuration modal */}
      <ScheduleConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        schedule={selectedSchedule}
        onSave={handleSaveSchedule}
      />
    </div>
  );
};
