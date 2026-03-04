import api from './client';
import type { Earner } from 'shared';

export async function create(name: string): Promise<Earner> {
  const { data } = await api.post('/earners', { name });
  return data;
}

export async function update(id: string, body: Partial<Earner>): Promise<Earner> {
  const { data } = await api.put(`/earners/${id}`, body);
  return data;
}

export async function archive(id: string): Promise<Earner> {
  const { data } = await api.patch(`/earners/${id}/archive`);
  return data;
}

export async function remove(id: string): Promise<void> {
  await api.delete(`/earners/${id}`);
}

export async function setPrimary(id: string): Promise<Earner> {
  const { data } = await api.patch(`/earners/${id}/primary`);
  return data;
}
