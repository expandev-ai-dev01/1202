/**
 * @api {get} /internal/password/:id Get Password
 * @api {put} /internal/password/:id Update Password
 * @api {delete} /internal/password/:id Delete Password
 * @apiName PasswordDetailOperations
 * @apiGroup Password
 * @apiVersion 1.0.0
 *
 * @apiDescription Manages individual password operations
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { passwordGet, passwordUpdate, passwordDelete } from '@/services/password';
import { validateSession } from '@/services/user';
import { successResponse, errorResponse } from '@/utils/response';

const paramsSchema = z.object({
  id: z.string().uuid('invalidPasswordId'),
});

const updateBodySchema = z.object({
  title: z.string().min(1, 'titleRequired').max(100, 'titleTooLong').optional(),
  username: z.string().max(255, 'usernameTooLong').optional(),
  password: z.string().min(1, 'passwordRequired').max(255, 'passwordTooLong').optional(),
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
    const { id } = paramsSchema.parse(req.params);

    const password = passwordGet(id, userId);

    res.json(successResponse(password));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR'));
    } else if (error.message === 'invalidSession' || error.message === 'sessionExpired') {
      res.status(401).json(errorResponse(error.message));
    } else if (error.message === 'passwordNotFound') {
      res.status(404).json(errorResponse(error.message));
    } else if (error.message === 'unauthorized') {
      res.status(403).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}

export async function putHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json(errorResponse('authenticationRequired'));
      return;
    }

    const { userId } = validateSession(token);
    const { id } = paramsSchema.parse(req.params);
    const validated = updateBodySchema.parse(req.body);

    const result = passwordUpdate({
      ...validated,
      id,
      userId,
      expirationDate: validated.expirationDate ? new Date(validated.expirationDate) : undefined,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR'));
    } else if (error.message === 'invalidSession' || error.message === 'sessionExpired') {
      res.status(401).json(errorResponse(error.message));
    } else if (error.message === 'passwordNotFound') {
      res.status(404).json(errorResponse(error.message));
    } else if (error.message === 'unauthorized') {
      res.status(403).json(errorResponse(error.message));
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

export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json(errorResponse('authenticationRequired'));
      return;
    }

    const { userId } = validateSession(token);
    const { id } = paramsSchema.parse(req.params);

    const result = passwordDelete(id, userId);

    res.json(successResponse(result));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR'));
    } else if (error.message === 'invalidSession' || error.message === 'sessionExpired') {
      res.status(401).json(errorResponse(error.message));
    } else if (error.message === 'passwordNotFound') {
      res.status(404).json(errorResponse(error.message));
    } else if (error.message === 'unauthorized') {
      res.status(403).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}
