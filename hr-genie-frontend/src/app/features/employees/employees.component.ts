import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { EmployeeService } from '../../core/services/employee.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusChipComponent } from '../../shared/components/status-chip/status-chip.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatTableModule,
    PageHeaderComponent, StatusChipComponent,
  ],
  template: `
    <div class="page-container fade-in-up">
      <app-page-header title="Employees" subtitle="Manage your organization's employee records">
        <button mat-flat-button class="btn-primary">
          <mat-icon>person_add</mat-icon>
          Add Employee
        </button>
      </app-page-header>

      <div class="card" style="overflow:hidden;">
        <div style="display:flex;gap:12px;padding:16px 20px 8px;border-bottom:1px solid var(--color-border);">
          <mat-form-field appearance="outline" style="flex:1;max-width:320px;">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput [formControl]="searchCtrl" placeholder="Search employees..." />
          </mat-form-field>
          <mat-form-field appearance="outline" style="width:160px;">
            <mat-label>Department</mat-label>
            <mat-select [formControl]="deptCtrl">
              <mat-option value="">All</mat-option>
              @for (d of depts; track d) { <mat-option [value]="d">{{ d }}</mat-option> }
            </mat-select>
          </mat-form-field>
        </div>

        <div style="overflow-x:auto;">
          <table mat-table [dataSource]="filtered()" style="width:100%;">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Employee</th>
              <td mat-cell *matCellDef="let e">
                <div style="display:flex;align-items:center;gap:10px;">
                  <div class="emp-avatar">{{ e.name[0] }}</div>
                  <div>
                    <p style="font-size:.875rem;font-weight:600;margin:0 0 1px;">{{ e.name }}</p>
                    <p style="font-size:.72rem;color:var(--color-text-muted);margin:0;">{{ e.email }}</p>
                  </div>
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="employeeId">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let e"><span class="emp-id">{{ e.employeeId }}</span></td>
            </ng-container>
            <ng-container matColumnDef="designation">
              <th mat-header-cell *matHeaderCellDef>Designation</th>
              <td mat-cell *matCellDef="let e" style="font-size:.875rem;color:var(--color-text-secondary);">{{ e.designation }}</td>
            </ng-container>
            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef>Department</th>
              <td mat-cell *matCellDef="let e"><span class="dept-chip">{{ e.department }}</span></td>
            </ng-container>
            <ng-container matColumnDef="ctc">
              <th mat-header-cell *matHeaderCellDef>CTC</th>
              <td mat-cell *matCellDef="let e" style="font-size:.875rem;font-weight:600;color:#7c3aed;">₹{{ e.currentCTC | number }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let e"><app-status-chip [type]="e.status.toLowerCase()" [label]="e.status"/></td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let e">
                <button mat-icon-button style="color:#6366f1;" [routerLink]="['/increment/employee', e.employeeId]">
                  <mat-icon>visibility</mat-icon>
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols;"></tr>
          </table>
        </div>
        <div style="padding:10px 20px;border-top:1px solid var(--color-border);background:#f8f9fc;font-size:.8rem;color:var(--color-text-muted);">
          {{ filtered().length }} employees
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: var(--page-padding); }
    .emp-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: .8rem; font-weight: 700; flex-shrink: 0;
    }
    .emp-id { font-size: .78rem; font-weight: 600; color: #6366f1; background: #eff6ff; padding: 2px 8px; border-radius: 4px; }
    .dept-chip { font-size: .78rem; font-weight: 500; color: #6b7280; background: #f3f4f6; padding: 2px 8px; border-radius: 6px; }
  `]
})
export class EmployeesComponent {
  private employeeService = inject(EmployeeService);
  searchCtrl = new FormControl('');
  deptCtrl = new FormControl('');
  cols = ['name', 'employeeId', 'designation', 'department', 'ctc', 'status', 'actions'];
  depts = ['Sales', 'Marketing', 'IT', 'Finance', 'HR', 'Operations'];

  filtered = computed(() => {
    let emps = this.employeeService.getEmployees();
    const q = this.searchCtrl.value?.toLowerCase() ?? '';
    const dept = this.deptCtrl.value ?? '';
    if (q) emps = emps.filter(e => e.name.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q));
    if (dept) emps = emps.filter(e => e.department === dept);
    return emps;
  });
}
