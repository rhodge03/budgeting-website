import { Request, Response, NextFunction } from 'express';
import * as retirementService from '../services/retirement.service.js';

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await retirementService.update(req.params.earnerId as string, req.user!.householdId, req.body);
    res.json(result);
  } catch (err) { next(err); }
}
