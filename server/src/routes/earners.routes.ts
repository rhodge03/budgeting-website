import { Router } from 'express';
import * as earnersController from '../controllers/earners.controller.js';

const router = Router();

router.get('/', earnersController.list);
router.post('/', earnersController.create);
router.put('/:id', earnersController.update);
router.patch('/:id/archive', earnersController.archive);
router.delete('/:id', earnersController.remove);
router.patch('/:id/primary', earnersController.setPrimary);

export default router;
