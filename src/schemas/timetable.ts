import { z } from 'zod';

/**
 * Admin Timetable Schemas
 * Used for examination schedules and GES timetable registry.
 */

export const timetableStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
export const timetableVoucherTypeSchema = z.enum(['BECE', 'WASSCE_NOVDEC']);

export const timetableItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  academicYear: z.string(),
  voucherType: timetableVoucherTypeSchema,
  status: timetableStatusSchema,
  fileUrl: z.string().nullable().optional(),
  filename: z.string().nullable().optional(),
  fileSize: z.union([z.number(), z.string()]).nullable().optional(),
  downloadCount: z.number().default(0),
  createdAt: z.string().optional(),
});

export const timetableFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  search: z.string().optional(),
  voucherType: z.string().optional(),
  status: z.string().optional(),
  academicYear: z.string().optional(),
});

export type TimetableStatus = z.infer<typeof timetableStatusSchema>;
export type TimetableVoucherType = z.infer<typeof timetableVoucherTypeSchema>;
export type TimetableItem = z.infer<typeof timetableItemSchema>;
export type TimetableFilters = z.infer<typeof timetableFiltersSchema>;

export interface TimetableListResponse {
  data: TimetableItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
