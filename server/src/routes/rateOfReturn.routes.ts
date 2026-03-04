import { Router } from 'express';
import * as rateOfReturnController from '../controllers/rateOfReturn.controller.js';

const router = Router();

router.put('/earner/:earnerId', rateOfReturnController.update);

export default router;
