import apiClient from '../lib/axios';
import type { UserListResponse, CreateUserDTO, UpdateUserDTO, User } from '../schemas/users';

interface FetchUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export const fetchUsers = async (params?: FetchUsersParams): Promise<UserListResponse['data']> => {
  const { data } = await apiClient.get<any>('/admin/users', { params });
  return data;
};

export const fetchUserById = async (id: string): Promise<User> => {
  const { data } = await apiClient.get<any>(`/admin/users/${id}`);
  return data;
};

export const createUser = async (payload: CreateUserDTO): Promise<User> => {
  const { data } = await apiClient.post<any>('/admin/users', payload);
  return data;
};

export const updateUser = async (id: string, payload: UpdateUserDTO): Promise<User> => {
  const { data } = await apiClient.patch<any>(`/admin/users/${id}`, payload);
  return data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/users/${id}`);
};
