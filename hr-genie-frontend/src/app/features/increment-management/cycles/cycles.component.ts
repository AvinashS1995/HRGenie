import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { IncrementService } from '../../../core/services/increment.service';
import { IncrementCycle, CycleStatus } from '../../../core/models';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CreateCycleDialogComponent } from './create-cycle-dialog.component';

@Component({
  selector: 'app-cycles',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatIconModule, MatButtonModule, MatTabsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTableModule, MatTooltipModule,
    StatusChipComponent, PageHeaderComponent,
  ],
  template: `
    <div class="page-container fade-in-up">
      <app-page-header
        title="Increment Cycles"
        subtitle="Manage annual increment processes and track progress"
      >
        <button mat-flat-button class="btn-primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Create Increment Cycle
        </button>
      </app-page-header>

      <!-- Filters Card -->
      <div class="card filters-card">
        <!-- Tabs -->
        <mat-tab-group
          class="cycles-tabs"
          [selectedIndex]="selectedTabIndex()"
          (selectedIndexChange)="onTabChange($event)"
          animationDuration="150ms"
        >
          <mat-tab label="All Cycles" />
          <mat-tab label="Active" />
          <mat-tab label="Completed" />
          <mat-tab label="Draft" />
        </mat-tab-group>

        <!-- Search + Filter Bar -->
        <div class="filter-bar">
          <mat-form-field appearance="outline" class="search-field">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput [formControl]="searchCtrl" placeholder="Search cycles..." />
          </mat-form-field>
          <mat-form-field appearance="outline" class="year-field">
            <mat-label>Select Year</mat-label>
            <mat-select [formControl]="yearCtrl">
              <mat-option [value]="null">All Years</mat-option>
              <mat-option [value]="2026">2026</mat-option>
              <mat-option [value]="2025">2025</mat-option>
              <mat-option [value]="2024">2024</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Table -->
        <div class="table-wrapper">
          <table mat-table [dataSource]="filteredCycles()" class="cycles-table">

            <ng-container matColumnDef="index">
              <th mat-header-cell *matHeaderCellDef>#</th>
              <td mat-cell *matCellDef="let i = index">{{ i + 1 }}</td>
            </ng-container>

            <ng-container matColumnDef="cycleName">
              <th mat-header-cell *matHeaderCellDef>Cycle Name</th>
              <td mat-cell *matCellDef="let c">
                <div class="cycle-name">
                  <span class="cycle-name__text">{{ c.cycleName }}</span>
                  <span class="cycle-name__type">{{ c.incrementType }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="year">
              <th mat-header-cell *matHeaderCellDef>Year</th>
              <td mat-cell *matCellDef="let c">
                <span class="year-badge">{{ c.year }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="employees">
              <th mat-header-cell *matHeaderCellDef>Employees</th>
              <td mat-cell *matCellDef="let c">
                <div class="emp-count">
                  <mat-icon>people</mat-icon>
                  {{ c.employees }}
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let c">
                <app-status-chip [type]="c.status.toLowerCase()" [label]="c.status" />
              </td>
            </ng-container>

            <ng-container matColumnDef="createdOn">
              <th mat-header-cell *matHeaderCellDef>Created On</th>
              <td mat-cell *matCellDef="let c" class="date-cell">{{ c.createdOn }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let c">
                <div class="action-btns">
                  <button
                    mat-icon-button
                    matTooltip="View Details"
                    class="action-btn view-btn"
                    [routerLink]="['/increment/employees']"
                  >
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    matTooltip="Edit"
                    class="action-btn edit-btn"
                  >
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    matTooltip="Delete"
                    class="action-btn delete-btn"
                    (click)="deleteCycle(c)"
                  >
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

            <!-- Empty Row -->
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" [attr.colspan]="displayedColumns.length">
                <div class="empty-table">
                  <mat-icon>loop</mat-icon>
                  <p>No increment cycles found</p>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Footer -->
        <div class="table-footer">
          <span class="table-count">Showing {{ filteredCycles().length }} of {{ allCycles().length }} cycles</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: var(--page-padding); }

    .filters-card {
      background: var(--color-surface);
      border: var(--card-border);
      border-radius: var(--card-radius);
      overflow: hidden;
    }

    .cycles-tabs {
      border-bottom: 1px solid var(--color-border);
      padding: 0 4px;
    }

    .filter-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px 8px;
      flex-wrap: wrap;
    }

    .search-field { flex: 1; min-width: 200px; }
    .year-field { width: 160px; @media (max-width: 479px) { width: 140px; } }

    mat-form-field { margin-bottom: 0 !important; }

    .table-wrapper { overflow-x: auto; }

    .cycles-table { width: 100%; }

    .cycle-name {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .cycle-name__text {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--color-text-primary);
    }

    .cycle-name__type {
      font-size: 0.72rem;
      color: var(--color-text-muted);
    }

    .year-badge {
      background: #eff6ff;
      color: #3b82f6;
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
    }

    .emp-count {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-primary);

      mat-icon {
        font-size: 15px;
        width: 15px;
        height: 15px;
        color: var(--color-text-muted);
      }
    }

    .date-cell {
      font-size: 0.8rem;
      color: var(--color-text-secondary);
    }

    .action-btns {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .action-btn {
      width: 32px !important;
      height: 32px !important;
      line-height: 32px !important;
      border-radius: 6px !important;

      mat-icon {
        font-size: 17px !important;
        width: 17px !important;
        height: 17px !important;
      }
    }

    .view-btn { color: #6366f1 !important; &:hover { background: #eff6ff !important; } }
    .edit-btn { color: #f59e0b !important; &:hover { background: #fff7ed !important; } }
    .delete-btn { color: #ef4444 !important; &:hover { background: #fef2f2 !important; } }

    .table-footer {
      padding: 12px 20px;
      border-top: 1px solid var(--color-border);
      background: #f8f9fc;
    }

    .table-count {
      font-size: 0.8rem;
      color: var(--color-text-muted);
    }

    .empty-table {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 40px;
      color: var(--color-text-muted);
      font-size: 0.875rem;

      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }
  `]
})
export class CyclesComponent {
  private incrementService = inject(IncrementService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  searchCtrl = new FormControl('');
  yearCtrl = new FormControl<number | null>(null);
  selectedTabIndex = signal(0);

  displayedColumns = ['index', 'cycleName', 'year', 'employees', 'status', 'createdOn', 'actions'];

  private tabStatusMap: (CycleStatus | null)[] = [null, 'Active', 'Completed', 'Draft'];

  allCycles = signal(this.incrementService.getCycles());

  filteredCycles = computed(() => {
    let cycles = this.allCycles();
    const status = this.tabStatusMap[this.selectedTabIndex()];
    const q = this.searchCtrl.value?.toLowerCase() ?? '';
    const year = this.yearCtrl.value;

    if (status) cycles = cycles.filter(c => c.status === status);
    if (q) cycles = cycles.filter(c => c.cycleName.toLowerCase().includes(q) || c.incrementType.toLowerCase().includes(q));
    if (year) cycles = cycles.filter(c => c.year === year);
    return cycles;
  });

  onTabChange(idx: number) {
    this.selectedTabIndex.set(idx);
  }

  openCreateDialog() {
    const ref = this.dialog.open(CreateCycleDialogComponent, {
      panelClass: 'hr-dialog',
      disableClose: false,
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.incrementService.addCycle(result);
        this.allCycles.set(this.incrementService.getCycles());
        this.snackBar.open('Increment cycle created successfully!', 'Close', { duration: 3000 });
      }
    });
  }

  deleteCycle(cycle: IncrementCycle) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Increment Cycle',
        message: `Are you sure you want to delete "${cycle.cycleName}"? This action cannot be undone.`,
        confirmLabel: 'Delete',
        type: 'danger',
      }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.incrementService.deleteCycle(cycle.id);
        this.allCycles.set(this.incrementService.getCycles());
        this.snackBar.open('Cycle deleted.', 'Close', { duration: 2500 });
      }
    });
  }
}
