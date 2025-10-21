/**
 * @api {get} /internal/password List Passwords
 * @api {post} /internal/password Create Password
 * @apiName PasswordOperations
 * @apiGroup Password
 * @apiVersion 1.0.0
 *
 * @apiDescription Manages password storage operations
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { passwordCreate, passwordList } from '@/services/password';
import { validateSession } from '@/services/user';
import { successResponse, errorResponse } from '@/utils/response';

const createBodySchema = z.object({
  title: z.string().min(1, 'titleRequired').max(100, 'titleTooLong'),
  username: z.string().max(255, 'usernameTooLong').optional(),
  password: z.string().min(1, 'passwordRequired').max(255, 'passwordTooLong'),
  url: z.string().max(2048, 'urlTooLong').optional(),
  category: z.string().optional(),
  notes: z.string().max(5000, 'notesTooLong').optional(),
  expirationDate: z.string().datetime().optional(),
  isFavorite: z.boolean().optional(),
});

export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json(errorResponse('authenticationRequired'));
      return;
    }

    const { userId } = validateSession(token);

    const passwords = passwordList(userId);

    res.json(successResponse(passwords));
  } catch (error: any) {
    if (error.message === 'invalidSession' || error.message === 'sessionExpired') {
      res.status(401).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}

export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json(errorResponse('authenticationRequired'));
      return;
    }

    const { userId } = validateSession(token);

    const validated = createBodySchema.parse(req.body);

    const result = passwordCreate({
      ...validated,
      userId,
      expirationDate: validated.expirationDate ? new Date(validated.expirationDate) : undefined,
    });

    res.status(201).json(successResponse(result));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR'));
    } else if (error.message === 'invalidSession' || error.message === 'sessionExpired') {
      res.status(401).json(errorResponse(error.message));
    } else if (
      error.message === 'titleRequired' ||
      error.message === 'titleTooLong' ||
      error.message === 'passwordRequired' ||
      error.message === 'passwordTooLong' ||
      error.message === 'usernameTooLong' ||
      error.message === 'invalidUrl' ||
      error.message === 'urlTooLong' ||
      error.message === 'notesTooLong' ||
      error.message === 'expirationDateMustBeFuture'
    ) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}
