import api from './client';
import type { RateOfReturn } from 'shared';

export async function update(earnerId: string, body: Partial<RateOfReturn>): Promise<RateOfReturn> {
  const { data } = await api.put(`/rate-of-return/earner/${earnerId}`, body);
  return data;
}
