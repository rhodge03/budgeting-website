import { Router } from 'express';
import authRoutes from './auth.routes.js';
import earnersRoutes from './earners.routes.js';
import householdRoutes from './household.routes.js';
import incomeRoutes from './income.routes.js';
import savingsRoutes from './savings.routes.js';
import retirementRoutes from './retirement.routes.js';
import rateOfReturnRoutes from './rateOfReturn.routes.js';
import expenseRoutes from './expense.routes.js';
import expenseScenarioRoutes from './expenseScenario.routes.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/earners', authenticate, earnersRoutes);
router.use('/household', authenticate, householdRoutes);
router.use('/income', authenticate, incomeRoutes);
router.use('/savings', authenticate, savingsRoutes);
router.use('/retirement', authenticate, retirementRoutes);
router.use('/rate-of-return', authenticate, rateOfReturnRoutes);
router.use('/expenses', authenticate, expenseRoutes);
router.use('/expense-scenarios', authenticate, expenseScenarioRoutes);

export default router;
