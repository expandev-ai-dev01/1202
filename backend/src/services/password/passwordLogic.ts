/**
 * @module services/password/passwordLogic
 * @summary Password storage business logic (in-memory with encryption simulation)
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  PasswordEntity,
  PasswordCreateRequest,
  PasswordUpdateRequest,
  PasswordListResponse,
} from './passwordTypes';

// In-memory storage
const passwords = new Map<string, PasswordEntity>();

const EXPIRATION_WARNING_DAYS = 7;

/**
 * @summary Simulates password encryption (in real implementation, use AES-256)
 */
function encryptPassword(password: string): string {
  // In a real implementation, use AES-256 with key derived from master password
  return Buffer.from(password).toString('base64');
}

/**
 * @summary Simulates password decryption
 */
function decryptPassword(encryptedPassword: string): string {
  // In a real implementation, decrypt using AES-256
  return Buffer.from(encryptedPassword, 'base64').toString('utf-8');
}

/**
 * @summary Creates a new password entry
 */
export function passwordCreate(params: PasswordCreateRequest): { id: string } {
  // Validate title
  if (!params.title || params.title.trim().length === 0) {
    throw new Error('titleRequired');
  }
  if (params.title.length > 100) {
    throw new Error('titleTooLong');
  }

  // Validate password
  if (!params.password || params.password.trim().length === 0) {
    throw new Error('passwordRequired');
  }
  if (params.password.length > 255) {
    throw new Error('passwordTooLong');
  }

  // Validate username
  if (params.username && params.username.length > 255) {
    throw new Error('usernameTooLong');
  }

  // Validate URL
  if (params.url) {
    try {
      new URL(params.url);
    } catch {
      throw new Error('invalidUrl');
    }
    if (params.url.length > 2048) {
      throw new Error('urlTooLong');
    }
  }

  // Validate notes
  if (params.notes && params.notes.length > 5000) {
    throw new Error('notesTooLong');
  }

  // Validate expiration date
  if (params.expirationDate && params.expirationDate <= new Date()) {
    throw new Error('expirationDateMustBeFuture');
  }

  // Create password entry
  const passwordId = uuidv4();
  const now = new Date();
  const password: PasswordEntity = {
    id: passwordId,
    userId: params.userId,
    title: params.title,
    username: params.username || null,
    password: encryptPassword(params.password),
    url: params.url || null,
    category: params.category || 'General',
    notes: params.notes || null,
    dateCreated: now,
    dateModified: now,
    expirationDate: params.expirationDate || null,
    isFavorite: params.isFavorite || false,
  };

  passwords.set(passwordId, password);

  return { id: passwordId };
}

/**
 * @summary Lists all passwords for a user
 */
export function passwordList(userId: string): PasswordListResponse[] {
  const userPasswords: PasswordListResponse[] = [];
  const now = new Date();
  const warningDate = new Date();
  warningDate.setDate(warningDate.getDate() + EXPIRATION_WARNING_DAYS);

  for (const password of passwords.values()) {
    if (password.userId === userId) {
      const isExpiringSoon =
        password.expirationDate !== null &&
        password.expirationDate <= warningDate &&
        password.expirationDate > now;

      userPasswords.push({
        id: password.id,
        title: password.title,
        username: password.username,
        url: password.url,
        category: password.category,
        dateCreated: password.dateCreated,
        dateModified: password.dateModified,
        expirationDate: password.expirationDate,
        isFavorite: password.isFavorite,
        isExpiringSoon,
      });
    }
  }

  return userPasswords;
}

/**
 * @summary Gets a specific password (decrypted)
 */
export function passwordGet(
  id: string,
  userId: string
): PasswordEntity & { decryptedPassword: string } {
  const password = passwords.get(id);
  if (!password) {
    throw new Error('passwordNotFound');
  }

  if (password.userId !== userId) {
    throw new Error('unauthorized');
  }

  return {
    ...password,
    decryptedPassword: decryptPassword(password.password),
  };
}

/**
 * @summary Updates a password entry
 */
export function passwordUpdate(params: PasswordUpdateRequest): { success: boolean } {
  const password = passwords.get(params.id);
  if (!password) {
    throw new Error('passwordNotFound');
  }

  if (password.userId !== params.userId) {
    throw new Error('unauthorized');
  }

  // Validate and update fields
  if (params.title !== undefined) {
    if (!params.title || params.title.trim().length === 0) {
      throw new Error('titleRequired');
    }
    if (params.title.length > 100) {
      throw new Error('titleTooLong');
    }
    password.title = params.title;
  }

  if (params.username !== undefined) {
    if (params.username && params.username.length > 255) {
      throw new Error('usernameTooLong');
    }
    password.username = params.username || null;
  }

  if (params.password !== undefined) {
    if (!params.password || params.password.trim().length === 0) {
      throw new Error('passwordRequired');
    }
    if (params.password.length > 255) {
      throw new Error('passwordTooLong');
    }
    password.password = encryptPassword(params.password);
  }

  if (params.url !== undefined) {
    if (params.url) {
      try {
        new URL(params.url);
      } catch {
        throw new Error('invalidUrl');
      }
      if (params.url.length > 2048) {
        throw new Error('urlTooLong');
      }
    }
    password.url = params.url || null;
  }

  if (params.category !== undefined) {
    password.category = params.category || 'General';
  }

  if (params.notes !== undefined) {
    if (params.notes && params.notes.length > 5000) {
      throw new Error('notesTooLong');
    }
    password.notes = params.notes || null;
  }

  if (params.expirationDate !== undefined) {
    if (params.expirationDate && params.expirationDate <= new Date()) {
      throw new Error('expirationDateMustBeFuture');
    }
    password.expirationDate = params.expirationDate || null;
  }

  if (params.isFavorite !== undefined) {
    password.isFavorite = params.isFavorite;
  }

  password.dateModified = new Date();

  return { success: true };
}

/**
 * @summary Deletes a password entry
 */
export function passwordDelete(id: string, userId: string): { success: boolean } {
  const password = passwords.get(id);
  if (!password) {
    throw new Error('passwordNotFound');
  }

  if (password.userId !== userId) {
    throw new Error('unauthorized');
  }

  passwords.delete(id);

  return { success: true };
}
