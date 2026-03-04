import api from './client';
import type { ExpenseCategory, ExpenseSubCategory } from 'shared';

// Categories
export async function list(): Promise<ExpenseCategory[]> {
  const { data } = await api.get('/expenses');
  return data;
}

export async function createCategory(body: { name: string }): Promise<ExpenseCategory> {
  const { data } = await api.post('/expenses', body);
  return data;
}

export async function updateCategory(id: string, body: Partial<ExpenseCategory>): Promise<ExpenseCategory> {
  const { data } = await api.put(`/expenses/${id}`, body);
  return data;
}

export async function removeCategory(id: string): Promise<void> {
  await api.delete(`/expenses/${id}`);
}

// Sub-categories
export async function createSubCategory(categoryId: string, body: { name: string }): Promise<ExpenseSubCategory> {
  const { data } = await api.post(`/expenses/${categoryId}/sub`, body);
  return data;
}

export async function updateSubCategory(id: string, body: Partial<ExpenseSubCategory>): Promise<ExpenseSubCategory> {
  const { data } = await api.put(`/expenses/sub/${id}`, body);
  return data;
}

export async function removeSubCategory(id: string): Promise<void> {
  await api.delete(`/expenses/sub/${id}`);
}
