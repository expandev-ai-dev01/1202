/**
 * @module auth/types
 * @summary Type definitions for authentication domain
 * @domain security
 * @category types
 */

export interface User {
  id: string;
  email: string;
  twoFactorEnabled: boolean;
  inactivityTimeout: number;
  createdAt: string;
  lastAccess?: string;
}

export interface LoginCredentials {
  email: string;
  masterPassword: string;
  twoFactorCode?: string;
}

export interface RegisterData {
  email: string;
  masterPassword: string;
  confirmMasterPassword: string;
  securityQuestion: string;
  securityAnswer: string;
  twoFactorEnabled: boolean;
  phone?: string;
  inactivityTimeout: number;
}

export interface RecoveryRequest {
  email: string;
}

export interface RecoveryVerify {
  token: string;
  securityAnswer: string;
  newMasterPassword: string;
  confirmNewMasterPassword: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  requiresTwoFactor?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
