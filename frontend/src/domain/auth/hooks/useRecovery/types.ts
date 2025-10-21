import type { RecoveryRequest, RecoveryVerify } from '../../types';

export interface UseRecoveryOptions {
  onRequestSuccess?: () => void;
  onVerifySuccess?: () => void;
  onError?: (error: any) => void;
}

export interface UseRecoveryReturn {
  requestRecovery: (data: RecoveryRequest) => Promise<void>;
  verifyRecovery: (data: RecoveryVerify) => Promise<void>;
  isRequestLoading: boolean;
  isVerifyLoading: boolean;
  requestError: any;
  verifyError: any;
}
