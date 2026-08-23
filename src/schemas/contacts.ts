import { z } from 'zod';

export const contactStatusSchema = z.enum(['PENDING', 'READ', 'REPLIED', 'ARCHIVED', 'ALL']);

export const contactStatsSchema = z.object({
  totalMessages: z.number().int().nonnegative(),
  pendingCount: z.number().int().nonnegative(),
  readCount: z.number().int().nonnegative(),
  repliedCount: z.number().int().nonnegative(),
  archivedCount: z.number().int().nonnegative(),
  unreadCount: z.number().int().nonnegative(),
});

export const contactMessageSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  subject: z.string(),
  message: z.string(),
  status: z.enum(['PENDING', 'READ', 'REPLIED', 'ARCHIVED']),
  replyMessage: z.string().nullable().optional(),
  repliedAt: z.string().nullable().optional(),
  createdAt: z.string(),
});

export const paginatedContactsResponseSchema = z.object({
  data: z.array(contactMessageSchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export const contactQueryFiltersSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
  status: z.string().optional(),
});

export type ContactStatus = z.infer<typeof contactStatusSchema>;
export type ContactStats = z.infer<typeof contactStatsSchema>;
export type ContactMessage = z.infer<typeof contactMessageSchema>;
export type PaginatedContactsResponse = z.infer<typeof paginatedContactsResponseSchema>;
export type ContactQueryFilters = z.infer<typeof contactQueryFiltersSchema>;
