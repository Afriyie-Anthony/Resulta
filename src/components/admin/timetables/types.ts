import type { TimetableItem, TimetableStatus, TimetableVoucherType } from '../../../schemas/timetable';

export type PortalStatus = TimetableStatus;
export type ExamType = 'BECE' | 'WASSCE/NOVDEC' | 'WASSCE_NOVDEC';

export type ExamSchedule = TimetableItem;

export type { TimetableItem, TimetableStatus, TimetableVoucherType };
