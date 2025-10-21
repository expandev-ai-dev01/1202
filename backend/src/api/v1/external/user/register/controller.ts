/**
 * @api {post} /external/user/register Register User
 * @apiName RegisterUser
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new user account with master password and security settings
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { userCreate } from '@/services/user';
import { successResponse, errorResponse } from '@/utils/response';

const bodySchema = z.object({
  email: z.string().email('invalidEmailFormat').max(255, 'emailTooLong'),
  masterPassword: z.string().min(12, 'masterPasswordTooShort'),
  confirmMasterPassword: z.string(),
  securityQuestion: z.string().min(1, 'securityQuestionRequired'),
  securityAnswer: z.string().min(3, 'securityAnswerTooShort').max(100, 'securityAnswerTooLong'),
  twoFactorEnabled: z.boolean().default(false),
  phone: z.string().optional(),
  inactivityTimeout: z.number().int().min(1).max(60).default(15),
});

export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = bodySchema.parse(req.body);

    const result = await userCreate(validated);

    res.status(201).json(successResponse(result));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR'));
    } else if (
      error.message === 'invalidEmailFormat' ||
      error.message === 'emailAlreadyExists' ||
      error.message === 'masterPasswordTooShort' ||
      error.message === 'masterPasswordMissingUppercase' ||
      error.message === 'masterPasswordMissingLowercase' ||
      error.message === 'masterPasswordMissingNumber' ||
      error.message === 'masterPasswordMissingSpecialChar' ||
      error.message === 'masterPasswordTooObvious' ||
      error.message === 'passwordConfirmationMismatch' ||
      error.message === 'masterPasswordCannotBeEmail' ||
      error.message === 'securityQuestionRequired' ||
      error.message === 'securityAnswerTooShort' ||
      error.message === 'securityAnswerTooLong' ||
      error.message === 'phoneRequiredForTwoFactor' ||
      error.message === 'invalidPhoneFormat' ||
      error.message === 'invalidInactivityTimeout'
    ) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}
