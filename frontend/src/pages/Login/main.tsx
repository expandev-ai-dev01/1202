/**
 * @page LoginPage
 * @summary User login page
 * @domain auth
 * @type form-page
 * @category authentication
 */

import { LoginForm } from '@/domain/auth/components/LoginForm';

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
