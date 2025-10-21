/**
 * @hook useAuth
 * @summary Provides authentication state and actions
 * @domain auth
 * @type state-hook
 * @category authentication
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import type { UseAuthReturn } from './types';

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isLoading, clearAuth } = useAuthStore();

  const logout = useCallback(() => {
    clearAuth();
    navigate('/login');
  }, [clearAuth, navigate]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    logout,
  };
};
