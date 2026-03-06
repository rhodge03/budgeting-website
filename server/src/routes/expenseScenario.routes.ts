import { Router } from 'express';
import * as ctrl from '../controllers/expenseScenario.controller.js';

const router = Router();

router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.put('/:id', ctrl.rename);
router.delete('/:id', ctrl.remove);
router.post('/:id/switch', ctrl.switchTo);
router.post('/save-current', ctrl.saveCurrent);

export default router;
