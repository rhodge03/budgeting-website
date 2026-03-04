import { Router } from 'express';
import * as incomeController from '../controllers/income.controller.js';

const router = Router();

router.get('/earner/:earnerId', incomeController.list);
router.post('/earner/:earnerId', incomeController.create);
router.put('/earner/:earnerId/bulk', incomeController.bulkUpsert);
router.put('/:id', incomeController.update);
router.delete('/:id', incomeController.remove);

export default router;
