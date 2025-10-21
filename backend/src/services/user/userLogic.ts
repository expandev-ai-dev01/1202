/**
 * @module services/user/userLogic
 * @summary User management business logic (in-memory storage)
 */

import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import type {
  UserEntity,
  UserCreateRequest,
  UserLoginRequest,
  UserLoginResponse,
  PasswordRecoveryRequest,
  PasswordRecoveryEntity,
  PasswordRecoveryVerifyRequest,
} from './userTypes';

// In-memory storage
const users = new Map<
  string,
  UserEntity & { masterPasswordHash: string; securityAnswerHash: string; securityQuestion: string }
>();
const recoveryRequests = new Map<string, PasswordRecoveryEntity>();
const sessions = new Map<string, { userId: string; expiresAt: Date }>();

const BCRYPT_ROUNDS = 10;
const RECOVERY_TOKEN_EXPIRY_HOURS = 24;
const MAX_FAILED_ATTEMPTS = 5;
const SESSION_DURATION_HOURS = 24;

/**
 * @summary Validates master password strength
 */
function validateMasterPassword(password: string): void {
  if (password.length < 12) {
    throw new Error('masterPasswordTooShort');
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('masterPasswordMissingUppercase');
  }
  if (!/[a-z]/.test(password)) {
    throw new Error('masterPasswordMissingLowercase');
  }
  if (!/[0-9]/.test(password)) {
    throw new Error('masterPasswordMissingNumber');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new Error('masterPasswordMissingSpecialChar');
  }
  if (/123456|abcdef|password/i.test(password)) {
    throw new Error('masterPasswordTooObvious');
  }
}

/**
 * @summary Creates a new user account
 */
export async function userCreate(params: UserCreateRequest): Promise<{ id: string }> {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(params.email)) {
    throw new Error('invalidEmailFormat');
  }

  // Check if email already exists
  for (const user of users.values()) {
    if (user.email === params.email) {
      throw new Error('emailAlreadyExists');
    }
  }

  // Validate master password
  validateMasterPassword(params.masterPassword);

  // Validate password confirmation
  if (params.masterPassword !== params.confirmMasterPassword) {
    throw new Error('passwordConfirmationMismatch');
  }

  // Validate master password not equal to email
  if (params.masterPassword === params.email) {
    throw new Error('masterPasswordCannotBeEmail');
  }

  // Validate security question
  if (!params.securityQuestion || params.securityQuestion.trim().length === 0) {
    throw new Error('securityQuestionRequired');
  }

  // Validate security answer
  if (!params.securityAnswer || params.securityAnswer.length < 3) {
    throw new Error('securityAnswerTooShort');
  }
  if (params.securityAnswer.length > 100) {
    throw new Error('securityAnswerTooLong');
  }

  // Validate phone if two-factor enabled
  if (params.twoFactorEnabled) {
    if (!params.phone) {
      throw new Error('phoneRequiredForTwoFactor');
    }
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(params.phone)) {
      throw new Error('invalidPhoneFormat');
    }
  }

  // Validate inactivity timeout
  const inactivityTimeout = params.inactivityTimeout || 15;
  if (inactivityTimeout < 1 || inactivityTimeout > 60) {
    throw new Error('invalidInactivityTimeout');
  }

  // Hash master password and security answer
  const masterPasswordHash = await bcrypt.hash(params.masterPassword, BCRYPT_ROUNDS);
  const securityAnswerHash = await bcrypt.hash(params.securityAnswer.toLowerCase(), BCRYPT_ROUNDS);

  // Create user
  const userId = uuidv4();
  const user: UserEntity & {
    masterPasswordHash: string;
    securityAnswerHash: string;
    securityQuestion: string;
  } = {
    id: userId,
    email: params.email,
    masterPasswordHash,
    securityQuestion: params.securityQuestion,
    securityAnswerHash,
    dateCreated: new Date(),
    lastAccess: null,
    failedAttempts: 0,
    accountLocked: false,
    twoFactorEnabled: params.twoFactorEnabled,
    phone: params.phone || null,
    inactivityTimeout,
  };

  users.set(userId, user);

  return { id: userId };
}

/**
 * @summary Authenticates user login
 */
export async function userLogin(params: UserLoginRequest): Promise<UserLoginResponse> {
  // Find user by email
  let foundUser:
    | (UserEntity & {
        masterPasswordHash: string;
        securityAnswerHash: string;
        securityQuestion: string;
      })
    | undefined;
  for (const user of users.values()) {
    if (user.email === params.email) {
      foundUser = user;
      break;
    }
  }

  if (!foundUser) {
    throw new Error('invalidCredentials');
  }

  // Check if account is locked
  if (foundUser.accountLocked) {
    throw new Error('accountLocked');
  }

  // Verify master password
  const passwordMatch = await bcrypt.compare(params.masterPassword, foundUser.masterPasswordHash);
  if (!passwordMatch) {
    foundUser.failedAttempts++;
    if (foundUser.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      foundUser.accountLocked = true;
    }
    throw new Error('invalidCredentials');
  }

  // Verify two-factor code if enabled
  if (foundUser.twoFactorEnabled) {
    if (!params.twoFactorCode) {
      throw new Error('twoFactorCodeRequired');
    }
    // In a real implementation, verify the code against SMS/TOTP
    // For now, accept any 6-digit code
    if (!/^\d{6}$/.test(params.twoFactorCode)) {
      throw new Error('invalidTwoFactorCode');
    }
  }

  // Reset failed attempts and update last access
  foundUser.failedAttempts = 0;
  foundUser.lastAccess = new Date();

  // Create session token
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + SESSION_DURATION_HOURS);
  sessions.set(token, { userId: foundUser.id, expiresAt });

  return {
    token,
    user: {
      id: foundUser.id,
      email: foundUser.email,
      twoFactorEnabled: foundUser.twoFactorEnabled,
    },
  };
}

/**
 * @summary Initiates password recovery process
 */
export async function passwordRecoveryRequest(
  params: PasswordRecoveryRequest,
  ipAddress: string
): Promise<{ token: string }> {
  // Find user by email
  let foundUser:
    | (UserEntity & {
        masterPasswordHash: string;
        securityAnswerHash: string;
        securityQuestion: string;
      })
    | undefined;
  for (const user of users.values()) {
    if (user.email === params.email) {
      foundUser = user;
      break;
    }
  }

  if (!foundUser) {
    // Return success even if email not found (security best practice)
    return { token: 'dummy-token' };
  }

  // Create recovery request
  const recoveryId = uuidv4();
  const token = uuidv4();
  const dateRequested = new Date();
  const dateExpiration = new Date();
  dateExpiration.setHours(dateExpiration.getHours() + RECOVERY_TOKEN_EXPIRY_HOURS);

  const recovery: PasswordRecoveryEntity = {
    id: recoveryId,
    userId: foundUser.id,
    token,
    dateRequested,
    dateExpiration,
    ipAddress,
    status: 'pending',
  };

  recoveryRequests.set(token, recovery);

  // In a real implementation, send email with recovery link
  // For now, just return the token
  return { token };
}

/**
 * @summary Verifies recovery token and resets password
 */
export async function passwordRecoveryVerify(
  params: PasswordRecoveryVerifyRequest
): Promise<{ success: boolean }> {
  // Find recovery request
  const recovery = recoveryRequests.get(params.token);
  if (!recovery) {
    throw new Error('invalidOrExpiredToken');
  }

  // Check if expired
  if (new Date() > recovery.dateExpiration) {
    recovery.status = 'expired';
    throw new Error('invalidOrExpiredToken');
  }

  // Check if already used
  if (recovery.status !== 'pending') {
    throw new Error('invalidOrExpiredToken');
  }

  // Find user
  const user = users.get(recovery.userId);
  if (!user) {
    throw new Error('userNotFound');
  }

  // Verify security answer
  const answerMatch = await bcrypt.compare(
    params.securityAnswer.toLowerCase(),
    user.securityAnswerHash
  );
  if (!answerMatch) {
    throw new Error('incorrectSecurityAnswer');
  }

  // Validate new master password
  validateMasterPassword(params.newMasterPassword);

  // Validate password confirmation
  if (params.newMasterPassword !== params.confirmNewMasterPassword) {
    throw new Error('passwordConfirmationMismatch');
  }

  // Verify new password is different from old
  const sameAsOld = await bcrypt.compare(params.newMasterPassword, user.masterPasswordHash);
  if (sameAsOld) {
    throw new Error('newPasswordCannotBeSameAsOld');
  }

  // Hash new password
  const newPasswordHash = await bcrypt.hash(params.newMasterPassword, BCRYPT_ROUNDS);

  // Update user
  user.masterPasswordHash = newPasswordHash;
  user.accountLocked = false;
  user.failedAttempts = 0;

  // Mark recovery as completed
  recovery.status = 'completed';

  return { success: true };
}

/**
 * @summary Validates session token
 */
export function validateSession(token: string): { userId: string } {
  const session = sessions.get(token);
  if (!session) {
    throw new Error('invalidSession');
  }

  if (new Date() > session.expiresAt) {
    sessions.delete(token);
    throw new Error('sessionExpired');
  }

  return { userId: session.userId };
}

/**
 * @summary Logs out user
 */
export function userLogout(token: string): void {
  sessions.delete(token);
}
