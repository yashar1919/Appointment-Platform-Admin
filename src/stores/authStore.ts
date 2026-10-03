import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  apiKey: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  login: (key: string, remember?: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Pre-seed with default demo admin key for immediate seamless usage
      apiKey: 'sec_venus_live_948271',
      isAuthenticated: true,
      rememberMe: true,
      login: (key: string, remember: boolean = true) => {
        set({
          apiKey: key.trim(),
          isAuthenticated: true,
          rememberMe: remember,
        });
      },
      logout: () => {
        set({
          apiKey: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'unitimely_admin_auth',
    }
  )
);
