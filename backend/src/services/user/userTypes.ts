/**
 * @module services/user/userTypes
 * @summary Type definitions for user management
 */

export interface UserEntity {
  id: string;
  email: string;
  dateCreated: Date;
  lastAccess: Date | null;
  failedAttempts: number;
  accountLocked: boolean;
  twoFactorEnabled: boolean;
  phone: string | null;
  inactivityTimeout: number;
}

export interface UserCreateRequest {
  email: string;
  masterPassword: string;
  confirmMasterPassword: string;
  securityQuestion: string;
  securityAnswer: string;
  twoFactorEnabled: boolean;
  phone?: string;
  inactivityTimeout?: number;
}

export interface UserLoginRequest {
  email: string;
  masterPassword: string;
  twoFactorCode?: string;
}

export interface UserLoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    twoFactorEnabled: boolean;
  };
}

export interface PasswordRecoveryRequest {
  email: string;
}

export interface PasswordRecoveryVerifyRequest {
  token: string;
  securityAnswer: string;
  newMasterPassword: string;
  confirmNewMasterPassword: string;
}

export interface PasswordRecoveryEntity {
  id: string;
  userId: string;
  token: string;
  dateRequested: Date;
  dateExpiration: Date;
  ipAddress: string;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
}
