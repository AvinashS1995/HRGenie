import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { EmployeeService } from '../../core/services/employee.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

// ─── Add Grade Dialog ─────────────────────────────────────────────────────────
@Component({
  selector: 'app-add-grade-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatButtonModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatIconModule,
  ],
  template: `
    <div class="dlg-wrap">
      <div class="dlg-hdr">
        <div class="dlg-icon"><mat-icon>layers</mat-icon></div>
        <div>
          <h2 class="dlg-title">{{ data ? 'Edit' : 'Add' }} Salary Grade</h2>
          <p class="dlg-sub">Define the salary band for this grade level</p>
        </div>
        <button mat-icon-button style="margin-left:auto;" (click)="ref.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="dlg-body">
        <div class="dlg-grid">

          <mat-form-field appearance="outline">
            <mat-label>Grade Code</mat-label>
            <input matInput formControlName="grade" placeholder="e.g. L9" />
            <mat-error>Required (e.g. L9)</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Level / Title</mat-label>
            <input matInput formControlName="level" placeholder="e.g. Director" />
            <mat-error>Required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Minimum CTC (₹/yr)</mat-label>
            <input matInput formControlName="minCTC" type="number" placeholder="e.g. 5000000" />
            <span matPrefix>₹&nbsp;</span>
            <mat-error>Required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Maximum CTC (₹/yr)</mat-label>
            <input matInput formControlName="maxCTC" type="number" placeholder="e.g. 8000000" />
            <span matPrefix>₹&nbsp;</span>
            <mat-error>Must be greater than min</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Midpoint CTC (₹/yr)</mat-label>
            <input matInput formControlName="midpoint" type="number" placeholder="Auto-calculated" />
            <span matPrefix>₹&nbsp;</span>
            <mat-hint>Typically (min + max) / 2</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Department</mat-label>
            <mat-select formControlName="department">
              <mat-option value="All">All Departments</mat-option>
              @for (d of depts; track d) {
                <mat-option [value]="d">{{ d }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

        </div>

        <!-- Range preview -->
        <div class="range-preview">
          <span class="range-lbl">Band Range Preview</span>
          <div class="range-vis">
            <span class="range-end">₹{{ (form.value.minCTC || 0) | number }}</span>
            <div class="range-bar-outer">
              <div class="range-bar-inner"></div>
              <div class="range-mid-marker"></div>
            </div>
            <span class="range-end">₹{{ (form.value.maxCTC || 0) | number }}</span>
          </div>
        </div>

        <div class="dlg-actions">
          <button type="button" mat-button class="btn-secondary" (click)="ref.close()">Cancel</button>
          <button type="submit" mat-flat-button class="btn-primary" [disabled]="form.invalid">
            <span class="btn-inner">
              <mat-icon>{{ data ? 'save' : 'add' }}</mat-icon>
              {{ data ? 'Save Changes' : 'Add Grade' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dlg-wrap { width: 540px; max-width: 95vw; }

    .dlg-hdr {
      display: flex; align-items: center; gap: 12px;
      padding: 20px 20px 16px; border-bottom: 1px solid var(--color-border);
    }
    .dlg-icon {
      width: 40px; height: 40px; background: #f5f3ff; border-radius: 10px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      mat-icon { color: #7c3aed; font-size: 22px; width: 22px; height: 22px; }
    }
    .dlg-title { font-size: 1rem; font-weight: 700; color: var(--color-text-primary); margin: 0 0 1px; }
    .dlg-sub   { font-size: 0.75rem; color: var(--color-text-muted); margin: 0; }

    .dlg-body { padding: 16px 20px 20px; }
    .dlg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14px; }
    mat-form-field { width: 100%; }

    /* Range preview */
    .range-preview {
      margin: 8px 0 16px;
      padding: 12px 14px;
      background: #f8f9fc;
      border: 1px solid var(--color-border);
      border-radius: 8px;
    }
    .range-lbl { font-size: 0.72rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 8px; }

    .range-vis { display: flex; align-items: center; gap: 10px; }
    .range-end { font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); white-space: nowrap; }

    .range-bar-outer {
      flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; position: relative; overflow: visible;
    }
    .range-bar-inner {
      height: 100%; width: 100%;
      background: linear-gradient(90deg, #a78bfa, #7c3aed);
      border-radius: 4px;
    }
    .range-mid-marker {
      position: absolute; left: 50%; top: -3px;
      width: 3px; height: 14px; background: #6d28d9;
      border-radius: 1px; transform: translateX(-50%);
    }

    .dlg-actions {
      display: flex; justify-content: flex-end; gap: 10px;
      padding-top: 14px; border-top: 1px solid var(--color-border);
    }

    .btn-inner {
      display: inline-flex; align-items: center; gap: 6px;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }
  `]
})
export class AddGradeDialogComponent {
  readonly ref  = inject(MatDialogRef<AddGradeDialogComponent>);
  private fb    = inject(FormBuilder);
  readonly data = inject<SalaryBand | null>(MAT_DIALOG_DATA, { optional: true });

  depts = ['Sales', 'Marketing', 'IT', 'Finance', 'HR', 'Operations'];

  form = this.fb.group({
    grade:      [this.data?.grade      ?? '', Validators.required],
    level:      [this.data?.level      ?? '', Validators.required],
    minCTC:     [this.data?.minCTC     ?? null as number | null, [Validators.required, Validators.min(1)]],
    maxCTC:     [this.data?.maxCTC     ?? null as number | null, [Validators.required, Validators.min(1)]],
    midpoint:   [this.data?.midpoint   ?? null as number | null],
    department: [this.data?.department ?? 'All'],
    employees:  [this.data?.employees  ?? 0],
  });

  submit() {
    if (this.form.invalid) return;
    const v = this.form.value;
    // Auto-calc midpoint if empty
    if (!v.midpoint && v.minCTC && v.maxCTC) {
      this.form.patchValue({ midpoint: Math.round((v.minCTC + v.maxCTC) / 2) });
    }
    this.ref.close(this.form.value);
  }
}

interface SalaryBand {
  grade: string;
  level: string;
  minCTC: number;
  maxCTC: number;
  midpoint: number;
  employees: number;
  department: string;
}

const MOCK_BANDS: SalaryBand[] = [
  { grade: 'L1', level: 'Junior Executive',   minCTC: 300000,  maxCTC: 500000,  midpoint: 400000,  employees: 42, department: 'All' },
  { grade: 'L2', level: 'Executive',          minCTC: 480000,  maxCTC: 750000,  midpoint: 615000,  employees: 68, department: 'All' },
  { grade: 'L3', level: 'Senior Executive',   minCTC: 700000,  maxCTC: 1000000, midpoint: 850000,  employees: 56, department: 'All' },
  { grade: 'L4', level: 'Team Lead',          minCTC: 950000,  maxCTC: 1400000, midpoint: 1175000, employees: 34, department: 'All' },
  { grade: 'L5', level: 'Assistant Manager',  minCTC: 1300000, maxCTC: 1900000, midpoint: 1600000, employees: 28, department: 'All' },
  { grade: 'L6', level: 'Deputy Manager',     minCTC: 1800000, maxCTC: 2600000, midpoint: 2200000, employees: 22, department: 'All' },
  { grade: 'L7', level: 'Manager',            minCTC: 2400000, maxCTC: 3500000, midpoint: 2950000, employees: 18, department: 'All' },
  { grade: 'L8', level: 'Senior Manager',     minCTC: 3200000, maxCTC: 4800000, midpoint: 4000000, employees: 12, department: 'All' },
];

const COMPONENTS = [
  { name: 'Basic Salary',         pct: 40, description: '40% of CTC' },
  { name: 'HRA',                  pct: 20, description: '50% of Basic' },
  { name: 'Conveyance Allowance', pct: 5,  description: '₹48,000 fixed per annum' },
  { name: 'Medical Allowance',    pct: 2,  description: '₹15,000 fixed per annum' },
  { name: 'Special Allowance',    pct: 23, description: 'Balancing component' },
  { name: 'PF (Employer)',        pct: 5,  description: '12% of Basic (capped)' },
  { name: 'Gratuity',             pct: 3,  description: '4.81% of Basic' },
  { name: 'Insurance',            pct: 2,  description: 'Group health + term life' },
];

@Component({
  selector: 'app-salary-structure',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatIconModule, MatButtonModule, MatTableModule,
    MatTabsModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatTooltipModule, MatDialogModule,
    PageHeaderComponent,
  ],
  template: `
    <div class="page-container fade-in-up">
      <app-page-header
        title="Salary Structure"
        subtitle="Configure salary bands, components and compensation policy"
      >
        <button mat-button class="btn-secondary">
          <mat-icon>download</mat-icon>
          Export
        </button>
        <button mat-flat-button class="btn-primary" (click)="openAddGrade()">
          <mat-icon>add</mat-icon>
          Add Grade
        </button>
      </app-page-header>

      <!-- Summary KPI row -->
      <div class="summary-row">
        <div class="summary-card card" *ngFor="let s of summaryCards">
          <div class="sc-icon" [style.background]="s.bg">
            <mat-icon [style.color]="s.color">{{ s.icon }}</mat-icon>
          </div>
          <div class="sc-text">
            <p class="sc-val">{{ s.value }}</p>
            <p class="sc-label">{{ s.label }}</p>
          </div>
        </div>
      </div>

      <mat-tab-group animationDuration="150ms" class="main-tabs">

        <!-- ── Tab 1: Salary Bands ── -->
        <mat-tab label="Salary Bands">
          <div class="tab-body">
            <div class="card" style="overflow:hidden;">
              <div class="table-toolbar">
                <mat-form-field appearance="outline" class="search-field">
                  <mat-icon matPrefix>search</mat-icon>
                  <input matInput [formControl]="bandSearch" placeholder="Search grade or level..." />
                </mat-form-field>
                <mat-form-field appearance="outline" style="width:160px;">
                  <mat-label>Department</mat-label>
                  <mat-select [formControl]="deptFilter">
                    <mat-option value="">All Departments</mat-option>
                    @for (d of depts; track d) { <mat-option [value]="d">{{ d }}</mat-option> }
                  </mat-select>
                </mat-form-field>
              </div>

              <div style="overflow-x:auto;">
                <table mat-table [dataSource]="filteredBands()" style="width:100%;">

                  <ng-container matColumnDef="grade">
                    <th mat-header-cell *matHeaderCellDef>Grade</th>
                    <td mat-cell *matCellDef="let b">
                      <span class="grade-badge">{{ b.grade }}</span>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="level">
                    <th mat-header-cell *matHeaderCellDef>Level</th>
                    <td mat-cell *matCellDef="let b" class="level-cell">{{ b.level }}</td>
                  </ng-container>

                  <ng-container matColumnDef="minCTC">
                    <th mat-header-cell *matHeaderCellDef>Min CTC</th>
                    <td mat-cell *matCellDef="let b" class="ctc-cell">₹{{ b.minCTC | number }}</td>
                  </ng-container>

                  <ng-container matColumnDef="midpoint">
                    <th mat-header-cell *matHeaderCellDef>Midpoint</th>
                    <td mat-cell *matCellDef="let b">
                      <span class="mid-val">₹{{ b.midpoint | number }}</span>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="maxCTC">
                    <th mat-header-cell *matHeaderCellDef>Max CTC</th>
                    <td mat-cell *matCellDef="let b" class="ctc-cell max">₹{{ b.maxCTC | number }}</td>
                  </ng-container>

                  <ng-container matColumnDef="range">
                    <th mat-header-cell *matHeaderCellDef>Band Range</th>
                    <td mat-cell *matCellDef="let b">
                      <div class="range-bar-wrap">
                        <div class="range-bar">
                          <div class="range-fill" [style.width.%]="bandFillPct(b)"></div>
                          <div class="range-mid" [style.left.%]="50"></div>
                        </div>
                      </div>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="employees">
                    <th mat-header-cell *matHeaderCellDef>Employees</th>
                    <td mat-cell *matCellDef="let b">
                      <div class="emp-count-cell">
                        <mat-icon>people</mat-icon>
                        {{ b.employees }}
                      </div>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let b">
                      <button mat-icon-button matTooltip="Edit Grade" style="color:#f59e0b;" (click)="openEditGrade(b)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button matTooltip="View Employees" style="color:#6366f1;"
                        [routerLink]="['/employees']">
                        <mat-icon>people</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="bandCols"></tr>
                  <tr mat-row *matRowDef="let row; columns: bandCols;" class="band-row"></tr>
                </table>
              </div>

              <div class="table-footer">
                <span>{{ filteredBands().length }} salary grades defined</span>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- ── Tab 2: Salary Components ── -->
        <mat-tab label="Salary Components">
          <div class="tab-body">
            <div class="components-grid">
              @for (comp of salaryComponents; track comp.name) {
                <div class="comp-card card">
                  <div class="comp-header">
                    <div class="comp-pct-ring" [style.--pct]="comp.pct">
                      <span class="comp-pct-val">{{ comp.pct }}%</span>
                    </div>
                    <div class="comp-info">
                      <p class="comp-name">{{ comp.name }}</p>
                      <p class="comp-desc">{{ comp.description }}</p>
                    </div>
                  </div>
                  <div class="comp-bar">
                    <div class="comp-bar-fill" [style.width.%]="comp.pct * 2.5"></div>
                  </div>
                </div>
              }
            </div>

            <!-- Policy Note -->
            <div class="policy-note card">
              <mat-icon>info_outline</mat-icon>
              <div>
                <p class="policy-title">Salary Structure Policy</p>
                <p class="policy-text">
                  Basic Salary forms 40% of CTC. HRA is calculated at 50% of Basic.
                  PF and Gratuity are statutory components as per Indian labour law.
                  Special Allowance is the balancing figure after all fixed components.
                </p>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- ── Tab 3: Employee CTC Mapping ── -->
        <mat-tab label="Employee CTC Mapping">
          <div class="tab-body">
            <div class="card" style="overflow:hidden;">
              <div class="table-toolbar">
                <mat-form-field appearance="outline" class="search-field">
                  <mat-icon matPrefix>search</mat-icon>
                  <input matInput [formControl]="empSearch" placeholder="Search employees..." />
                </mat-form-field>
              </div>
              <div style="overflow-x:auto;">
                <table mat-table [dataSource]="filteredEmps()" style="width:100%;">

                  <ng-container matColumnDef="name">
                    <th mat-header-cell *matHeaderCellDef>Employee</th>
                    <td mat-cell *matCellDef="let e">
                      <div style="display:flex;align-items:center;gap:10px;">
                        <div class="emp-avatar">{{ e.name[0] }}</div>
                        <div>
                          <p class="emp-name-cell">{{ e.name }}</p>
                          <p class="emp-id-cell">{{ e.employeeId }}</p>
                        </div>
                      </div>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="designation">
                    <th mat-header-cell *matHeaderCellDef>Designation</th>
                    <td mat-cell *matCellDef="let e" class="desig-cell">{{ e.designation }}</td>
                  </ng-container>

                  <ng-container matColumnDef="department">
                    <th mat-header-cell *matHeaderCellDef>Department</th>
                    <td mat-cell *matCellDef="let e">
                      <span class="dept-chip">{{ e.department }}</span>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="grade">
                    <th mat-header-cell *matHeaderCellDef>Grade</th>
                    <td mat-cell *matCellDef="let e">
                      <span class="grade-badge">{{ empGrade(e.currentCTC) }}</span>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="ctc">
                    <th mat-header-cell *matHeaderCellDef>Current CTC</th>
                    <td mat-cell *matCellDef="let e" class="ctc-val">₹{{ e.currentCTC | number }}</td>
                  </ng-container>

                  <ng-container matColumnDef="compa">
                    <th mat-header-cell *matHeaderCellDef>Compa-Ratio</th>
                    <td mat-cell *matCellDef="let e">
                      <span class="compa-chip" [class.compa-low]="compaRatio(e.currentCTC) < 0.9"
                        [class.compa-high]="compaRatio(e.currentCTC) > 1.1">
                        {{ (compaRatio(e.currentCTC) * 100).toFixed(0) }}%
                      </span>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="empCols"></tr>
                  <tr mat-row *matRowDef="let row; columns: empCols;"></tr>
                </table>
              </div>
              <div class="table-footer">
                <span>{{ filteredEmps().length }} employees</span>
              </div>
            </div>
          </div>
        </mat-tab>

      </mat-tab-group>
    </div>
  `,
  styles: [`
    .page-container { padding: var(--page-padding); }

    /* Summary row */
    .summary-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 24px;

      @media (max-width: 1023px) { grid-template-columns: repeat(2, 1fr); }
      @media (max-width: 479px)  { grid-template-columns: 1fr 1fr; gap: 10px; }
    }

    .summary-card {
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .sc-icon {
      width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }

    .sc-text { min-width: 0; }
    .sc-val { font-size: 1.375rem; font-weight: 800; color: var(--color-text-primary); margin: 0 0 2px; letter-spacing: -0.01em; line-height: 1; }
    .sc-label { font-size: 0.75rem; font-weight: 500; color: var(--color-text-secondary); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* Tabs */
    .main-tabs { background: transparent; }
    .tab-body { padding: 20px 0; }

    /* Table toolbar */
    .table-toolbar {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 16px 6px; flex-wrap: wrap;
      border-bottom: 1px solid var(--color-border);
    }
    .search-field { flex: 1; min-width: 200px; }

    /* Bands table */
    .grade-badge {
      background: #f5f3ff; color: #6d28d9;
      font-size: 0.75rem; font-weight: 800;
      padding: 3px 10px; border-radius: 20px; letter-spacing: 0.04em;
    }

    .level-cell { font-size: 0.875rem; font-weight: 500; color: var(--color-text-primary); }
    .ctc-cell { font-size: 0.825rem; color: var(--color-text-secondary); }
    .ctc-cell.max { font-weight: 600; color: #7c3aed; }

    .mid-val {
      font-size: 0.875rem; font-weight: 700; color: var(--color-text-primary);
      background: #f0fdf4; padding: 2px 8px; border-radius: 6px;
    }

    .range-bar-wrap { padding: 4px 0; min-width: 100px; }
    .range-bar {
      height: 6px; background: #e5e7eb; border-radius: 3px; position: relative;
    }
    .range-fill {
      height: 100%; background: linear-gradient(90deg, #a78bfa, #7c3aed);
      border-radius: 3px; width: 100%;
    }
    .range-mid {
      position: absolute; top: -3px; width: 2px; height: 12px;
      background: #6d28d9; border-radius: 1px;
    }

    .emp-count-cell {
      display: flex; align-items: center; gap: 5px;
      font-size: 0.875rem; font-weight: 500;
      mat-icon { font-size: 15px; width: 15px; height: 15px; color: var(--color-text-muted); }
    }

    .band-row:hover td { background: #faf5ff; cursor: pointer; }

    .table-footer {
      padding: 10px 20px; border-top: 1px solid var(--color-border);
      background: #f8f9fc; font-size: 0.8rem; color: var(--color-text-muted);
    }

    /* Components tab */
    .components-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 14px;
      margin-bottom: 20px;
    }

    .comp-card { padding: 18px 20px; }

    .comp-header { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }

    .comp-pct-ring {
      width: 52px; height: 52px; border-radius: 50%;
      background: conic-gradient(#7c3aed calc(var(--pct) * 3.6deg), #e9d5ff 0deg);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      position: relative;

      &::after {
        content: ''; position: absolute;
        width: 36px; height: 36px; border-radius: 50%; background: white;
      }
    }

    .comp-pct-val {
      font-size: 0.72rem; font-weight: 800; color: #6d28d9;
      position: relative; z-index: 1;
    }

    .comp-name { font-size: 0.875rem; font-weight: 700; color: var(--color-text-primary); margin: 0 0 3px; }
    .comp-desc { font-size: 0.75rem; color: var(--color-text-muted); margin: 0; }

    .comp-bar { height: 4px; background: #f3f4f6; border-radius: 2px; overflow: hidden; }
    .comp-bar-fill { height: 100%; background: linear-gradient(90deg, #a78bfa, #7c3aed); border-radius: 2px; max-width: 100%; }

    /* Policy note */
    .policy-note {
      display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px;
      background: #f0f9ff; border-color: #bae6fd;

      mat-icon { color: #0284c7; flex-shrink: 0; margin-top: 1px; }
    }

    .policy-title { font-size: 0.875rem; font-weight: 700; color: #0c4a6e; margin: 0 0 4px; }
    .policy-text { font-size: 0.82rem; color: #075985; margin: 0; line-height: 1.5; }

    /* EMP mapping tab */
    .emp-avatar {
      width: 30px; height: 30px; border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
    }

    .emp-name-cell { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); margin: 0 0 1px; }
    .emp-id-cell { font-size: 0.7rem; color: #6366f1; font-weight: 600; margin: 0; }
    .desig-cell { font-size: 0.82rem; color: var(--color-text-secondary); }
    .dept-chip { font-size: 0.75rem; font-weight: 500; background: #f3f4f6; color: #6b7280; padding: 2px 8px; border-radius: 6px; }
    .ctc-val { font-size: 0.875rem; font-weight: 600; color: #7c3aed; }

    .compa-chip {
      font-size: 0.78rem; font-weight: 700; padding: 2px 9px; border-radius: 12px;
      background: #dcfce7; color: #16a34a;
    }
    .compa-low  { background: #fef2f2 !important; color: #dc2626 !important; }
    .compa-high { background: #eff6ff !important; color: #2563eb !important; }
  `]
})
export class SalaryStructureComponent {
  private employeeService = inject(EmployeeService);
  private dialog   = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  bandSearch = new FormControl('');
  deptFilter = new FormControl('');
  empSearch  = new FormControl('');

  depts    = ['Sales', 'Marketing', 'IT', 'Finance', 'HR', 'Operations'];
  bandCols = ['grade', 'level', 'minCTC', 'midpoint', 'maxCTC', 'range', 'employees', 'actions'];
  empCols  = ['name', 'designation', 'department', 'grade', 'ctc', 'compa'];

  salaryComponents = COMPONENTS;

  // Reactive signal so Add / Edit immediately reflects in the table
  private _bands = signal<SalaryBand[]>([...MOCK_BANDS]);

  summaryCards = [
    { icon: 'layers',          label: 'Salary Grades',   value: '8',     bg: '#f5f3ff', color: '#7c3aed' },
    { icon: 'people_alt',      label: 'Total Employees', value: '280',   bg: '#eff6ff', color: '#3b82f6' },
    { icon: 'currency_rupee',  label: 'Avg. CTC',        value: '₹8.5L', bg: '#f0fdf4', color: '#10b981' },
    { icon: 'trending_up',     label: 'Highest Band',    value: '₹48L',  bg: '#fff7ed', color: '#f59e0b' },
  ];

  filteredBands = () => {
    let b = this._bands();
    const q = this.bandSearch.value?.toLowerCase() ?? '';
    if (q) b = b.filter(x => x.grade.toLowerCase().includes(q) || x.level.toLowerCase().includes(q));
    return b;
  };

  filteredEmps = () => {
    let emps = this.employeeService.getEmployees();
    const q = this.empSearch.value?.toLowerCase() ?? '';
    if (q) emps = emps.filter(e => e.name.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q));
    return emps;
  };

  bandFillPct(_b: SalaryBand) { return 100; }

  empGrade(ctc: number): string {
    if (ctc < 500000)  return 'L1';
    if (ctc < 750000)  return 'L2';
    if (ctc < 1000000) return 'L3';
    if (ctc < 1400000) return 'L4';
    if (ctc < 1900000) return 'L5';
    return 'L6';
  }

  compaRatio(ctc: number): number {
    const band = this._bands().find(b => ctc >= b.minCTC && ctc <= b.maxCTC);
    if (!band) return 1;
    return ctc / band.midpoint;
  }

  openAddGrade() {
    const ref = this.dialog.open(AddGradeDialogComponent, {
      width: '560px', maxWidth: '95vw',
    });
    ref.afterClosed().subscribe((result: SalaryBand | undefined) => {
      if (!result) return;
      const band: SalaryBand = {
        grade:      result.grade,
        level:      result.level,
        minCTC:     result.minCTC,
        maxCTC:     result.maxCTC,
        midpoint:   result.midpoint ?? Math.round((result.minCTC + result.maxCTC) / 2),
        employees:  0,
        department: result.department ?? 'All',
      };
      this._bands.update(bands => [...bands, band]);
      this.snackBar.open(
        `Grade ${band.grade} — ${band.level} added successfully!`,
        'Close',
        { duration: 3000 }
      );
    });
  }

  openEditGrade(band: SalaryBand) {
    const ref = this.dialog.open(AddGradeDialogComponent, {
      width: '560px', maxWidth: '95vw',
      data: band,
    });
    ref.afterClosed().subscribe((result: SalaryBand | undefined) => {
      if (!result) return;
      this._bands.update(bands =>
        bands.map(b => b.grade === band.grade ? { ...b, ...result } : b)
      );
      this.snackBar.open(`Grade ${result.grade} updated.`, 'Close', { duration: 2500 });
    });
  }
}
