/**
 * @api {post} /external/user/login Login User
 * @apiName LoginUser
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiDescription Authenticates user and returns session token
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { userLogin } from '@/services/user';
import { successResponse, errorResponse } from '@/utils/response';

const bodySchema = z.object({
  email: z.string().email('invalidEmailFormat'),
  masterPassword: z.string().min(1, 'masterPasswordRequired'),
  twoFactorCode: z.string().optional(),
});

export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = bodySchema.parse(req.body);

    const result = await userLogin(validated);

    res.json(successResponse(result));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR'));
    } else if (
      error.message === 'invalidCredentials' ||
      error.message === 'accountLocked' ||
      error.message === 'twoFactorCodeRequired' ||
      error.message === 'invalidTwoFactorCode'
    ) {
      res.status(401).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}
