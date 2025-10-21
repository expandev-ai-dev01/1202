/**
 * @utility cn
 * @summary Utility for merging Tailwind CSS classes
 * @type utility-function
 * @category styling
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
