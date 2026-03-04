import api from './client';
import type { HouseholdSnapshot, Household } from 'shared';

export async function getSnapshot(): Promise<HouseholdSnapshot> {
  const { data } = await api.get('/household/snapshot');
  return data;
}

export async function update(body: Partial<Household>): Promise<Household> {
  const { data } = await api.put('/household', body);
  return data;
}
