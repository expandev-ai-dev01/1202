/**
 * @component ErrorMessage
 * @summary Error message display component
 * @domain core
 * @type ui-component
 * @category feedback
 */

import { cn } from '@/core/utils';
import type { ErrorMessageProps } from './types';

export const ErrorMessage = ({ title, message, onRetry, onBack, className }: ErrorMessageProps) => {
  return (
    <div className={cn('flex items-center justify-center min-h-[400px]', className)}>
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-center text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-center text-gray-600">{message}</p>
        <div className="mt-6 flex gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
              Go Back
            </button>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
