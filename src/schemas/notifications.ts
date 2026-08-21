import { z } from 'zod';

export const notificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.string(),
  read: z.boolean(),
  createdAt: z.string().datetime({ offset: true }).or(z.string()),
});

export const notificationsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    notifications: z.array(notificationSchema),
    pagination: z.object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
    }),
    unreadCount: z.number(),
  }),
});

export type Notification = z.infer<typeof notificationSchema>;
export type NotificationsResponse = z.infer<typeof notificationsResponseSchema>;
