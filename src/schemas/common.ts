import { z } from 'zod';

/**
 * Common reusable Zod schemas used across multiple domain schemas.
 */

// ─── Pagination ──────────────────────────────────────────────────────────────
export const paginationMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    meta: paginationMetaSchema,
  });

// ─── Standard API Envelope ───────────────────────────────────────────────────
export const apiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    message: z.string().optional(),
    data: dataSchema,
  });

export const apiErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
});

// ─── Ghana Phone Number ──────────────────────────────────────────────────────
export const ghanaPhoneSchema = z.string().refine(
  (val) => {
    const cleaned = val.replace(/\D/g, '');
    return (
      (cleaned.startsWith('0') && cleaned.length === 10) ||
      (cleaned.startsWith('233') && cleaned.length === 12)
    );
  },
  { message: 'Enter a valid Ghanaian phone number (e.g. 024 XXX XXXX)' },
);

// ─── Timestamps ──────────────────────────────────────────────────────────────
export const isoDateStringSchema = z.string().datetime({ offset: true });

// ─── Exported Types ──────────────────────────────────────────────────────────
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
