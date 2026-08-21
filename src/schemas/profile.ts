import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(data => {
  if (data.newPassword || data.confirmPassword) {
    return data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  message: "New passwords do not match",
  path: ["confirmPassword"]
});

export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
