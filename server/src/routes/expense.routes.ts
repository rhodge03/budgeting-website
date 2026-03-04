import { Router } from 'express';
import * as expenseController from '../controllers/expense.controller.js';

const router = Router();

// Categories
router.get('/', expenseController.listCategories);
router.post('/', expenseController.createCategory);
router.put('/:id', expenseController.updateCategory);
router.delete('/:id', expenseController.removeCategory);

// Sub-categories
router.post('/:categoryId/sub', expenseController.createSubCategory);
router.put('/sub/:id', expenseController.updateSubCategory);
router.delete('/sub/:id', expenseController.removeSubCategory);

export default router;
