import { Request, Response, NextFunction } from 'express';
import * as scenarioService from '../services/expenseScenario.service.js';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await scenarioService.list(req.user!.householdId);
    res.json(result);
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await scenarioService.create(req.user!.householdId, req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
}

export async function rename(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await scenarioService.rename(req.params.id as string, req.user!.householdId, req.body.name);
    res.json(result);
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await scenarioService.remove(req.params.id as string, req.user!.householdId);
    res.status(204).end();
  } catch (err) { next(err); }
}

export async function switchTo(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await scenarioService.switchTo(req.params.id as string, req.user!.householdId);
    res.json(result);
  } catch (err) { next(err); }
}

export async function saveCurrent(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await scenarioService.saveCurrent(req.user!.householdId);
    res.json(result ?? { ok: true });
  } catch (err) { next(err); }
}
