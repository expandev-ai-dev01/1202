/**
 * @page RegisterPage
 * @summary User registration page
 * @domain auth
 * @type form-page
 * @category authentication
 */

import { RegisterForm } from '@/domain/auth/components/RegisterForm';

export const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4 py-12">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
