import { Routes } from '@angular/router';

export const INCREMENT_ROUTES: Routes = [
  {
    path: 'cycles',
    loadComponent: () => import('./cycles/cycles.component').then(m => m.CyclesComponent),
  },
  {
    path: 'upload',
    loadComponent: () => import('./upload/upload.component').then(m => m.UploadComponent),
  },
  {
    path: 'employees',
    loadComponent: () => import('./employees/increment-employees.component').then(m => m.IncrementEmployeesComponent),
  },
  {
    path: 'employee/:id',
    loadComponent: () => import('./employee-detail/employee-detail.component').then(m => m.EmployeeDetailComponent),
  },
  {
    path: 'letters',
    loadComponent: () => import('./letter-generation/letter-generation.component').then(m => m.LetterGenerationComponent),
  },
  {
    path: 'annexure',
    loadComponent: () => import('./letter-generation/letter-generation.component').then(m => m.LetterGenerationComponent),
  },
  {
    path: 'validation',
    loadComponent: () => import('./validation/validation.component').then(m => m.ValidationComponent),
  },
  {
    path: '',
    redirectTo: 'cycles',
    pathMatch: 'full',
  }
];
