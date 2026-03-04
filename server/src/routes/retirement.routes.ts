import { Router } from 'express';
import * as retirementController from '../controllers/retirement.controller.js';

const router = Router();

router.put('/earner/:earnerId', retirementController.update);

export default router;
