import { useQuery, useMutation } from '@tanstack/react-query';
import { getAdminProfile, updateAdminProfile } from '../services/profile.service';
import type { UpdateProfileDTO } from '../schemas/profile';
import { useAuthStore } from '../store/authStore';

export const useGetProfile = () => {
  const setUser = useAuthStore(state => state.setUser);
  
  return useQuery({
    queryKey: ['adminProfile'],
    queryFn: async () => {
      const data = await getAdminProfile();
      setUser(data);
      return data;
    }
  });
};

export const useUpdateProfile = () => {
  const setUser = useAuthStore(state => state.setUser);
  
  return useMutation({
    mutationFn: (data: UpdateProfileDTO) => updateAdminProfile(data),
    onSuccess: (updatedUser) => {
      // Automatically update the global auth state with the new profile data
      setUser(updatedUser);
    }
  });
};
