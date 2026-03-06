import { Router } from 'express';
import * as homePurchaseController from '../controllers/homePurchase.controller.js';

const router = Router();

router.get('/', homePurchaseController.get);
router.put('/', homePurchaseController.upsert);
router.delete('/', homePurchaseController.remove);

export default router;
