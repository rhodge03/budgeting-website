import { Router } from 'express';
import * as savingsController from '../controllers/savings.controller.js';

const router = Router();

router.put('/earner/:earnerId', savingsController.update);

export default router;
