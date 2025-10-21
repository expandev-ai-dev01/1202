/**
 * @api {post} /external/user/recovery/request Request Password Recovery
 * @apiName RequestPasswordRecovery
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiDescription Initiates password recovery process
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { passwordRecoveryRequest } from '@/services/user';
import { successResponse, errorResponse } from '@/utils/response';

const bodySchema = z.object({
  email: z.string().email('invalidEmailFormat'),
});

export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = bodySchema.parse(req.body);
    const ipAddress = req.ip || 'unknown';

    const result = await passwordRecoveryRequest(validated, ipAddress);

    res.json(successResponse({ message: 'If the email exists, a recovery link has been sent' }));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR'));
    } else {
      next(error);
    }
  }
}
