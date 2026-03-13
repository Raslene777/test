import { signal } from '@angular/core';

export interface AppState {
  isLoading: boolean;
  error: string | null;
  theme: 'dark' | 'light';
}

export const appState = signal<AppState>({
  isLoading: false,
  error: null,
  theme: 'dark'
});
