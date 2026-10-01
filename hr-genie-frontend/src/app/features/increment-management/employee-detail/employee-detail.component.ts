import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EmployeeService } from '../../../core/services/employee.service';
import { IncrementService } from '../../../core/services/increment.service';
import { Employee, SalaryStructure, IncrementRecord } from '../../../core/models';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';
import { SalaryComparisonComponent } from '../../../shared/components/salary-comparison/salary-comparison.component';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatIconModule, MatButtonModule, MatTabsModule,
    MatFormFieldModule, MatInputModule,
    StatusChipComponent, SalaryComparisonComponent,
  ],
  template: `
    <div class="page-container fade-in-up">
      <!-- Back -->
      <div class="back-bar">
        <button mat-button class="back-btn" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Back to List
        </button>
      </div>

      @if (employee()) {
        <!-- Profile Card -->
        <div class="profile-card card">
          <div class="profile-left">
            <div class="profile-avatar">{{ employee()!.name[0] }}</div>
            <div class="profile-info">
              <div class="profile-name-row">
                <h2 class="profile-name">{{ employee()!.name }}</h2>
                <app-status-chip [type]="employee()!.status.toLowerCase()" [label]="employee()!.status" />
              </div>
              <p class="profile-id">{{ employee()!.employeeId }}</p>
              <p class="profile-desig">{{ employee()!.designation }}</p>
            </div>
          </div>

          <div class="profile-divider"></div>

          <div class="profile-meta-grid">
            <div class="profile-meta-item">
              <mat-icon>business</mat-icon>
              <div>
                <p class="meta-label">Department</p>
                <p class="meta-value">{{ employee()!.department }}</p>
              </div>
            </div>
            <div class="profile-meta-item">
              <mat-icon>work</mat-icon>
              <div>
                <p class="meta-label">Designation</p>
                <p class="meta-value">{{ employee()!.designation }}</p>
              </div>
            </div>
            <div class="profile-meta-item">
              <mat-icon>calendar_today</mat-icon>
              <div>
                <p class="meta-label">Joining Date</p>
                <p class="meta-value">{{ employee()!.joiningDate }}</p>
              </div>
            </div>
            <div class="profile-meta-item">
              <mat-icon>currency_rupee</mat-icon>
              <div>
                <p class="meta-label">Current CTC</p>
                <p class="meta-value ctc-value">₹{{ employee()!.currentCTC | number }}</p>
              </div>
            </div>
            <div class="profile-meta-item">
              <mat-icon>location_on</mat-icon>
              <div>
                <p class="meta-label">Location</p>
                <p class="meta-value">{{ employee()!.location }}</p>
              </div>
            </div>
            <div class="profile-meta-item">
              <mat-icon>supervisor_account</mat-icon>
              <div>
                <p class="meta-label">Reporting To</p>
                <p class="meta-value">{{ employee()!.reportingTo }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs-card card">
          <mat-tab-group animationDuration="150ms" class="detail-tabs">

            <!-- Tab 1: Increment Details -->
            <mat-tab label="Increment Details">
              <div class="tab-content">
                @if (salaryStructure()) {
                  <app-salary-comparison
                    [components]="salaryStructure()!.components"
                    [totalCTC]="salaryStructure()!.totalCTC"
                    [revisedCTC]="salaryStructure()!.revisedCTC"
                    [incrementPct]="record()?.incrementPct ?? 10"
                  />
                } @else {
                  <div class="no-salary">
                    <mat-icon>info_outline</mat-icon>
                    <p>Salary structure not yet configured for this employee.</p>
                  </div>
                }

                <!-- Increment Form -->
                <div class="increment-form-card">
                  <h3 class="form-section-title">
                    <mat-icon>edit_note</mat-icon>
                    Increment Details
                  </h3>
                  <form [formGroup]="incrementForm" class="increment-form">
                    <mat-form-field appearance="outline">
                      <mat-label>Increment %</mat-label>
                      <input matInput formControlName="incrementPct" type="number" placeholder="e.g. 10" />
                      <span matSuffix>%</span>
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Effective Date</mat-label>
                      <input matInput formControlName="effectiveDate" placeholder="DD MMM YYYY" />
                      <mat-icon matSuffix>calendar_today</mat-icon>
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="full-col">
                      <mat-label>Remarks</mat-label>
                      <input matInput formControlName="remarks" placeholder="e.g. Good Performance" />
                    </mat-form-field>
                  </form>
                  <div class="form-action">
                    <button mat-flat-button class="btn-primary generate-btn" (click)="generateLetter()">
                      <mat-icon>auto_awesome</mat-icon>
                      Generate Letter &amp; Annexure
                    </button>
                  </div>
                </div>
              </div>
            </mat-tab>

            <!-- Tab 2: Salary Components -->
            <mat-tab label="Salary Components">
              <div class="tab-content">
                @if (salaryStructure()) {
                  <div class="salary-table-card">
                    <table class="salary-table">
                      <thead>
                        <tr>
                          <th>Component</th>
                          <th>Current (Annual)</th>
                          <th>Revised (Annual)</th>
                          <th>Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (comp of salaryStructure()!.components; track comp.name) {
                          <tr [class.changed-row]="comp.current !== comp.revised">
                            <td class="comp-name">{{ comp.name }}</td>
                            <td>₹{{ comp.current | number }}</td>
                            <td class="revised-val">₹{{ comp.revised | number }}</td>
                            <td>
                              @if (comp.current !== comp.revised) {
                                <span class="change-badge">
                                  +{{ ((comp.revised - comp.current) / comp.current * 100).toFixed(1) }}%
                                </span>
                              } @else {
                                <span class="no-change">—</span>
                              }
                            </td>
                          </tr>
                        }
                      </tbody>
                      <tfoot>
                        <tr class="total-row">
                          <td><strong>Total CTC</strong></td>
                          <td><strong>₹{{ salaryStructure()!.totalCTC | number }}</strong></td>
                          <td class="revised-val"><strong>₹{{ salaryStructure()!.revisedCTC | number }}</strong></td>
                          <td>
                            <span class="change-badge">
                              +{{ ((salaryStructure()!.revisedCTC - salaryStructure()!.totalCTC) / salaryStructure()!.totalCTC * 100).toFixed(1) }}%
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                }
              </div>
            </mat-tab>

            <!-- Tab 3: Letter Preview -->
            <mat-tab label="Letter Preview">
              <div class="tab-content">
                <div class="preview-placeholder">
                  <div class="preview-icon">
                    <mat-icon>description</mat-icon>
                  </div>
                  <h3>Letter Preview</h3>
                  <p>Generate the increment letter first to see a preview here.</p>
                  <button mat-flat-button class="btn-primary" (click)="generateLetter()">
                    <mat-icon>auto_awesome</mat-icon>
                    Generate Letter
                  </button>
                </div>
              </div>
            </mat-tab>

            <!-- Tab 4: Annexure Preview -->
            <mat-tab label="Annexure Preview">
              <div class="tab-content">
                <div class="preview-placeholder">
                  <div class="preview-icon">
                    <mat-icon>attach_file</mat-icon>
                  </div>
                  <h3>Annexure Preview</h3>
                  <p>Generate the annexure first to see the salary structure breakdown.</p>
                  <button mat-flat-button class="btn-primary" (click)="generateLetter()">
                    <mat-icon>auto_awesome</mat-icon>
                    Generate Annexure
                  </button>
                </div>
              </div>
            </mat-tab>

            <!-- Tab 5: Documents -->
            <mat-tab label="Documents">
              <div class="tab-content">
                <div class="docs-empty">
                  <mat-icon>folder_open</mat-icon>
                  <p>No documents generated yet for this employee.</p>
                </div>
              </div>
            </mat-tab>

          </mat-tab-group>
        </div>
      } @else {
        <div class="not-found">
          <mat-icon>person_off</mat-icon>
          <h3>Employee not found</h3>
          <p>The employee you're looking for doesn't exist.</p>
          <button mat-flat-button class="btn-primary" [routerLink]="['/increment/employees']">Go Back</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: var(--page-padding); }

    .back-bar { margin-bottom: 16px; }
    .back-btn {
      color: var(--color-text-secondary) !important;
      font-size: 0.875rem !important;
      gap: 4px;
      mat-icon { font-size: 18px !important; width: 18px !important; height: 18px !important; }
    }

    /* Profile Card */
    .profile-card {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 0;
      margin-bottom: 20px;
      flex-wrap: wrap;
      row-gap: 16px;

      @media (max-width: 767px) { padding: 16px; flex-direction: column; align-items: flex-start; }
    }

    .profile-left {
      display: flex;
      align-items: center;
      gap: 16px;
      min-width: 280px;
      flex-shrink: 0;

      @media (max-width: 767px) { min-width: unset; width: 100%; }
    }

    .profile-avatar {
      width: 64px; height: 64px; border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; font-weight: 800; flex-shrink: 0;
    }

    .profile-name-row { display: flex; align-items: center; gap: 10px; margin-bottom: 2px; }
    .profile-name { font-size: 1.2rem; font-weight: 800; color: var(--color-text-primary); margin: 0; }
    .profile-id { font-size: 0.8rem; font-weight: 600; color: #6366f1; margin: 0 0 2px; }
    .profile-desig { font-size: 0.825rem; color: var(--color-text-secondary); margin: 0; }

    .profile-divider {
      width: 1px;
      height: 80px;
      background: var(--color-border);
      margin: 0 28px;
      flex-shrink: 0;

      @media (max-width: 1023px) { display: none; }
    }

    .profile-meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      flex: 1;

      @media (max-width: 1023px) { grid-template-columns: repeat(2, 1fr); gap: 12px; width: 100%; }
      @media (max-width: 479px)  { grid-template-columns: 1fr 1fr; gap: 10px; }
    }

    .profile-meta-item {
      display: flex; align-items: flex-start; gap: 8px;
      mat-icon { font-size: 16px; width: 16px; height: 16px; color: var(--color-primary); margin-top: 2px; flex-shrink: 0; }
    }

    .meta-label { font-size: 0.7rem; color: var(--color-text-muted); margin: 0 0 2px; text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600; }
    .meta-value { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); margin: 0; }
    .ctc-value { color: #7c3aed; }

    /* Tabs Card */
    .tabs-card { overflow: hidden; }
    .detail-tabs { }

    .tab-content { padding: 24px; }

    /* Increment Form */
    .increment-form-card {
      background: #f8f9fc;
      border: 1px solid var(--color-border);
      border-radius: 10px;
      padding: 20px;
      margin-top: 20px;
    }

    .form-section-title {
      display: flex; align-items: center; gap: 8px;
      font-size: 0.95rem; font-weight: 700; color: var(--color-text-primary);
      margin: 0 0 16px;
      mat-icon { font-size: 20px; width: 20px; height: 20px; color: var(--color-primary); }
    }

    .increment-form {
      display: grid;
      grid-template-columns: 1fr 1fr 2fr;
      gap: 12px;
      align-items: start;

      @media (max-width: 767px) { grid-template-columns: 1fr; }

      .full-col { grid-column: 1 / -1; }
    }

    mat-form-field { width: 100%; }

    .form-action { display: flex; justify-content: flex-end; margin-top: 4px; }

    .generate-btn {
      display: flex; align-items: center; gap: 6px;
      mat-icon { font-size: 18px !important; width: 18px !important; height: 18px !important; }
    }

    /* Salary Table */
    .salary-table-card {
      background: white;
      border: 1px solid var(--color-border);
      border-radius: 10px;
      overflow: hidden;
    }

    .salary-table {
      width: 100%;
      border-collapse: collapse;

      th, td { padding: 12px 20px; text-align: left; font-size: 0.875rem; }
      th { background: #f8f9fc; font-size: 0.72rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--color-border); }
      td { border-bottom: 1px solid #f3f4f6; color: var(--color-text-primary); }
    }

    .comp-name { font-weight: 500; }
    .revised-val { font-weight: 600; color: #7c3aed; }
    .changed-row td { background: #faf5ff; }

    .change-badge {
      background: #dcfce7; color: #16a34a;
      padding: 2px 8px; border-radius: 10px;
      font-size: 0.75rem; font-weight: 700;
    }

    .no-change { color: var(--color-text-muted); }

    .total-row {
      background: #f8f9fc;
      td { border-bottom: none; border-top: 2px solid var(--color-border); font-size: 0.9rem; }
    }

    /* Previews */
    .preview-placeholder, .docs-empty {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 60px 24px; text-align: center;
    }

    .preview-icon {
      width: 64px; height: 64px; background: #f5f3ff; border-radius: 16px;
      display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
      mat-icon { font-size: 32px; width: 32px; height: 32px; color: #8b5cf6; }
    }

    .preview-placeholder h3, .docs-empty h3, .docs-empty p { color: var(--color-text-secondary); }
    .preview-placeholder p { margin: 0 0 20px; font-size: 0.875rem; }

    .docs-empty mat-icon { font-size: 40px; width: 40px; height: 40px; color: #d1d5db; margin-bottom: 12px; }

    .no-salary {
      display: flex; align-items: center; gap: 8px;
      color: var(--color-text-muted); font-size: 0.875rem; padding: 20px;
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }

    /* Not Found */
    .not-found {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 80px 24px; text-align: center;
      mat-icon { font-size: 48px; width: 48px; height: 48px; color: #d1d5db; margin-bottom: 16px; }
      h3 { font-size: 1.1rem; font-weight: 700; margin: 0 0 8px; }
      p { color: var(--color-text-secondary); margin: 0 0 20px; }
    }
  `]
})
export class EmployeeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private incrementService = inject(IncrementService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  employee = signal<Employee | null>(null);
  salaryStructure = signal<SalaryStructure | null>(null);
  record = signal<IncrementRecord | undefined>(undefined);

  incrementForm = this.fb.group({
    incrementPct: [10, [Validators.required, Validators.min(0), Validators.max(100)]],
    effectiveDate: ['01 Apr 2026'],
    remarks: ['Good Performance'],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const emp = this.employeeService.getEmployee(id);
    this.employee.set(emp ?? null);

    if (emp) {
      const structure = this.employeeService.getSalaryStructure(emp.employeeId);
      this.salaryStructure.set(structure);

      const rec = this.incrementService.getRecords().find(r => r.employeeId === emp.employeeId);
      this.record.set(rec);
      if (rec) {
        this.incrementForm.patchValue({ incrementPct: rec.incrementPct, remarks: rec.remarks });
      }
    }
  }

  goBack() {
    this.router.navigate(['/increment/employees']);
  }

  generateLetter() {
    this.snackBar.open('Letter & Annexure generated successfully!', 'View', {
      duration: 3500,
      panelClass: ['success-snack'],
    });
    this.router.navigate(['/increment/letters']);
  }
}
