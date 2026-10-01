import { Injectable, signal, computed } from '@angular/core';
import { User, AuthState } from '../models';
import { MOCK_USER } from '../mock/mock-data';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _state = signal<AuthState>({
    user: MOCK_USER,
    token: 'mock-jwt-token',
    isAuthenticated: true,
  });

  readonly user = computed(() => this._state().user);
  readonly isAuthenticated = computed(() => this._state().isAuthenticated);
  readonly currentRole = computed(() => this._state().user?.role ?? null);

  login(email: string, password: string): boolean {
    this._state.set({ user: MOCK_USER, token: 'mock-jwt-token', isAuthenticated: true });
    return true;
  }

  logout(): void {
    this._state.set({ user: null, token: null, isAuthenticated: false });
  }
}
