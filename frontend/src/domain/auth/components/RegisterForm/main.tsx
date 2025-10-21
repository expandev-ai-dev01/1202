/**
 * @component RegisterForm
 * @summary Registration form with validation and security settings
 * @domain auth
 * @type domain-component
 * @category form
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useRegister } from '../../hooks/useRegister';
import type { RegisterFormProps } from './types';

const registerSchema = z
  .object({
    email: z.string().email('Invalid email format').max(255, 'Email too long'),
    masterPassword: z
      .string()
      .min(12, 'Master password must be at least 12 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    confirmMasterPassword: z.string(),
    securityQuestion: z.string().min(1, 'Security question is required'),
    securityAnswer: z
      .string()
      .min(3, 'Answer must be at least 3 characters')
      .max(100, 'Answer too long'),
    twoFactorEnabled: z.boolean(),
    phone: z.string().optional(),
    inactivityTimeout: z.number().int().min(1).max(60),
  })
  .refine((data) => data.masterPassword === data.confirmMasterPassword, {
    message: 'Passwords do not match',
    path: ['confirmMasterPassword'],
  })
  .refine((data) => !data.twoFactorEnabled || (data.phone && data.phone.length > 0), {
    message: 'Phone number is required when two-factor authentication is enabled',
    path: ['phone'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const SECURITY_QUESTIONS = [
  'What was your childhood nickname?',
  'What is the name of your first pet?',
  'What was the name of your first school?',
  "What is your mother's maiden name?",
  'What city were you born in?',
];

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading, error } = useRegister({ onSuccess });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      twoFactorEnabled: false,
      inactivityTimeout: 15,
    },
  });

  const masterPassword = watch('masterPassword');
  const twoFactorEnabled = watch('twoFactorEnabled');

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 4) return { strength, label: 'Medium', color: 'bg-yellow-500' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(masterPassword);

  const onSubmit = async (data: RegisterFormData) => {
    await registerUser(data);
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Set up your secure password vault</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="your@email.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label
              htmlFor="masterPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Master Password *
            </label>
            <div className="relative">
              <input
                {...register('masterPassword')}
                type={showPassword ? 'text' : 'password'}
                id="masterPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Create a strong master password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {masterPassword && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {passwordStrength.label}
                  </span>
                </div>
              </div>
            )}
            {errors.masterPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.masterPassword.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmMasterPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Master Password *
            </label>
            <div className="relative">
              <input
                {...register('confirmMasterPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmMasterPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Confirm your master password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmMasterPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmMasterPassword.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="securityQuestion"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Security Question *
            </label>
            <select
              {...register('securityQuestion')}
              id="securityQuestion"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a security question</option>
              {SECURITY_QUESTIONS.map((question) => (
                <option key={question} value={question}>
                  {question}
                </option>
              ))}
            </select>
            {errors.securityQuestion && (
              <p className="mt-1 text-sm text-red-600">{errors.securityQuestion.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="securityAnswer"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Security Answer *
            </label>
            <input
              {...register('securityAnswer')}
              type="text"
              id="securityAnswer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Your answer"
            />
            {errors.securityAnswer && (
              <p className="mt-1 text-sm text-red-600">{errors.securityAnswer.message}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              {...register('twoFactorEnabled')}
              type="checkbox"
              id="twoFactorEnabled"
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="twoFactorEnabled" className="ml-2 text-sm text-gray-700">
              Enable two-factor authentication
            </label>
          </div>

          {twoFactorEnabled && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                {...register('phone')}
                type="tel"
                id="phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
            </div>
          )}

          <div>
            <label
              htmlFor="inactivityTimeout"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Inactivity Timeout (minutes): {watch('inactivityTimeout')}
            </label>
            <input
              {...register('inactivityTimeout', { valueAsNumber: true })}
              type="range"
              id="inactivityTimeout"
              min="1"
              max="60"
              className="w-full"
            />
            {errors.inactivityTimeout && (
              <p className="mt-1 text-sm text-red-600">{errors.inactivityTimeout.message}</p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {error?.response?.data?.message || 'Registration failed. Please try again.'}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
