import { Request, Response, NextFunction } from 'express';
import * as savingsService from '../services/savings.service.js';

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await savingsService.update(req.params.earnerId as string, req.user!.householdId, req.body);
    res.json(result);
  } catch (err) { next(err); }
}
