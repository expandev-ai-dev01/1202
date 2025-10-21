/**
 * @hook useRecovery
 * @summary Manages password recovery process
 * @domain auth
 * @type domain-hook
 * @category authentication
 */

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import type { UseRecoveryOptions, UseRecoveryReturn } from './types';
import type { RecoveryRequest, RecoveryVerify } from '../../types';

export const useRecovery = (options: UseRecoveryOptions = {}): UseRecoveryReturn => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const requestMutation = useMutation({
    mutationFn: (data: RecoveryRequest) => authService.requestRecovery(data),
    onSuccess: () => {
      options.onRequestSuccess?.();
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (data: RecoveryVerify) => authService.verifyRecovery(data),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      options.onVerifySuccess?.();
      navigate('/vault');
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });

  const requestRecovery = async (data: RecoveryRequest): Promise<void> => {
    await requestMutation.mutateAsync(data);
  };

  const verifyRecovery = async (data: RecoveryVerify): Promise<void> => {
    await verifyMutation.mutateAsync(data);
  };

  return {
    requestRecovery,
    verifyRecovery,
    isRequestLoading: requestMutation.isPending,
    isVerifyLoading: verifyMutation.isPending,
    requestError: requestMutation.error,
    verifyError: verifyMutation.error,
  };
};
