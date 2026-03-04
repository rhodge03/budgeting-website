import { Request, Response, NextFunction } from 'express';
import * as householdService from '../services/household.service.js';

export async function getSnapshot(req: Request, res: Response, next: NextFunction) {
  try {
    const snapshot = await householdService.getSnapshot(req.user!.householdId);
    res.json(snapshot);
  } catch (err) { next(err); }
}
