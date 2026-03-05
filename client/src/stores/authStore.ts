import { create } from 'zustand';
import * as authApi from '../api/auth';
import * as guestStorage from '../services/guestStorage';

interface AuthUser {
  id: string;
  email: string;
  householdId: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, householdName?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  enterGuestMode: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: true,

  login: async (email, password) => {
    const wasGuest = get().isGuest;
    const result = await authApi.login(email, password);
    localStorage.setItem('accessToken', result.accessToken);
    if (wasGuest) guestStorage.clearGuestData();
    set({ user: result.user, isAuthenticated: true, isGuest: false });
  },

  signup: async (email, password, householdName) => {
    const wasGuest = get().isGuest;
    const guestSnapshot = wasGuest ? guestStorage.getSnapshot() : undefined;

    const result = await authApi.signup(email, password, householdName, guestSnapshot);
    localStorage.setItem('accessToken', result.accessToken);
    if (wasGuest) guestStorage.clearGuestData();
    set({ user: result.user, isAuthenticated: true, isGuest: false });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false, isGuest: false });
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

  enterGuestMode: () => {
    if (!guestStorage.hasGuestData()) {
      guestStorage.initializeGuest();
    }
    set({ isGuest: true, isAuthenticated: false, isLoading: false });
  },
}));
