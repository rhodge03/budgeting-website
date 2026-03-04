import { create } from 'zustand';
import * as authApi from '../api/auth';

interface AuthUser {
  id: string;
  email: string;
  householdId: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, householdName?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const result = await authApi.login(email, password);
    localStorage.setItem('accessToken', result.accessToken);
    set({ user: result.user, isAuthenticated: true });
  },

  signup: async (email, password, householdName) => {
    const result = await authApi.signup(email, password, householdName);
    localStorage.setItem('accessToken', result.accessToken);
    set({ user: result.user, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const me = await authApi.getMe();
      set({ user: { id: me.id, email: me.email, householdId: me.householdId }, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
