import { Request, Response, NextFunction } from 'express';
import * as earnersService from '../services/earners.service.js';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const includeArchived = req.query.includeArchived === 'true';
    const earners = await earnersService.list(req.user!.householdId, includeArchived);
    res.json(earners);
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const earner = await earnersService.create(req.user!.householdId, req.body.name, req.body.memberType);
    res.status(201).json(earner);
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const earner = await earnersService.update(req.params.id as string, req.user!.householdId, req.body);
    res.json(earner);
  } catch (err) { next(err); }
}

export async function archive(req: Request, res: Response, next: NextFunction) {
  try {
    const earner = await earnersService.archive(req.params.id as string, req.user!.householdId);
    res.json(earner);
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await earnersService.remove(req.params.id as string, req.user!.householdId);
    res.status(204).end();
  } catch (err) { next(err); }
}

export async function setPrimary(req: Request, res: Response, next: NextFunction) {
  try {
    const earner = await earnersService.setPrimary(req.params.id as string, req.user!.householdId);
    res.json(earner);
  } catch (err) { next(err); }
}
