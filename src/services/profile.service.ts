import apiClient from '../lib/axios';
import type { UpdateProfileDTO } from '../schemas/profile';
import type { AuthUser } from '../schemas/auth';

export const updateAdminProfile = async (payload: UpdateProfileDTO): Promise<AuthUser> => {
  const { data } = await apiClient.patch<any>('/admin/profile', payload);
  return data;
};
