/**
 * @hook useLogin
 * @summary Manages user login with authentication
 * @domain auth
 * @type domain-hook
 * @category authentication
 */

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import type { UseLoginOptions, UseLoginReturn } from './types';
import type { LoginCredentials } from '../../types';

export const useLogin = (options: UseLoginOptions = {}): UseLoginReturn => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const mutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      if (data.requiresTwoFactor) {
        return;
      }
      setAuth(data.token, data.user);
      options.onSuccess?.();
      navigate('/vault');
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });

  const login = async (credentials: LoginCredentials): Promise<void> => {
    await mutation.mutateAsync(credentials);
  };

  return {
    login,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
