/**
 * @summary Internal API routes configuration
 * @module routes/v1/internalRoutes
 */

import { Router } from 'express';
import * as passwordController from '@/api/v1/internal/password/controller';
import * as passwordDetailController from '@/api/v1/internal/password/detail/controller';

const router = Router();

// Password management
router.get('/password', passwordController.getHandler);
router.post('/password', passwordController.postHandler);
router.get('/password/:id', passwordDetailController.getHandler);
router.put('/password/:id', passwordDetailController.putHandler);
router.delete('/password/:id', passwordDetailController.deleteHandler);

export default router;
