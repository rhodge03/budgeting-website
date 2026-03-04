import api from './client';
import type { IncomeEntry } from 'shared';

export async function listByEarner(earnerId: string): Promise<IncomeEntry[]> {
  const { data } = await api.get(`/income/earner/${earnerId}`);
  return data;
}

export async function create(earnerId: string, body: { label: string; amount: number; isTaxable?: boolean; durationYears?: number | null }): Promise<IncomeEntry> {
  const { data } = await api.post(`/income/earner/${earnerId}`, body);
  return data;
}

export async function update(id: string, body: Partial<IncomeEntry>): Promise<IncomeEntry> {
  const { data } = await api.put(`/income/${id}`, body);
  return data;
}

export async function remove(id: string): Promise<void> {
  await api.delete(`/income/${id}`);
}

export async function bulkUpsert(earnerId: string, entries: IncomeEntry[]): Promise<IncomeEntry[]> {
  const { data } = await api.put(`/income/earner/${earnerId}/bulk`, { entries });
  return data;
}
