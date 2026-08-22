import React, { useState } from 'react';
import { useToast } from '../../../components/ui/Toast';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { useDebounce } from '../../../hooks/useDebounce';
import {
  useTimetables,
  useCreateTimetable,
  useUpdateTimetable,
  useDeleteTimetable,
} from '../../../hooks/useTimetables';
import type { TimetableItem } from '../../../schemas/timetable';
import {
  TimetablesHeader,
  TimetablesKpiGrid,
  TimetablesGrid,
  ScheduleConfigModal,
} from '../../../components/admin/timetables';
import { FiAlertTriangle, FiTrash2, FiLoader } from 'react-icons/fi';

export const TimetablesView: React.FC = () => {
  const { addToast } = useToast();

  // Search and Filter State
  const [search, setSearch] = useState('');
  const [voucherType, setVoucherType] = useState('');
  const [status, setStatus] = useState('');

  const debouncedSearch = useDebounce(search, 350);

  // Queries & Mutations
  const { data: timetablesResponse, isLoading } = useTimetables({
    search: debouncedSearch.trim() || undefined,
    voucherType: voucherType || undefined,
    status: status || undefined,
  });

  const createMutation = useCreateTimetable();
  const updateMutation = useUpdateTimetable();
  const deleteMutation = useDeleteTimetable();

  const schedules = timetablesResponse?.data || [];

  // Modal State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<TimetableItem | null>(null);

  // Delete Confirmation State
  const [scheduleToDelete, setScheduleToDelete] = useState<TimetableItem | null>(null);

  const handleAddSchedule = () => {
    setSelectedSchedule(null);
    setIsConfigModalOpen(true);
  };

  const handleConfigureSchedule = (schedule: TimetableItem) => {
    setSelectedSchedule(schedule);
    setIsConfigModalOpen(true);
  };

  const handleSaveSchedule = async (formData: FormData) => {
    try {
      if (selectedSchedule) {
        // Update existing schedule
        await updateMutation.mutateAsync({
          id: selectedSchedule.id,
          formData,
        });
        addToast({
          title: 'Timetable Updated',
          message: `Successfully updated settings for ${formData.get('title') || selectedSchedule.title}.`,
          type: 'success',
          duration: 4000,
        });
      } else {
        // Create new schedule
        await createMutation.mutateAsync(formData);
        addToast({
          title: 'Timetable Created',
          message: `Successfully registered examination campaign ${formData.get('title')}.`,
          type: 'success',
          duration: 4000,
        });
      }
      setIsConfigModalOpen(false);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save timetable settings. Please try again.';
      addToast({
        title: 'Operation Failed',
        message: errorMsg,
        type: 'error',
        duration: 5000,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!scheduleToDelete) return;
    try {
      await deleteMutation.mutateAsync(scheduleToDelete.id);
      addToast({
        title: 'Timetable Deleted',
        message: `Removed ${scheduleToDelete.title} from registry.`,
        type: 'success',
        duration: 4000,
      });
      setScheduleToDelete(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete timetable entry.';
      addToast({
        title: 'Delete Failed',
        message: errorMsg,
        type: 'error',
        duration: 5000,
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* 1. Theme-aware Header with Search & Filter Bar */}
      <TimetablesHeader
        search={search}
        onSearchChange={setSearch}
        voucherType={voucherType}
        onVoucherTypeChange={setVoucherType}
        status={status}
        onStatusChange={setStatus}
        onAddSchedule={handleAddSchedule}
      />

      {/* 2. KPI Summary Metric Grid */}
      <TimetablesKpiGrid schedules={schedules} />

      {/* 3. Main Exam Schedule Cards */}
      <TimetablesGrid
        schedules={schedules}
        isLoading={isLoading}
        onConfigureSchedule={handleConfigureSchedule}
        onDeleteSchedule={(schedule) => setScheduleToDelete(schedule)}
      />

      {/* 4. Create / Edit Schedule configuration modal */}
      <ScheduleConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        schedule={selectedSchedule}
        onSave={handleSaveSchedule}
        isSaving={isSaving}
      />

      {/* 5. Delete Confirmation Modal */}
      <Modal
        isOpen={!!scheduleToDelete}
        onClose={() => setScheduleToDelete(null)}
        title="Delete Examination Timetable"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
            <FiAlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold">Are you sure you want to delete this timetable?</p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                This will permanently remove <strong>{scheduleToDelete?.title}</strong> and revoke student access to any associated hosted PDF document.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setScheduleToDelete(null)}
              disabled={deleteMutation.isPending}
              className="!rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              leftIcon={deleteMutation.isPending ? <FiLoader className="w-3.5 h-3.5 animate-spin" /> : <FiTrash2 className="w-3.5 h-3.5" />}
              className="!rounded-xl px-5 font-bold"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Timetable'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
