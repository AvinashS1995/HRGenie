import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { IncrementService } from '../../../core/services/increment.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatIconModule, MatButtonModule, MatTableModule,
    MatTabsModule, MatTooltipModule,
    PageHeaderComponent, StatusChipComponent,
  ],
  template: `
    <div class="page-container fade-in-up">
      <app-page-header
        title="Validate Increment Data"
        subtitle="AI-powered validation to check data accuracy and find anomalies"
      >
        <button mat-button class="btn-secondary" [routerLink]="['/increment/upload']">
          <mat-icon>refresh</mat-icon>
          Re-upload
        </button>
      </app-page-header>

      <!-- KPI Mini Cards -->
      <div class="validation-kpis">
        <div class="vkpi-card">
          <div class="vkpi-icon" style="background:#eff6ff;">
            <mat-icon style="color:#3b82f6;">people_alt</mat-icon>
          </div>
          <div>
            <p class="vkpi-val">{{ result.totalRecords }}</p>
            <p class="vkpi-label">Total Records</p>
          </div>
        </div>
        <div class="vkpi-card">
          <div class="vkpi-icon" style="background:#f0fdf4;">
            <mat-icon style="color:#10b981;">check_circle</mat-icon>
          </div>
          <div>
            <p class="vkpi-val">
              {{ result.validRecords }}
              <span class="vkpi-pct">({{ pctValid() }}%)</span>
            </p>
            <p class="vkpi-label">Valid Records</p>
          </div>
        </div>
        <div class="vkpi-card">
          <div class="vkpi-icon" style="background:#fef2f2;">
            <mat-icon style="color:#ef4444;">warning</mat-icon>
          </div>
          <div>
            <p class="vkpi-val" style="color:#ef4444;">
              {{ result.issueCount }}
              <span class="vkpi-pct">({{ pctIssues() }}%)</span>
            </p>
            <p class="vkpi-label">Issues Found</p>
          </div>
        </div>
        <div class="vkpi-card">
          <div class="vkpi-icon" style="background:#f5f3ff;">
            <mat-icon style="color:#8b5cf6;">speed</mat-icon>
          </div>
          <div>
            <p class="vkpi-val">{{ result.processingTime }}</p>
            <p class="vkpi-label">Processing Time</p>
          </div>
        </div>
      </div>

      <!-- Filter Tabs + Table Card -->
      <div class="card" style="overflow:hidden; margin-bottom:20px;">
        <!-- Filter Bar -->
        <div class="filter-row">
          <div class="filter-tabs">
            @for (t of filterTabs; track t.label) {
              <button
                class="filter-tab"
                [class.active]="activeFilter() === t.value"
                (click)="activeFilter.set(t.value)"
              >
                {{ t.label }}
                <span class="filter-tab-count" [class]="'fc-' + t.value">{{ t.count }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Table -->
        <div style="overflow-x:auto;">
          <table mat-table [dataSource]="filteredRecords()" style="width:100%;">

            <ng-container matColumnDef="employeeId">
              <th mat-header-cell *matHeaderCellDef>Employee ID</th>
              <td mat-cell *matCellDef="let r">
                <a class="emp-link" [routerLink]="['/increment/employee', r.employeeId]">{{ r.employeeId }}</a>
              </td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Employee Name</th>
              <td mat-cell *matCellDef="let r">
                <div style="display:flex;align-items:center;gap:8px;">
                  <div class="mini-avatar">{{ r.employeeName[0] }}</div>
                  <span class="emp-name-cell">{{ r.employeeName }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="currentCTC">
              <th mat-header-cell *matHeaderCellDef>Current CTC</th>
              <td mat-cell *matCellDef="let r" class="ctc-cell">₹{{ r.currentCTC | number }}</td>
            </ng-container>

            <ng-container matColumnDef="incrementPct">
              <th mat-header-cell *matHeaderCellDef>Increment %</th>
              <td mat-cell *matCellDef="let r">
                <span
                  class="pct-pill"
                  [class.pct-high]="r.incrementPct > 20"
                  [class.pct-zero]="r.incrementPct === 0"
                >{{ r.incrementPct }}%</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="revisedCTC">
              <th mat-header-cell *matHeaderCellDef>Revised CTC</th>
              <td mat-cell *matCellDef="let r" class="revised-cell">₹{{ r.revisedCTC | number }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let r">
                <app-status-chip [type]="r.status === 'Needs Review' ? 'review' : r.status.toLowerCase()" [label]="r.status" />
              </td>
            </ng-container>

            <ng-container matColumnDef="remarks">
              <th mat-header-cell *matHeaderCellDef>Remarks</th>
              <td mat-cell *matCellDef="let r">
                @if (r.remarks) {
                  <span class="remark-tag" [class.remark-error]="r.status === 'Issue'">
                    <mat-icon>{{ r.status === 'Issue' ? 'error_outline' : 'info_outline' }}</mat-icon>
                    {{ r.remarks }}
                  </span>
                }
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let r">
                <button mat-icon-button matTooltip="View Employee" style="color:#6366f1;"
                  [routerLink]="['/increment/employee', r.employeeId]">
                  <mat-icon>visibility</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols;"></tr>
          </table>
        </div>

        <div class="table-footer">
          <span>Showing {{ filteredRecords().length }} records</span>
        </div>
      </div>

      <!-- AI Validation Summary -->
      <div class="ai-summary-card">
        <div class="ai-summary-header">
          <div class="ai-summary-icon">
            <mat-icon>warning_amber</mat-icon>
          </div>
          <div>
            <h3 class="ai-summary-title">Potential Issues Found</h3>
            <p class="ai-summary-sub">AI detected the following anomalies in your data</p>
          </div>
          <button mat-flat-button class="btn-primary fix-btn" [routerLink]="['/increment/employees']">
            <mat-icon>build</mat-icon>
            Review & Fix Issues
          </button>
        </div>
        <div class="ai-issues">
          @for (issue of result.issues; track issue.description) {
            <div class="ai-issue-item" [class.ai-issue--error]="issue.severity === 'error'" [class.ai-issue--warn]="issue.severity === 'warning'">
              <mat-icon class="issue-icon">{{ issue.severity === 'error' ? 'error_outline' : 'warning_amber' }}</mat-icon>
              <span>{{ issue.description }}</span>
              <span class="issue-count">{{ issue.affectedCount }} affected</span>
            </div>
          }
        </div>
      </div>

      <!-- Bottom Actions -->
      <div class="bottom-actions">
        <button mat-button class="btn-secondary" [routerLink]="['/increment/upload']">
          <mat-icon>arrow_back</mat-icon>
          Back to Upload
        </button>
        <button mat-flat-button class="btn-primary" [routerLink]="['/increment/employees']">
          Proceed to Review
          <mat-icon>arrow_forward</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: var(--page-padding); }

    .validation-kpis {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 20px;

      @media (max-width: 1023px) { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      @media (max-width: 479px)  { grid-template-columns: repeat(2, 1fr); gap: 8px; }
    }

    .vkpi-card {
      background: white;
      border: var(--card-border);
      border-radius: var(--card-radius);
      padding: 18px;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .vkpi-icon {
      width: 44px; height: 44px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      mat-icon { font-size: 22px; width: 22px; height: 22px; }
    }

    .vkpi-val {
      font-size: 1.5rem; font-weight: 800; color: var(--color-text-primary);
      letter-spacing: -0.02em; margin: 0 0 2px; line-height: 1;
    }

    .vkpi-pct { font-size: 0.8rem; font-weight: 500; color: var(--color-text-muted); }

    .vkpi-label {
      font-size: 0.78rem; color: var(--color-text-secondary); margin: 0; font-weight: 500;
    }

    .filter-row {
      padding: 0 16px;
      border-bottom: 1px solid var(--color-border);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .filter-tabs {
      display: flex;
      gap: 0;
      min-width: max-content;
    }

    .filter-tab {
      display: flex; align-items: center; gap: 6px;
      padding: 12px 16px;
      border: none; background: transparent; cursor: pointer;
      font-size: 0.875rem; font-weight: 500;
      color: var(--color-text-secondary);
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      transition: all 0.15s;
      white-space: nowrap;

      &:hover { color: var(--color-primary); }
      &.active { color: var(--color-primary); border-bottom-color: var(--color-primary); font-weight: 600; }
    }

    .filter-tab-count {
      padding: 1px 7px; border-radius: 10px;
      font-size: 0.7rem; font-weight: 700;
      background: #f3f4f6; color: #6b7280;
    }

    .fc-valid { background: #dcfce7 !important; color: #16a34a !important; }
    .fc-issue { background: #fef2f2 !important; color: #dc2626 !important; }
    .fc-review { background: #fff7ed !important; color: #d97706 !important; }

    .emp-link { color: #6366f1; font-weight: 600; font-size: 0.8rem; text-decoration: none; }
    .emp-link:hover { text-decoration: underline; }

    .mini-avatar {
      width: 28px; height: 28px; border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 0.7rem; font-weight: 700; flex-shrink: 0;
    }

    .emp-name-cell { font-size: 0.875rem; font-weight: 500; color: var(--color-text-primary); }
    .ctc-cell { font-size: 0.875rem; color: var(--color-text-secondary); }
    .revised-cell { font-size: 0.875rem; font-weight: 600; color: #7c3aed; }

    .pct-pill {
      background: #f0fdf4; color: #16a34a;
      padding: 2px 10px; border-radius: 12px;
      font-size: 0.8rem; font-weight: 700;
    }

    .pct-high { background: #fff7ed !important; color: #c2410c !important; }
    .pct-zero { background: #fef2f2 !important; color: #dc2626 !important; }

    .remark-tag {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 0.75rem; color: #059669; background: #f0fdf4;
      padding: 2px 8px; border-radius: 6px;
      mat-icon { font-size: 13px; width: 13px; height: 13px; }
    }

    .remark-error { background: #fef2f2 !important; color: #dc2626 !important; }

    .table-footer {
      padding: 10px 20px;
      border-top: 1px solid var(--color-border);
      background: #f8f9fc;
      font-size: 0.8rem;
      color: var(--color-text-muted);
    }

    /* AI Summary */
    .ai-summary-card {
      background: linear-gradient(135deg, #fff7ed 0%, #fffbeb 100%);
      border: 1px solid #fed7aa;
      border-radius: var(--card-radius);
      padding: 20px;
      margin-bottom: 20px;
    }

    .ai-summary-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .ai-summary-icon {
      width: 40px; height: 40px; background: #fff7ed; border: 1px solid #fed7aa;
      border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      mat-icon { color: #f59e0b; font-size: 22px; width: 22px; height: 22px; }
    }

    .ai-summary-title { font-size: 1rem; font-weight: 700; color: #92400e; margin: 0 0 2px; }
    .ai-summary-sub { font-size: 0.78rem; color: #a16207; margin: 0; }
    .fix-btn { margin-left: auto !important; white-space: nowrap; }

    .ai-issues { display: flex; flex-direction: column; gap: 8px; }

    .ai-issue-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; border-radius: 8px;
      font-size: 0.875rem;

      &.ai-issue--error { background: #fef2f2; color: #dc2626; .issue-icon { color: #ef4444; } }
      &.ai-issue--warn { background: #fffbeb; color: #92400e; .issue-icon { color: #f59e0b; } }
    }

    .issue-icon { font-size: 18px !important; width: 18px !important; height: 18px !important; flex-shrink: 0; }

    .issue-count {
      margin-left: auto; font-size: 0.72rem; font-weight: 700;
      padding: 2px 8px; border-radius: 10px;
      background: rgba(0,0,0,0.06);
    }

    .bottom-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 4px;
      gap: 10px;

      @media (max-width: 479px) {
        flex-direction: column-reverse;
        button { width: 100% !important; }
      }
    }
  `]
})
export class ValidationComponent {
  private incrementService = inject(IncrementService);

  result = this.incrementService.getValidationResult();
  activeFilter = signal<string>('all');

  cols = ['employeeId', 'name', 'currentCTC', 'incrementPct', 'revisedCTC', 'status', 'remarks', 'actions'];

  pctValid = () => Math.round((this.result.validRecords / this.result.totalRecords) * 100);
  pctIssues = () => Math.round((this.result.issueCount / this.result.totalRecords) * 100);

  filterTabs = [
    { label: 'All Records', value: 'all', count: this.result.records.length },
    { label: 'Valid', value: 'valid', count: this.result.records.filter(r => r.status === 'Valid').length },
    { label: 'Issues', value: 'issue', count: this.result.records.filter(r => r.status === 'Issue').length },
    { label: 'Needs Review', value: 'review', count: this.result.records.filter(r => r.status === 'Needs Review').length },
  ];

  filteredRecords = computed(() => {
    const f = this.activeFilter();
    if (f === 'all') return this.result.records;
    if (f === 'valid') return this.result.records.filter(r => r.status === 'Valid');
    if (f === 'issue') return this.result.records.filter(r => r.status === 'Issue');
    if (f === 'review') return this.result.records.filter(r => r.status === 'Needs Review');
    return this.result.records;
  });
}
