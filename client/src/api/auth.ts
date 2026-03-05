import api from './client';

interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    householdId: string;
  };
}

interface MeResponse {
  id: string;
  email: string;
  householdId: string;
  household: {
    id: string;
    name: string;
  };
}

export async function signup(email: string, password: string, householdName?: string, guestSnapshot?: any): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/signup', { email, password, householdName, guestSnapshot });
  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
}

export async function getMe(): Promise<MeResponse> {
  const { data } = await api.get<MeResponse>('/auth/me');
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}
