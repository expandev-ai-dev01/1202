/**
 * @summary Validation utility functions
 * @module utils/validation
 */

import { z } from 'zod';

/**
 * @summary Common Zod validation schemas
 */
export const zString = z.string().min(1, 'stringRequired');
export const zNullableString = z.string().nullable();
export const zName = z.string().min(1, 'nameRequired').max(100, 'nameMaxLength');
export const zDescription = z
  .string()
  .min(1, 'descriptionRequired')
  .max(500, 'descriptionMaxLength');
export const zNullableDescription = z.string().max(500, 'descriptionMaxLength').nullable();
export const zBit = z.number().int().min(0).max(1);
export const zFK = z.number().int().positive('idRequired');
export const zNullableFK = z.number().int().positive().nullable();
export const zDateString = z.string().datetime();

/**
 * @summary Validates required parameter
 * @function validateRequiredParam
 *
 * @param {any} param - Parameter to validate
 * @param {string} paramName - Parameter name for error message
 *
 * @throws {Error} When parameter is null or undefined
 */
export const validateRequiredParam = (param: any, paramName: string): void => {
  if (param === null || param === undefined) {
    throw new Error(`${paramName}Required`);
  }
};

/**
 * @summary Validates positive number
 * @function validatePositiveNumber
 *
 * @param {number} value - Value to validate
 * @param {string} fieldName - Field name for error message
 *
 * @throws {Error} When value is not positive
 */
export const validatePositiveNumber = (value: number, fieldName: string): void => {
  if (value <= 0) {
    throw new Error(`${fieldName}MustBePositive`);
  }
};
