import { z } from 'zod';

export const topActionSchema = z.object({
  action: z.string(),
  count: z.number(),
});

export const auditStatsSchema = z.object({
  totalLogsCount: z.number(),
  todayLogsCount: z.number(),
  uniqueActiveUsersCount: z.number(),
  topActions: z.array(topActionSchema),
});

export const auditUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
});

export const auditLogEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  action: z.string(),
  details: z.any().optional(), // Can be an object, string, etc depending on action
  ipAddress: z.string(),
  userAgent: z.string().optional(),
  createdAt: z.string(),
  user: auditUserSchema.optional(),
});

export const paginatedAuditLogsResponseSchema = z.object({
  data: z.array(auditLogEntrySchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export type AuditStats = z.infer<typeof auditStatsSchema>;
export type AuditLogEntry = z.infer<typeof auditLogEntrySchema>;
export type PaginatedAuditLogsResponse = z.infer<typeof paginatedAuditLogsResponseSchema>;

export interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  userId?: string;
}
