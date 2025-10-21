import type { LoginCredentials } from '../../types';

export interface UseLoginOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export interface UseLoginReturn {
  login: (credentials: LoginCredentials) => Promise<void>;
  isLoading: boolean;
  error: any;
}
