import apiClient from '../lib/axios';
import type { UpdateProfileDTO } from '../schemas/profile';
import type { AuthUser } from '../schemas/auth';

export const getAdminProfile = async (): Promise<AuthUser> => {
  const { data } = await apiClient.get<AuthUser>('/admin/profile');
  return data;
};

export const updateAdminProfile = async (payload: UpdateProfileDTO): Promise<AuthUser> => {
  const { data } = await apiClient.patch<AuthUser>('/admin/profile', payload);
  return data;
};
