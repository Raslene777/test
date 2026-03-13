import { signal } from '@angular/core';

export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  role: string | null;
}

export const authState = signal<AuthState>({
  isAuthenticated: false,
  userId: null,
  role: null
});
