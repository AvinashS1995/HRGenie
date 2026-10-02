import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ── Public routes ────────────────────────────────────────────────────────
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
  },

  // ── Protected routes (wrapped in shell) ───────────────────────────────────
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
      },
      {
        path: 'increment',
        loadChildren: () => import('./features/increment-management/increment-management.routes').then(m => m.INCREMENT_ROUTES),
      },
      {
        path: 'approvals',
        loadComponent: () => import('./features/approvals/approvals.component').then(m => m.ApprovalsComponent),
      },
      {
        path: 'employees',
        loadComponent: () => import('./features/employees/employees.component').then(m => m.EmployeesComponent),
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent),
      },
      {
        path: 'templates',
        loadComponent: () => import('./features/templates/templates.component').then(m => m.TemplatesComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
      },
      {
        path: 'salary-structure',
        loadComponent: () => import('./features/salary-structure/salary-structure.component').then(m => m.SalaryStructureComponent),
      },
      {
        path: 'documents',
        loadComponent: () => import('./features/documents/documents.component').then(m => m.DocumentsComponent),
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },

  // ── Fallback ──────────────────────────────────────────────────────────────
  { path: '**', redirectTo: 'login' },
];
