/**
 * @summary V1 API router configuration
 * @module routes/v1
 */

import { Router } from 'express';
import externalRoutes from './externalRoutes';
import internalRoutes from './internalRoutes';

const router = Router();

/**
 * @summary External (public) routes
 */
router.use('/external', externalRoutes);

/**
 * @summary Internal (authenticated) routes
 */
router.use('/internal', internalRoutes);

export default router;
