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
import { MatTooltipModule } from '@angular/material/tooltip';

import { IncrementService } from '../../../core/services/increment.service';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-increment-employees',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatTableModule, MatTooltipModule,
    StatusChipComponent, PageHeaderComponent,
  ],
  template: `
    <div class="page-container fade-in-up">
      <app-page-header
        title="Employee Increment List"
        subtitle="View and manage employees in the active increment cycle"
      >
        <button mat-flat-button class="btn-primary" [routerLink]="['/increment/upload']">
          <mat-icon>upload_file</mat-icon>
          Upload Data
        </button>
      </app-page-header>

      <div class="card">
        <!-- Filters -->
        <div class="filter-bar" style="padding:16px 20px 8px; display:flex; gap:12px; border-bottom: 1px solid var(--color-border);">
          <mat-form-field appearance="outline" style="flex:1; max-width:300px;">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput [formControl]="searchCtrl" placeholder="Search employees..." />
          </mat-form-field>
          <mat-form-field appearance="outline" style="width:160px;">
            <mat-label>Department</mat-label>
            <mat-select [formControl]="deptCtrl">
              <mat-option value="">All Departments</mat-option>
              <mat-option value="Sales">Sales</mat-option>
              <mat-option value="Marketing">Marketing</mat-option>
              <mat-option value="IT">IT</mat-option>
              <mat-option value="Finance">Finance</mat-option>
              <mat-option value="HR">HR</mat-option>
              <mat-option value="Operations">Operations</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" style="width:160px;">
            <mat-label>Status</mat-label>
            <mat-select [formControl]="statusCtrl">
              <mat-option value="">All Status</mat-option>
              <mat-option value="Valid">Valid</mat-option>
              <mat-option value="Issue">Issue</mat-option>
              <mat-option value="Needs Review">Needs Review</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Table -->
        <div style="overflow-x:auto;">
          <table mat-table [dataSource]="filtered()" style="width:100%;">

            <ng-container matColumnDef="employeeId">
              <th mat-header-cell *matHeaderCellDef>Employee ID</th>
              <td mat-cell *matCellDef="let r">
                <span class="emp-id">{{ r.employeeId }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Employee Name</th>
              <td mat-cell *matCellDef="let r">
                <div class="emp-info">
                  <div class="emp-avatar">{{ r.employeeName[0] }}</div>
                  <div>
                    <p class="emp-name">{{ r.employeeName }}</p>
                    <p class="emp-desig">{{ r.designation }}</p>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef>Department</th>
              <td mat-cell *matCellDef="let r" class="dept-cell">{{ r.department }}</td>
            </ng-container>

            <ng-container matColumnDef="currentCTC">
              <th mat-header-cell *matHeaderCellDef>Current CTC</th>
              <td mat-cell *matCellDef="let r" class="amount-cell">₹{{ r.currentCTC | number }}</td>
            </ng-container>

            <ng-container matColumnDef="incrementPct">
              <th mat-header-cell *matHeaderCellDef>Increment %</th>
              <td mat-cell *matCellDef="let r">
                <span class="pct-badge" [class.pct-zero]="r.incrementPct === 0" [class.pct-high]="r.incrementPct > 20">
                  {{ r.incrementPct }}%
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="revisedCTC">
              <th mat-header-cell *matHeaderCellDef>Revised CTC</th>
              <td mat-cell *matCellDef="let r" class="amount-cell revised">₹{{ r.revisedCTC | number }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let r">
                <app-status-chip [type]="r.status.toLowerCase().replace(' ', '-')" [label]="r.status" />
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let r">
                <button
                  mat-icon-button
                  matTooltip="View Employee"
                  style="color:#6366f1;"
                  [routerLink]="['/increment/employee', r.employeeId]"
                >
                  <mat-icon>visibility</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols;"></tr>
          </table>
        </div>

        <div style="padding:12px 20px; border-top: 1px solid var(--color-border); background:#f8f9fc;">
          <span style="font-size:0.8rem; color:var(--color-text-muted);">
            Showing {{ filtered().length }} records
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: var(--page-padding); }
    .card { background: white; border: var(--card-border); border-radius: var(--card-radius); overflow: hidden; }

    .emp-id {
      font-size: 0.78rem;
      font-weight: 600;
      color: #6366f1;
      background: #eff6ff;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .emp-info { display: flex; align-items: center; gap: 10px; }

    .emp-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; font-weight: 700; flex-shrink: 0;
    }

    .emp-name { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); margin: 0 0 1px; }
    .emp-desig { font-size: 0.72rem; color: var(--color-text-muted); margin: 0; }
    .dept-cell { font-size: 0.8rem; color: var(--color-text-secondary); }

    .amount-cell { font-size: 0.875rem; font-weight: 500; color: var(--color-text-primary); }
    .amount-cell.revised { color: #7c3aed; font-weight: 600; }

    .pct-badge {
      background: #f0fdf4; color: #16a34a;
      padding: 2px 9px; border-radius: 12px;
      font-size: 0.8rem; font-weight: 600;
    }

    .pct-zero { background: #fef2f2 !important; color: #dc2626 !important; }
    .pct-high { background: #fff7ed !important; color: #c2410c !important; }
  `]
})
export class IncrementEmployeesComponent {
  private incrementService = inject(IncrementService);

  searchCtrl = new FormControl('');
  deptCtrl = new FormControl('');
  statusCtrl = new FormControl('');

  cols = ['employeeId', 'name', 'department', 'currentCTC', 'incrementPct', 'revisedCTC', 'status', 'actions'];

  private _records = signal(this.incrementService.getRecords('c1'));

  filtered = computed(() => {
    let records = this._records();
    const q = this.searchCtrl.value?.toLowerCase() ?? '';
    const dept = this.deptCtrl.value ?? '';
    const status = this.statusCtrl.value ?? '';

    if (q) records = records.filter(r => r.employeeName.toLowerCase().includes(q) || r.employeeId.toLowerCase().includes(q));
    if (dept) records = records.filter(r => r.department === dept);
    if (status) records = records.filter(r => r.status === status);
    return records;
  });
}
