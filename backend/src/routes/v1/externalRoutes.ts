/**
 * @summary External API routes configuration
 * @module routes/v1/externalRoutes
 */

import { Router } from 'express';
import * as registerController from '@/api/v1/external/user/register/controller';
import * as loginController from '@/api/v1/external/user/login/controller';
import * as recoveryRequestController from '@/api/v1/external/user/recovery/request/controller';
import * as recoveryVerifyController from '@/api/v1/external/user/recovery/verify/controller';

const router = Router();

// User registration and authentication
router.post('/user/register', registerController.postHandler);
router.post('/user/login', loginController.postHandler);
router.post('/user/recovery/request', recoveryRequestController.postHandler);
router.post('/user/recovery/verify', recoveryVerifyController.postHandler);

export default router;
