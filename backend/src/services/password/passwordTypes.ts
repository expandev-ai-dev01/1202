/**
 * @module services/password/passwordTypes
 * @summary Type definitions for password storage
 */

export interface PasswordEntity {
  id: string;
  userId: string;
  title: string;
  username: string | null;
  password: string;
  url: string | null;
  category: string;
  notes: string | null;
  dateCreated: Date;
  dateModified: Date;
  expirationDate: Date | null;
  isFavorite: boolean;
}

export interface PasswordCreateRequest {
  userId: string;
  title: string;
  username?: string;
  password: string;
  url?: string;
  category?: string;
  notes?: string;
  expirationDate?: Date;
  isFavorite?: boolean;
}

export interface PasswordUpdateRequest {
  id: string;
  userId: string;
  title?: string;
  username?: string;
  password?: string;
  url?: string;
  category?: string;
  notes?: string;
  expirationDate?: Date;
  isFavorite?: boolean;
}

export interface PasswordListResponse {
  id: string;
  title: string;
  username: string | null;
  url: string | null;
  category: string;
  dateCreated: Date;
  dateModified: Date;
  expirationDate: Date | null;
  isFavorite: boolean;
  isExpiringSoon: boolean;
}
