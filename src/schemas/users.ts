import { z } from 'zod';

export const userRoleEnum = z.enum(['SUPER_ADMIN', 'ADMIN', 'AFFILIATE', 'USER']);

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: userRoleEnum,
  status: z.string().optional(),
  lastLoginAt: z.string().datetime({ offset: true }).nullable().optional(),
  createdAt: z.string().datetime({ offset: true }).nullable().optional(),
});

export const userListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    users: z.array(userSchema),
    pagination: z.object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
    }),
  }),
});

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters'),
  role: userRoleEnum,
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  role: userRoleEnum.optional(),
}).refine(data => {
  if (data.password) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type User = z.infer<typeof userSchema>;
export type UserListResponse = z.infer<typeof userListResponseSchema>;
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
