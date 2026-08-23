import { useMutation } from '@tanstack/react-query';
import {
  requestPasswordResetOtp,
  resetPassword,
} from '../services/auth.service';
import type {
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../schemas/auth';

export const useRequestResetOtp = () =>
  useMutation({
    mutationFn: (payload: ForgotPasswordRequest) => requestPasswordResetOtp(payload),
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: (payload: ResetPasswordRequest) => resetPassword(payload),
  });
