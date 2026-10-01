import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ApprovalService } from '../../core/services/approval.service';
import { ApprovalRequest, ApprovalStatus } from '../../core/models';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusChipComponent } from '../../shared/components/status-chip/status-chip.component';
import { ApprovalTimelineComponent } from '../../shared/components/approval-timeline/approval-timeline.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatIconModule, MatButtonModule, MatTabsModule, MatTableModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDialogModule, MatTooltipModule,
    PageHeaderComponent, StatusChipComponent, ApprovalTimelineComponent,
  ],
  template: `
    <div class="page-container fade-in-up">
      <app-page-header
        title="Increment Approvals"
        subtitle="Multi-level approval process for increment letters"
      >
        <div class="header-stats">
          <div class="hstat pending-stat">
            <span class="hstat-val">{{ pendingCount() }}</span>
            <span class="hstat-label">Pending</span>
          </div>
          <div class="hstat approved-stat">
            <span class="hstat-val">{{ approvedCount() }}</span>
            <span class="hstat-label">Approved</span>
          </div>
          <div class="hstat rejected-stat">
            <span class="hstat-val">{{ rejectedCount() }}</span>
            <span class="hstat-label">Rejected</span>
          </div>
        </div>
      </app-page-header>

      @if (!selectedApproval()) {
        <!-- List View -->
        <div class="card" style="overflow:hidden;">
          <!-- Tabs -->
          <mat-tab-group
            [selectedIndex]="tabIndex()"
            (selectedIndexChange)="tabIndex.set($event)"
            animationDuration="150ms"
          >
            <mat-tab [label]="'Pending for Approval (' + pendingCount() + ')'"/>
            <mat-tab [label]="'Approved (' + approvedCount() + ')'"/>
            <mat-tab [label]="'Rejected (' + rejectedCount() + ')'"/>
            <mat-tab label="All"/>
          </mat-tab-group>

          <!-- Filters -->
          <div class="filters-row">
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>All Departments</mat-label>
              <mat-select>
                <mat-option value="">All Departments</mat-option>
                <mat-option value="Sales">Sales</mat-option>
                <mat-option value="IT">IT</mat-option>
                <mat-option value="HR">HR</mat-option>
                <mat-option value="Marketing">Marketing</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>All Designations</mat-label>
              <mat-select><mat-option value="">All Designations</mat-option></mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Select Manager</mat-label>
              <mat-select><mat-option value="">All Managers</mat-option></mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="search-field">
              <mat-icon matPrefix>search</mat-icon>
              <input matInput placeholder="Search employees..." />
            </mat-form-field>
          </div>

          <!-- Table -->
          <div style="overflow-x:auto;">
            <table mat-table [dataSource]="filteredApprovals()" style="width:100%;">

              <ng-container matColumnDef="employee">
                <th mat-header-cell *matHeaderCellDef>#&nbsp;&nbsp;Employee</th>
                <td mat-cell *matCellDef="let a; let i = index">
                  <div style="display:flex;align-items:center;gap:12px;">
                    <span class="row-num">{{ i + 1 }}</span>
                    <div class="approval-avatar">{{ a.employeeName[0] }}</div>
                    <div>
                      <p class="emp-name-cell">{{ a.employeeName }}</p>
                      <p class="emp-dept-cell">{{ a.department }}</p>
                    </div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="designation">
                <th mat-header-cell *matHeaderCellDef>Designation</th>
                <td mat-cell *matCellDef="let a" class="desig-cell">{{ a.designation }}</td>
              </ng-container>

              <ng-container matColumnDef="incrementPct">
                <th mat-header-cell *matHeaderCellDef>Increment %</th>
                <td mat-cell *matCellDef="let a">
                  <span class="pct-pill" [class.pct-high]="a.incrementPct > 20">{{ a.incrementPct }}%</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="revisedCTC">
                <th mat-header-cell *matHeaderCellDef>Revised CTC</th>
                <td mat-cell *matCellDef="let a" class="ctc-cell">₹{{ a.revisedCTC | number }}</td>
              </ng-container>

              <ng-container matColumnDef="submittedOn">
                <th mat-header-cell *matHeaderCellDef>Submitted On</th>
                <td mat-cell *matCellDef="let a" class="date-cell">{{ a.submittedOn }}</td>
              </ng-container>

              <ng-container matColumnDef="approver">
                <th mat-header-cell *matHeaderCellDef>Current Approver</th>
                <td mat-cell *matCellDef="let a">
                  <span class="approver-chip">{{ a.currentApprover }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let a">
                  <app-status-chip [type]="a.status.toLowerCase()" [label]="a.status"/>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let a">
                  <div class="action-btns">
                    <button mat-icon-button class="view-btn" matTooltip="View Details" (click)="viewApproval(a)">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    @if (a.status === 'Pending') {
                      <button mat-icon-button class="approve-btn" matTooltip="Approve" (click)="quickApprove(a)">
                        <mat-icon>check_circle</mat-icon>
                      </button>
                      <button mat-icon-button class="reject-btn" matTooltip="Reject" (click)="openRejectDialog(a)">
                        <mat-icon>cancel</mat-icon>
                      </button>
                    }
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="cols"></tr>
              <tr mat-row *matRowDef="let row; columns: cols;" class="clickable-row" (click)="viewApproval(row)"></tr>
            </table>
          </div>

          <div class="table-footer">
            <span>Showing {{ filteredApprovals().length }} approvals</span>
          </div>
        </div>

      } @else {
        <!-- Detail View -->
        <div class="detail-layout">
          <!-- Left: Detail Card -->
          <div class="detail-main">
            <div class="detail-nav">
              <button mat-button class="back-btn" (click)="selectedApproval.set(null)">
                <mat-icon>arrow_back</mat-icon>
                Back to List
              </button>
            </div>

            <div class="card detail-card">
              <!-- Employee Profile -->
              <div class="detail-profile">
                <div class="approval-avatar large">{{ selectedApproval()!.employeeName[0] }}</div>
                <div>
                  <h2 class="detail-emp-name">{{ selectedApproval()!.employeeName }}</h2>
                  <p class="detail-emp-info">{{ selectedApproval()!.designation }} · {{ selectedApproval()!.department }}</p>
                  <p class="detail-emp-id">Employee ID: {{ selectedApproval()!.employeeId }}</p>
                </div>
                <div style="margin-left:auto;">
                  <app-status-chip [type]="selectedApproval()!.status.toLowerCase()" [label]="selectedApproval()!.status"/>
                </div>
              </div>

              <div class="detail-divider"></div>

              <!-- Salary Comparison Row -->
              <div class="detail-salary-row">
                <div class="salary-block">
                  <p class="salary-block-label">Current CTC</p>
                  <p class="salary-block-val">₹6,20,000</p>
                </div>
                <div class="salary-arrow-box">
                  <mat-icon>arrow_forward</mat-icon>
                  <span class="increment-badge">+{{ selectedApproval()!.incrementPct }}%</span>
                </div>
                <div class="salary-block revised">
                  <p class="salary-block-label">Revised CTC</p>
                  <p class="salary-block-val">₹{{ selectedApproval()!.revisedCTC | number }}</p>
                </div>
                <div class="salary-block">
                  <p class="salary-block-label">Submitted On</p>
                  <p class="salary-block-val small">{{ selectedApproval()!.submittedOn }}</p>
                </div>
                <div class="salary-block">
                  <p class="salary-block-label">Current Approver</p>
                  <p class="salary-block-val small">{{ selectedApproval()!.currentApprover }}</p>
                </div>
              </div>
            </div>

            <!-- AI Validation Result -->
            <div class="ai-result-card">
              <div class="ai-badge"><mat-icon>auto_awesome</mat-icon>AI Validation Result</div>
              <p class="ai-result-text">This increment has been validated by AI. No anomalies detected. Increment percentage is within the approved policy range.</p>
              <div class="ai-checks">
                <span class="ai-check"><mat-icon>check_circle</mat-icon>Increment within policy</span>
                <span class="ai-check"><mat-icon>check_circle</mat-icon>CTC calculation correct</span>
                <span class="ai-check"><mat-icon>check_circle</mat-icon>No missing data</span>
              </div>
            </div>

            <!-- Rejection Reason -->
            @if (selectedApproval()!.status === 'Rejected' && selectedApproval()!.rejectionReason) {
              <div class="rejection-card">
                <mat-icon>cancel</mat-icon>
                <div>
                  <p class="rejection-label">Rejection Reason</p>
                  <p class="rejection-text">{{ selectedApproval()!.rejectionReason }}</p>
                </div>
              </div>
            }

            <!-- Approve/Reject Actions -->
            @if (selectedApproval()!.status === 'Pending') {
              <div class="detail-actions">
                <button mat-button class="reject-outline-btn" (click)="openRejectDialog(selectedApproval()!)">
                  <mat-icon>cancel</mat-icon>
                  Reject
                </button>
                <button mat-flat-button class="approve-solid-btn" (click)="quickApprove(selectedApproval()!)">
                  <mat-icon>check_circle</mat-icon>
                  Approve
                </button>
              </div>
            }
          </div>

          <!-- Right: Timeline -->
          <div class="detail-side">
            <div class="card timeline-card">
              <h3 class="timeline-title">
                <mat-icon>timeline</mat-icon>
                Approval Timeline
              </h3>
              <app-approval-timeline [steps]="selectedApproval()!.timeline"/>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: var(--page-padding); }

    .header-stats { display: flex; gap: 8px; }
    .hstat {
      display: flex; flex-direction: column; align-items: center;
      padding: 6px 14px; border-radius: 8px; min-width: 60px;
      background: #f3f4f6;
    }
    .pending-stat { background: #fef9c3; }
    .approved-stat { background: #dcfce7; }
    .rejected-stat { background: #fef2f2; }
    .hstat-val { font-size: 1rem; font-weight: 800; color: var(--color-text-primary); line-height: 1.2; }
    .hstat-label { font-size: 0.65rem; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.04em; }

    .filters-row {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px 4px;
      border-bottom: 1px solid var(--color-border); flex-wrap: wrap;
    }

    .filter-field {
      width: 160px;
      @media (max-width: 767px) { width: 140px; }
    }

    .search-field {
      flex: 1; min-width: 180px;
      @media (max-width: 479px) { min-width: 100%; }
    }

    .row-num { font-size: 0.75rem; font-weight: 600; color: var(--color-text-muted); min-width: 20px; }

    .approval-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; font-weight: 700; flex-shrink: 0;
      &.large { width: 52px; height: 52px; font-size: 1.2rem; }
    }

    .emp-name-cell { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); margin: 0 0 1px; }
    .emp-dept-cell { font-size: 0.72rem; color: var(--color-text-muted); margin: 0; }
    .desig-cell { font-size: 0.8rem; color: var(--color-text-secondary); }
    .ctc-cell { font-size: 0.875rem; font-weight: 600; color: #7c3aed; }
    .date-cell { font-size: 0.8rem; color: var(--color-text-secondary); }

    .pct-pill {
      background: #f0fdf4; color: #16a34a;
      padding: 2px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 700;
    }
    .pct-high { background: #fff7ed !important; color: #c2410c !important; }

    .approver-chip {
      background: #f5f3ff; color: #6d28d9;
      padding: 3px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600;
    }

    .action-btns { display: flex; align-items: center; gap: 2px; }

    .view-btn { color: #6366f1 !important; }
    .approve-btn { color: #10b981 !important; }
    .reject-btn { color: #ef4444 !important; }
    .view-btn:hover { background: #eff6ff !important; }
    .approve-btn:hover { background: #f0fdf4 !important; }
    .reject-btn:hover { background: #fef2f2 !important; }

    .clickable-row { cursor: pointer; }
    .clickable-row:hover td { background: #fafafa; }

    .table-footer {
      padding: 10px 20px; border-top: 1px solid var(--color-border);
      background: #f8f9fc; font-size: 0.8rem; color: var(--color-text-muted);
    }

    /* Detail View */
    .detail-layout {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 16px;
      align-items: start;

      @media (max-width: 1023px) { grid-template-columns: 1fr; }
    }
    .detail-nav { margin-bottom: 12px; }

    .back-btn {
      color: var(--color-text-secondary) !important; font-size: 0.875rem !important;
      mat-icon { font-size: 18px !important; width: 18px !important; height: 18px !important; }
    }

    .detail-card { padding: 24px; }

    .detail-profile {
      display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
    }

    .detail-emp-name { font-size: 1.1rem; font-weight: 800; color: var(--color-text-primary); margin: 0 0 2px; }
    .detail-emp-info { font-size: 0.8rem; color: var(--color-text-secondary); margin: 0 0 2px; }
    .detail-emp-id { font-size: 0.75rem; color: #6366f1; font-weight: 600; margin: 0; }

    .detail-divider { height: 1px; background: var(--color-border); margin-bottom: 20px; }

    .detail-salary-row {
      display: flex; align-items: center; gap: 20px; flex-wrap: wrap;

      @media (max-width: 479px) { gap: 14px; }
    }

    .salary-block { flex: 1; min-width: 100px; }
    .salary-block.revised .salary-block-val { color: #7c3aed; }
    .salary-block-label { font-size: 0.7rem; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 3px; }
    .salary-block-val { font-size: 1rem; font-weight: 800; color: var(--color-text-primary); margin: 0; }
    .salary-block-val.small { font-size: 0.875rem; }

    .salary-arrow-box {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      mat-icon { color: #7c3aed; font-size: 20px; width: 20px; height: 20px; }
    }

    .increment-badge {
      background: #dcfce7; color: #16a34a; padding: 1px 8px;
      border-radius: 10px; font-size: 0.72rem; font-weight: 700;
    }

    /* AI Result Card */
    .ai-result-card {
      background: linear-gradient(135deg, #faf5ff, #f0f9ff);
      border: 1px solid #e9d5ff; border-radius: 10px;
      padding: 16px; margin: 14px 0;
    }

    .ai-badge {
      display: flex; align-items: center; gap: 6px;
      font-size: 0.82rem; font-weight: 700; color: #6d28d9; margin-bottom: 8px;
      mat-icon { font-size: 16px; width: 16px; height: 16px; color: #8b5cf6; }
    }

    .ai-result-text { font-size: 0.82rem; color: var(--color-text-secondary); margin: 0 0 10px; }

    .ai-checks { display: flex; gap: 16px; flex-wrap: wrap; }
    .ai-check {
      display: flex; align-items: center; gap: 4px;
      font-size: 0.78rem; color: #059669;
      mat-icon { font-size: 14px; width: 14px; height: 14px; color: #10b981; }
    }

    /* Rejection Card */
    .rejection-card {
      display: flex; align-items: flex-start; gap: 10px;
      background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px;
      padding: 14px 16px; margin: 14px 0;
      mat-icon { color: #ef4444; flex-shrink: 0; }
    }
    .rejection-label { font-size: 0.75rem; font-weight: 700; color: #dc2626; margin: 0 0 3px; text-transform: uppercase; }
    .rejection-text { font-size: 0.875rem; color: #7f1d1d; margin: 0; }

    /* Detail Actions */
    .detail-actions {
      display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px;
    }

    .reject-outline-btn {
      border: 1px solid #ef4444 !important; color: #ef4444 !important;
      border-radius: 8px !important; padding: 0 20px !important;
      mat-icon { font-size: 18px !important; width: 18px !important; height: 18px !important; }
    }

    .approve-solid-btn {
      background: #10b981 !important; color: white !important;
      border-radius: 8px !important; padding: 0 20px !important;
      mat-icon { font-size: 18px !important; width: 18px !important; height: 18px !important; }
    }

    /* Timeline Card */
    .timeline-card { padding: 20px; }
    .timeline-title {
      display: flex; align-items: center; gap: 8px;
      font-size: 0.875rem; font-weight: 700; color: var(--color-text-primary); margin: 0 0 20px;
      mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--color-primary); }
    }
  `]
})
export class ApprovalsComponent {
  private approvalService = inject(ApprovalService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  tabIndex = signal(0);
  selectedApproval = signal<ApprovalRequest | null>(null);

  private _all = signal(this.approvalService.getApprovals());

  cols = ['employee', 'designation', 'incrementPct', 'revisedCTC', 'submittedOn', 'approver', 'status', 'actions'];

  pendingCount = computed(() => this._all().filter(a => a.status === 'Pending').length);
  approvedCount = computed(() => this._all().filter(a => a.status === 'Approved').length);
  rejectedCount = computed(() => this._all().filter(a => a.status === 'Rejected').length);

  filteredApprovals = computed(() => {
    const tab = this.tabIndex();
    const all = this._all();
    if (tab === 0) return all.filter(a => a.status === 'Pending');
    if (tab === 1) return all.filter(a => a.status === 'Approved');
    if (tab === 2) return all.filter(a => a.status === 'Rejected');
    return all;
  });

  viewApproval(a: ApprovalRequest) {
    this.selectedApproval.set(a);
  }

  quickApprove(a: ApprovalRequest) {
    this.approvalService.approve(a.id);
    this._all.set(this.approvalService.getApprovals());
    this.selectedApproval.set(null);
    this.snackBar.open(`${a.employeeName}'s increment approved!`, 'Close', { duration: 3000 });
  }

  openRejectDialog(a: ApprovalRequest) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Reject Increment',
        message: `Please confirm rejection for ${a.employeeName}. This action will notify the HR team.`,
        confirmLabel: 'Reject',
        cancelLabel: 'Cancel',
        type: 'danger',
      }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.approvalService.reject(a.id, 'Rejected by approver');
        this._all.set(this.approvalService.getApprovals());
        this.selectedApproval.set(null);
        this.snackBar.open('Increment rejected.', 'Close', { duration: 2500 });
      }
    });
  }
}
