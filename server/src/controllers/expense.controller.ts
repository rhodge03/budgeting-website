import { Request, Response, NextFunction } from 'express';
import * as expenseService from '../services/expense.service.js';

export async function listCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await expenseService.listCategories(req.user!.householdId);
    res.json(result);
  } catch (err) { next(err); }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await expenseService.createCategory(req.user!.householdId, req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await expenseService.updateCategory(req.params.id as string, req.user!.householdId, req.body);
    res.json(result);
  } catch (err) { next(err); }
}

export async function removeCategory(req: Request, res: Response, next: NextFunction) {
  try {
    await expenseService.removeCategory(req.params.id as string, req.user!.householdId);
    res.status(204).end();
  } catch (err) { next(err); }
}

export async function createSubCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await expenseService.createSubCategory(req.params.categoryId as string, req.user!.householdId, req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
}

export async function updateSubCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await expenseService.updateSubCategory(req.params.id as string, req.user!.householdId, req.body);
    res.json(result);
  } catch (err) { next(err); }
}

export async function removeSubCategory(req: Request, res: Response, next: NextFunction) {
  try {
    await expenseService.removeSubCategory(req.params.id as string, req.user!.householdId);
    res.status(204).end();
  } catch (err) { next(err); }
}
