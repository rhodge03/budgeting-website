import { Request, Response, NextFunction } from 'express';
import * as incomeService from '../services/income.service.js';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const entries = await incomeService.listByEarner(req.params.earnerId as string, req.user!.householdId);
    res.json(entries);
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const entry = await incomeService.create(req.params.earnerId as string, req.user!.householdId, req.body);
    res.status(201).json(entry);
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const entry = await incomeService.update(req.params.id as string, req.user!.householdId, req.body);
    res.json(entry);
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await incomeService.remove(req.params.id as string, req.user!.householdId);
    res.status(204).end();
  } catch (err) { next(err); }
}

export async function bulkUpsert(req: Request, res: Response, next: NextFunction) {
  try {
    const entries = await incomeService.bulkUpsert(
      req.params.earnerId as string,
      req.user!.householdId,
      req.body.entries,
    );
    res.json(entries);
  } catch (err) { next(err); }
}
