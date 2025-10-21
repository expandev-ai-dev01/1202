/**
 * @module auth
 * @summary Module manifest for the authentication domain.
 * @domain security
 * @version 1.0.0
 */
export const moduleManifest = {
  name: 'auth',
  domain: 'security',
  version: '1.0.0',
  publicComponents: ['LoginForm', 'RegisterForm', 'RecoveryRequestForm', 'RecoveryVerifyForm'],
  publicHooks: ['useAuth', 'useLogin', 'useRegister', 'useRecovery'],
  publicServices: ['authService'],
  publicStores: ['authStore'],
  dependencies: {
    internal: ['@/core/lib/api', '@/core/components', '@/core/utils'],
    external: ['react', 'react-hook-form', 'zod', '@tanstack/react-query', 'zustand'],
    domains: [],
  },
  exports: {
    components: ['LoginForm', 'RegisterForm', 'RecoveryRequestForm', 'RecoveryVerifyForm'],
    hooks: ['useAuth', 'useLogin', 'useRegister', 'useRecovery'],
    services: ['authService'],
    stores: ['authStore'],
    types: ['User', 'LoginCredentials', 'RegisterData', 'RecoveryRequest', 'RecoveryVerify'],
    utils: [],
  },
} as const;
