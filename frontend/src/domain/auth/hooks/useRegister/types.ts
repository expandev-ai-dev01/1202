import type { RegisterData } from '../../types';

export interface UseRegisterOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export interface UseRegisterReturn {
  register: (data: RegisterData) => Promise<void>;
  isLoading: boolean;
  error: any;
}
