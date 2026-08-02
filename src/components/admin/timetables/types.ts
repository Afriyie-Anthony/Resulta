export type PortalStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
export type ExamType = 'BECE' | 'WASSCE/NOVDEC';

export interface ExamSchedule {
  exam: string;
  examType: ExamType;
  academicYear: string;
  portalStatus: PortalStatus;
  fileName: string;
  fileSize: string;
  downloads: number;
  uploadedAt: string;
}
