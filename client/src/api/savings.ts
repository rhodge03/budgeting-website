import api from './client';
import type { SavingsBalance } from 'shared';

export async function update(earnerId: string, body: Partial<SavingsBalance>): Promise<SavingsBalance> {
  const { data } = await api.put(`/savings/earner/${earnerId}`, body);
  return data;
}
