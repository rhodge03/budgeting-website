import api from './client';
import type { HouseholdSnapshot } from 'shared';

export async function getSnapshot(): Promise<HouseholdSnapshot> {
  const { data } = await api.get('/household/snapshot');
  return data;
}
