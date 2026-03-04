import { Router } from 'express';
import * as householdController from '../controllers/household.controller.js';

const router = Router();

router.get('/snapshot', householdController.getSnapshot);

export default router;
