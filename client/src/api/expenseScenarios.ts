import api from './client';
import type { ExpenseScenario, Household, ExpenseCategory, HomePurchase } from 'shared';

export async function list(): Promise<ExpenseScenario[]> {
  const { data } = await api.get('/expense-scenarios');
  return data;
}

export async function create(body: { name: string }): Promise<ExpenseScenario> {
  const { data } = await api.post('/expense-scenarios', body);
  return data;
}

export async function rename(id: string, name: string): Promise<ExpenseScenario> {
  const { data } = await api.put(`/expense-scenarios/${id}`, { name });
  return data;
}

export async function remove(id: string): Promise<void> {
  await api.delete(`/expense-scenarios/${id}`);
}

export async function switchTo(id: string): Promise<{
  household: Household;
  expenseCategories: ExpenseCategory[];
  expenseScenarios: ExpenseScenario[];
  homePurchase: HomePurchase | null;
}> {
  const { data } = await api.post(`/expense-scenarios/${id}/switch`);
  return data;
}

export async function saveCurrent(): Promise<ExpenseScenario | null> {
  const { data } = await api.post('/expense-scenarios/save-current');
  return data;
}
