import { Request, Response, NextFunction } from 'express';
import * as homePurchaseService from '../services/homePurchase.service.js';

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await homePurchaseService.get(req.user!.householdId);
    res.json(result);
  } catch (err) { next(err); }
}

export async function upsert(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await homePurchaseService.upsert(req.user!.householdId, req.body);
    res.json(result);
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await homePurchaseService.remove(req.user!.householdId);
    res.status(204).end();
  } catch (err) { next(err); }
}
