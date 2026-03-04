import api from './client';
import type { RetirementSettings } from 'shared';

export async function update(earnerId: string, body: Partial<RetirementSettings>): Promise<RetirementSettings> {
  const { data } = await api.put(`/retirement/earner/${earnerId}`, body);
  return data;
}
