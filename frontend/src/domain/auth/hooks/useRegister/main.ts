/**
 * @hook useRegister
 * @summary Manages user registration
 * @domain auth
 * @type domain-hook
 * @category authentication
 */

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import type { UseRegisterOptions, UseRegisterReturn } from './types';
import type { RegisterData } from '../../types';

export const useRegister = (options: UseRegisterOptions = {}): UseRegisterReturn => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const mutation = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      options.onSuccess?.();
      navigate('/vault');
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });

  const register = async (data: RegisterData): Promise<void> => {
    await mutation.mutateAsync(data);
  };

  return {
    register,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
