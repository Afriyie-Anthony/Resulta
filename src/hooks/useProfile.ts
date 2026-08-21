import { useMutation } from '@tanstack/react-query';
import { updateAdminProfile } from '../services/profile.service';
import type { UpdateProfileDTO } from '../schemas/profile';
import { useAuthStore } from '../store/authStore';

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
