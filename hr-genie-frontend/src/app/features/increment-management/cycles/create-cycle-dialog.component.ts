import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-cycle-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatButtonModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <!-- Header -->
      <div class="dialog-header">
        <div class="dialog-header__icon">
          <mat-icon>loop</mat-icon>
        </div>
        <div>
          <h2 class="dialog-title">Create Increment Cycle</h2>
          <p class="dialog-subtitle">Set up a new increment cycle for your organization</p>
        </div>
        <button mat-icon-button class="dialog-close" (click)="dialogRef.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Form -->
      <form [formGroup]="form" (ngSubmit)="submit()" class="dialog-body">
        <div class="form-grid">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Cycle Name</mat-label>
            <input matInput formControlName="cycleName" placeholder="e.g. Annual Increment 2026" />
            <mat-error>Cycle name is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Financial Year</mat-label>
            <mat-select formControlName="financialYear">
              <mat-option value="FY 2025-26">FY 2025-26</mat-option>
              <mat-option value="FY 2026-27">FY 2026-27</mat-option>
              <mat-option value="FY 2024-25">FY 2024-25</mat-option>
            </mat-select>
            <mat-error>Financial year is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Effective Date</mat-label>
            <input matInput formControlName="effectiveDate" placeholder="DD MMM YYYY" />
            <mat-icon matSuffix>calendar_today</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Department</mat-label>
            <mat-select formControlName="department">
              <mat-option value="All">All Departments</mat-option>
              <mat-option value="Sales">Sales</mat-option>
              <mat-option value="Marketing">Marketing</mat-option>
              <mat-option value="IT">IT</mat-option>
              <mat-option value="Finance">Finance</mat-option>
              <mat-option value="HR">HR</mat-option>
              <mat-option value="Operations">Operations</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Employee Group</mat-label>
            <mat-select formControlName="employeeGroup">
              <mat-option value="All">All Employees</mat-option>
              <mat-option value="Permanent">Permanent</mat-option>
              <mat-option value="Contract">Contract</mat-option>
              <mat-option value="Probation">On Probation</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Increment Type</mat-label>
            <mat-select formControlName="incrementType">
              <mat-option value="Merit Based">Merit Based</mat-option>
              <mat-option value="Performance Based">Performance Based</mat-option>
              <mat-option value="Special">Special</mat-option>
              <mat-option value="Retention">Retention</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Remarks (Optional)</mat-label>
            <textarea matInput formControlName="remarks" rows="3" placeholder="Add any notes or instructions..."></textarea>
          </mat-form-field>
        </div>

        <!-- Actions -->
        <div class="dialog-actions">
          <button type="button" mat-button class="btn-secondary" (click)="dialogRef.close()">
            Cancel
          </button>
          <button type="submit" mat-flat-button class="btn-primary" [disabled]="form.invalid">
            <mat-icon>add</mat-icon>
            Create Cycle
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      width: 560px;
      max-width: 100%;
    }

    .dialog-header {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 24px 24px 20px;
      border-bottom: 1px solid var(--color-border);
      position: relative;
    }

    .dialog-header__icon {
      width: 42px;
      height: 42px;
      background: #f5f3ff;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      mat-icon { color: #7c3aed; font-size: 22px; width: 22px; height: 22px; }
    }

    .dialog-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 2px;
    }

    .dialog-subtitle {
      font-size: 0.8rem;
      color: var(--color-text-muted);
      margin: 0;
    }

    .dialog-close {
      margin-left: auto !important;
      color: var(--color-text-muted) !important;
    }

    .dialog-body { padding: 20px 24px 24px; }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 16px;

      .full-width { grid-column: 1 / -1; }
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 8px;
      padding-top: 16px;
      border-top: 1px solid var(--color-border);
    }

    mat-form-field { width: 100%; }
  `]
})
export class CreateCycleDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CreateCycleDialogComponent>);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    cycleName: ['', Validators.required],
    financialYear: ['FY 2025-26', Validators.required],
    effectiveDate: ['01 Apr 2026'],
    department: ['All'],
    employeeGroup: ['All'],
    incrementType: ['Merit Based', Validators.required],
    remarks: [''],
  });

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
