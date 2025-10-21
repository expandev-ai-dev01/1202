/**
 * @service authService
 * @summary Provides methods for all authentication-related backend operations using REST.
 * @domain auth
 * @type rest-service
 */

import { publicClient, authenticatedClient } from '@/core/lib/api';
import type {
  LoginCredentials,
  RegisterData,
  RecoveryRequest,
  RecoveryVerify,
  AuthResponse,
  User,
} from '../types';

export const authService = {
  /**
   * @endpoint POST /user/register
   * @summary Creates a new user account
   * @param {RegisterData} data - Registration data
   * @returns {Promise<AuthResponse>} Authentication response with token
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await publicClient.post('/user/register', data);
    return response.data.data;
  },

  /**
   * @endpoint POST /user/login
   * @summary Authenticates user and returns session token
   * @param {LoginCredentials} credentials - Login credentials
   * @returns {Promise<AuthResponse>} Authentication response with token
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await publicClient.post('/user/login', credentials);
    return response.data.data;
  },

  /**
   * @endpoint POST /user/recovery/request
   * @summary Initiates password recovery process
   * @param {RecoveryRequest} data - Recovery request data
   * @returns {Promise<{ message: string }>} Confirmation message
   */
  async requestRecovery(data: RecoveryRequest): Promise<{ message: string }> {
    const response = await publicClient.post('/user/recovery/request', data);
    return response.data.data;
  },

  /**
   * @endpoint POST /user/recovery/verify
   * @summary Verifies recovery token and resets password
   * @param {RecoveryVerify} data - Recovery verification data
   * @returns {Promise<AuthResponse>} Authentication response with new token
   */
  async verifyRecovery(data: RecoveryVerify): Promise<AuthResponse> {
    const response = await publicClient.post('/user/recovery/verify', data);
    return response.data.data;
  },

  /**
   * @endpoint GET /user/profile
   * @summary Gets current user profile
   * @returns {Promise<User>} User profile data
   */
  async getProfile(): Promise<User> {
    const response = await authenticatedClient.get('/user/profile');
    return response.data.data;
  },
};
