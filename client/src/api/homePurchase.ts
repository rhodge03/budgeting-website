import api from './client';
import type { HomePurchase } from 'shared';

export async function get(): Promise<HomePurchase | null> {
  const { data } = await api.get('/home-purchase');
  return data;
}

export async function upsert(body: Omit<HomePurchase, 'id' | 'householdId'>): Promise<HomePurchase> {
  const { data } = await api.put('/home-purchase', body);
  return data;
}

export async function remove(): Promise<void> {
  await api.delete('/home-purchase');
}
