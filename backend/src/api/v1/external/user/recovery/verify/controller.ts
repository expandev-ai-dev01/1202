/**
 * @api {post} /external/user/recovery/verify Verify Password Recovery
 * @apiName VerifyPasswordRecovery
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiDescription Verifies recovery token and resets password
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { passwordRecoveryVerify } from '@/services/user';
import { successResponse, errorResponse } from '@/utils/response';

const bodySchema = z.object({
  token: z.string().min(1, 'tokenRequired'),
  securityAnswer: z.string().min(1, 'securityAnswerRequired'),
  newMasterPassword: z.string().min(12, 'masterPasswordTooShort'),
  confirmNewMasterPassword: z.string(),
});

export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = bodySchema.parse(req.body);

    const result = await passwordRecoveryVerify(validated);

    res.json(successResponse(result));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR'));
    } else if (
      error.message === 'invalidOrExpiredToken' ||
      error.message === 'incorrectSecurityAnswer' ||
      error.message === 'userNotFound' ||
      error.message === 'masterPasswordTooShort' ||
      error.message === 'masterPasswordMissingUppercase' ||
      error.message === 'masterPasswordMissingLowercase' ||
      error.message === 'masterPasswordMissingNumber' ||
      error.message === 'masterPasswordMissingSpecialChar' ||
      error.message === 'masterPasswordTooObvious' ||
      error.message === 'passwordConfirmationMismatch' ||
      error.message === 'newPasswordCannotBeSameAsOld'
    ) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}
