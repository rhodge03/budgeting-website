import { Request, Response, NextFunction } from 'express';
import * as rateOfReturnService from '../services/rateOfReturn.service.js';

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await rateOfReturnService.update(req.params.earnerId as string, req.user!.householdId, req.body);
    res.json(result);
  } catch (err) { next(err); }
}
