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
  selector: 'app-add-employee-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatButtonModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatIconModule,
  ],
  template: `
    <div class="dialog-wrap">
      <!-- Header -->
      <div class="dialog-hdr">
        <div class="dialog-hdr-icon">
          <mat-icon>person_add</mat-icon>
        </div>
        <div>
          <h2 class="dialog-title">Add New Employee</h2>
          <p class="dialog-sub">Fill in the details to register a new employee</p>
        </div>
        <button mat-icon-button class="dialog-close" (click)="dialogRef.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Form -->
      <form [formGroup]="form" (ngSubmit)="submit()" class="dialog-body">

        <!-- Section: Personal Info -->
        <p class="form-section-label">Personal Information</p>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="name" placeholder="e.g. Rahul Sharma" />
            <mat-error>Full name is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Employee ID</mat-label>
            <input matInput formControlName="employeeId" placeholder="e.g. EMP009" />
            <mat-error>Employee ID is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" placeholder="name@company.com" />
            <mat-error>Valid email is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Phone</mat-label>
            <input matInput formControlName="phone" placeholder="+91 98765 43210" />
          </mat-form-field>
        </div>

        <!-- Section: Job Info -->
        <p class="form-section-label">Job Information</p>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Designation</mat-label>
            <input matInput formControlName="designation" placeholder="e.g. Senior Developer" />
            <mat-error>Designation is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Department</mat-label>
            <mat-select formControlName="department">
              @for (d of depts; track d) { <mat-option [value]="d">{{ d }}</mat-option> }
            </mat-select>
            <mat-error>Department is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Location</mat-label>
            <mat-select formControlName="location">
              @for (l of locations; track l) { <mat-option [value]="l">{{ l }}</mat-option> }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Joining Date</mat-label>
            <input matInput formControlName="joiningDate" placeholder="DD MMM YYYY" />
            <mat-icon matSuffix>calendar_today</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Reporting To</mat-label>
            <input matInput formControlName="reportingTo" placeholder="Manager name / role" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Employment Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="Active">Active</mat-option>
              <mat-option value="Inactive">Inactive</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Section: Compensation -->
        <p class="form-section-label">Compensation</p>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Current CTC (Annual)</mat-label>
            <input matInput formControlName="currentCTC" type="number" placeholder="e.g. 700000" />
            <span matPrefix>₹&nbsp;</span>
            <mat-error>CTC is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Salary Grade</mat-label>
            <mat-select formControlName="grade">
              @for (g of grades; track g) { <mat-option [value]="g">{{ g }}</mat-option> }
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Actions -->
        <div class="dialog-actions">
          <button type="button" mat-button class="btn-secondary" (click)="dialogRef.close()">
            Cancel
          </button>
          <button type="submit" mat-flat-button class="btn-primary" [disabled]="form.invalid">
            <mat-icon>person_add</mat-icon>
            Add Employee
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-wrap {
      width: 100%;
      box-sizing: border-box;
    }

    .dialog-hdr {
      display: flex; align-items: flex-start; gap: 14px;
      padding: 20px 24px 16px;
      border-bottom: 1px solid var(--color-border);
    }

    .dialog-hdr-icon {
      width: 40px; height: 40px; background: #f5f3ff; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      mat-icon { color: #7c3aed; font-size: 20px; width: 20px; height: 20px; }
    }

    .dialog-title { font-size: 1rem; font-weight: 700; color: var(--color-text-primary); margin: 0 0 2px; }
    .dialog-sub   { font-size: 0.75rem; color: var(--color-text-muted); margin: 0; }

    .dialog-close {
      margin-left: auto !important;
      color: var(--color-text-muted) !important;
      flex-shrink: 0;
    }

    .dialog-body {
      padding: 16px 24px 24px;
    }

    .form-section-label {
      font-size: 0.68rem;
      font-weight: 700;
      color: var(--color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 16px 0 6px;

      &:first-child { margin-top: 4px; }
    }

    /* 4 columns on wide dialog — all fields fit without scroll */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0 14px;

      @media (max-width: 640px) { grid-template-columns: 1fr 1fr; }
      @media (max-width: 479px) { grid-template-columns: 1fr; }
    }

    mat-form-field { width: 100%; }

    .dialog-actions {
      display: flex; justify-content: flex-end; gap: 10px;
      margin-top: 8px; padding-top: 14px;
      border-top: 1px solid var(--color-border);
    }
  `]
})
export class AddEmployeeDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AddEmployeeDialogComponent>);
  private fb = inject(FormBuilder);

  depts     = ['Sales', 'Marketing', 'IT', 'Finance', 'HR', 'Operations'];
  locations = ['Ahmedabad', 'Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Hyderabad', 'Chennai'];
  grades    = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];

  form = this.fb.group({
    name:        ['', Validators.required],
    employeeId:  ['', Validators.required],
    email:       ['', [Validators.required, Validators.email]],
    phone:       [''],
    designation: ['', Validators.required],
    department:  ['', Validators.required],
    location:    ['Ahmedabad'],
    joiningDate: [new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })],
    reportingTo: [''],
    status:      ['Active'],
    currentCTC:  [null as number | null, [Validators.required, Validators.min(1)]],
    grade:       ['L2'],
  });

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
