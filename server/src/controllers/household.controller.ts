import { Request, Response, NextFunction } from 'express';
import * as householdService from '../services/household.service.js';

export async function getSnapshot(req: Request, res: Response, next: NextFunction) {
  try {
    const snapshot = await householdService.getSnapshot(req.user!.householdId);
    res.json(snapshot);
  } catch (err) { next(err); }
}

export async function updateHousehold(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await householdService.updateHousehold(req.user!.householdId, req.body);
    res.json(result);
  } catch (err) { next(err); }
}
