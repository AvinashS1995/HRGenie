import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, AuthState, UserRole } from '../models';

// ─── Demo accounts (in real app these live in the DB) ─────────────────────
export interface HRUser {
  id: string;
  name: string;
  email: string;
  password: string;   // plain text only for demo — never do this in production
  role: UserRole;
  department: string;
  status: 'Active' | 'Inactive';
  createdOn: string;
  avatar?: string;
}

export const DEMO_USERS: HRUser[] = [
  {
    id: 'u1',
    name: 'Avinash Suryawanshi',
    email: 'admin@hrgenie.com',
    password: 'Admin@123',
    role: 'HR Admin',
    department: 'Human Resources',
    status: 'Active',
    createdOn: '01 Jan 2026',
  },
  {
    id: 'u2',
    name: 'Priya Sharma',
    email: 'hr@hrgenie.com',
    password: 'HR@123',
    role: 'HR Manager',
    department: 'Human Resources',
    status: 'Active',
    createdOn: '15 Mar 2026',
  },
  {
    id: 'u3',
    name: 'Rajesh Kumar',
    email: 'approver@hrgenie.com',
    password: 'Approver@123',
    role: 'Approver',
    department: 'Finance',
    status: 'Active',
    createdOn: '20 Apr 2026',
  },
  {
    id: 'u4',
    name: 'Sneha Desai',
    email: 'emp@hrgenie.com',
    password: 'Emp@123',
    role: 'Employee',
    department: 'Sales',
    status: 'Active',
    createdOn: '10 May 2026',
  },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _users = signal<HRUser[]>(DEMO_USERS);

  private _state = signal<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  readonly user            = computed(() => this._state().user);
  readonly isAuthenticated = computed(() => this._state().isAuthenticated);
  readonly currentRole     = computed(() => this._state().user?.role ?? null);
  readonly isAdmin         = computed(() => this._state().user?.role === 'HR Admin');
  readonly allUsers        = this._users.asReadonly();

  constructor(private router: Router) {
    // Restore session from sessionStorage
    const saved = sessionStorage.getItem('hrgenie_user');
    if (saved) {
      try {
        const u: User = JSON.parse(saved);
        this._state.set({ user: u, token: 'mock-jwt', isAuthenticated: true });
      } catch { /* ignore corrupt data */ }
    }
  }

  /** Returns the matched user or null. Sets auth state on success. */
  login(email: string, password: string): { success: boolean; message: string } {
    const found = this._users().find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      return { success: false, message: 'Invalid email or password.' };
    }
    if (found.status === 'Inactive') {
      return { success: false, message: 'Your account is inactive. Contact your HR Admin.' };
    }

    const user: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      department: found.department,
    };

    this._state.set({ user, token: 'mock-jwt-' + found.id, isAuthenticated: true });
    sessionStorage.setItem('hrgenie_user', JSON.stringify(user));
    return { success: true, message: 'Login successful' };
  }

  logout(): void {
    this._state.set({ user: null, token: null, isAuthenticated: false });
    sessionStorage.removeItem('hrgenie_user');
    this.router.navigate(['/login']);
  }

  /** Simulate forgot-password (returns true if email found) */
  requestPasswordReset(email: string): boolean {
    return this._users().some(u => u.email.toLowerCase() === email.toLowerCase());
  }

  /** Admin creates a new HR user */
  createUser(newUser: Omit<HRUser, 'id' | 'createdOn'>): { success: boolean; message: string } {
    const exists = this._users().some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
    if (exists) return { success: false, message: 'A user with this email already exists.' };

    const user: HRUser = {
      ...newUser,
      id: 'u' + Date.now(),
      createdOn: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    this._users.update(u => [...u, user]);
    return { success: true, message: `User "${user.name}" created successfully.` };
  }

  /** Admin updates a user's status */
  toggleUserStatus(id: string): void {
    this._users.update(users =>
      users.map(u => u.id === id
        ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
        : u
      )
    );
  }

  /** Admin deletes a user (cannot delete self) */
  deleteUser(id: string): void {
    this._users.update(users => users.filter(u => u.id !== id));
  }
}
