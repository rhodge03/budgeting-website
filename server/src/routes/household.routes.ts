import { Router } from 'express';
import * as householdController from '../controllers/household.controller.js';

const router = Router();

router.get('/snapshot', householdController.getSnapshot);
router.put('/', householdController.updateHousehold);

export default router;
