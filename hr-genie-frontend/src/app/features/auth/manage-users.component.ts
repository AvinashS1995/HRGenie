import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { AuthService, HRUser } from '../../core/services/auth.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { StatusChipComponent } from '../../shared/components/status-chip/status-chip.component';

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatButtonModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatIconModule,
  ],
  template: `
    <div class="dlg-wrap">
      <div class="dlg-hdr">
        <div class="dlg-icon"><mat-icon>person_add</mat-icon></div>
        <div>
          <h2 class="dlg-title">Create HR User</h2>
          <p class="dlg-sub">Add a new user to HRGenie</p>
        </div>
        <button mat-icon-button style="margin-left:auto;" (click)="ref.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="dlg-body">
        <div class="dlg-grid">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="name" placeholder="e.g. Rahul Sharma" />
            <mat-error>Required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Email Address</mat-label>
            <input matInput formControlName="email" type="email" placeholder="user@company.com" />
            <mat-error>Valid email required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" [type]="show() ? 'text' : 'password'" placeholder="Min 6 characters" />
            <button type="button" mat-icon-button matSuffix (click)="toggleShow()">
              <mat-icon>{{ show() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error>Min 6 characters</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Role</mat-label>
            <mat-select formControlName="role">
              <mat-option value="HR Admin">HR Admin</mat-option>
              <mat-option value="HR Manager">HR Manager</mat-option>
              <mat-option value="Approver">Approver</mat-option>
              <mat-option value="Employee">Employee</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Department</mat-label>
            <mat-select formControlName="department">
              @for (d of depts; track d) { <mat-option [value]="d">{{ d }}</mat-option> }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="Active">Active</mat-option>
              <mat-option value="Inactive">Inactive</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="dlg-actions">
          <button type="button" mat-button class="btn-secondary" (click)="ref.close()">Cancel</button>
          <button type="submit" mat-flat-button class="btn-primary" [disabled]="form.invalid">
            <mat-icon>person_add</mat-icon>
            Create User
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dlg-wrap { width: 520px; max-width: 95vw; }
    .dlg-hdr {
      display: flex; align-items: center; gap: 12px;
      padding: 20px 20px 16px; border-bottom: 1px solid var(--color-border);
    }
    .dlg-icon {
      width: 38px; height: 38px; background: #f5f3ff; border-radius: 9px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      mat-icon { color: #7c3aed; font-size: 20px; width: 20px; height: 20px; }
    }
    .dlg-title { font-size: 1rem; font-weight: 700; color: var(--color-text-primary); margin: 0 0 1px; }
    .dlg-sub   { font-size: 0.75rem; color: var(--color-text-muted); margin: 0; }
    .dlg-body  { padding: 16px 20px 20px; }
    .dlg-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14px; }
    .full      { grid-column: 1 / -1; }
    mat-form-field { width: 100%; }
    .dlg-actions {
      display: flex; justify-content: flex-end; gap: 10px;
      margin-top: 12px; padding-top: 14px; border-top: 1px solid var(--color-border);
    }
  `]
})
export class CreateUserDialogComponent {
  readonly ref = inject(MatDialogRef<CreateUserDialogComponent>);
  private fb   = inject(FormBuilder);
  show = signal(false);

  depts = ['Human Resources', 'Sales', 'Marketing', 'IT', 'Finance', 'Operations'];

  form = this.fb.group({
    name:       ['', Validators.required],
    email:      ['', [Validators.required, Validators.email]],
    password:   ['', [Validators.required, Validators.minLength(6)]],
    role:       ['HR Manager', Validators.required],
    department: ['Human Resources', Validators.required],
    status:     ['Active', Validators.required],
  });

  submit() {
    if (this.form.valid) this.ref.close(this.form.value);
  }
  toggleShow() { this.show.set(!this.show()); }
}

// ─── Manage Users Component ───────────────────────────────────────────────────
@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule, MatIconModule, MatButtonModule,
    MatTableModule, MatTooltipModule, StatusChipComponent,
  ],
  template: `
    <div>
      <div class="mu-header">
        <div>
          <h3 class="mu-title">HR Users</h3>
          <p class="mu-sub">Manage who can access HRGenie and their roles</p>
        </div>
        <button mat-flat-button class="btn-primary" (click)="openCreate()">
          <mat-icon>person_add</mat-icon>
          Create User
        </button>
      </div>

      <div style="overflow-x:auto;">
        <table mat-table [dataSource]="authService.allUsers()" style="width:100%;">

          <ng-container matColumnDef="user">
            <th mat-header-cell *matHeaderCellDef>User</th>
            <td mat-cell *matCellDef="let u">
              <div class="u-cell">
                <div class="u-av" [class.u-av--admin]="u.role === 'HR Admin'">{{ u.name[0] }}</div>
                <div>
                  <p class="u-name">{{ u.name }}</p>
                  <p class="u-email">{{ u.email }}</p>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Role</th>
            <td mat-cell *matCellDef="let u">
              <span class="role-chip" [class]="'role-' + roleSlug(u.role)">{{ u.role }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="department">
            <th mat-header-cell *matHeaderCellDef>Department</th>
            <td mat-cell *matCellDef="let u" class="dept-cell">{{ u.department }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let u">
              <app-status-chip [type]="u.status.toLowerCase()" [label]="u.status" />
            </td>
          </ng-container>

          <ng-container matColumnDef="createdOn">
            <th mat-header-cell *matHeaderCellDef>Created</th>
            <td mat-cell *matCellDef="let u" class="date-cell">{{ u.createdOn }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let u">
              <button mat-icon-button
                [matTooltip]="u.status === 'Active' ? 'Deactivate' : 'Activate'"
                [style.color]="u.status === 'Active' ? '#f59e0b' : '#10b981'"
                (click)="toggleStatus(u)"
                [disabled]="u.id === currentUserId()">
                <mat-icon>{{ u.status === 'Active' ? 'block' : 'check_circle' }}</mat-icon>
              </button>
              <button mat-icon-button matTooltip="Delete User"
                style="color:#ef4444;"
                (click)="deleteUser(u)"
                [disabled]="u.id === currentUserId()">
                <mat-icon>delete_outline</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
      </div>

      <div class="mu-footer">
        <span>{{ authService.allUsers().length }} users · Admins cannot be deleted while logged in</span>
      </div>
    </div>
  `,
  styles: [`
    .mu-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 12px; margin-bottom: 16px; flex-wrap: wrap;
    }
    .mu-title { font-size: 0.95rem; font-weight: 700; color: var(--color-text-primary); margin: 0 0 2px; }
    .mu-sub   { font-size: 0.78rem; color: var(--color-text-muted); margin: 0; }

    .u-cell { display: flex; align-items: center; gap: 10px; }
    .u-av {
      width: 32px; height: 32px; border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; font-weight: 700; flex-shrink: 0;
      &--admin { background: linear-gradient(135deg, #7c3aed, #a78bfa); }
    }
    .u-name  { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); margin: 0 0 1px; }
    .u-email { font-size: 0.72rem; color: var(--color-text-muted); margin: 0; }

    .role-chip {
      font-size: 0.72rem; font-weight: 700; padding: 2px 9px;
      border-radius: 12px; white-space: nowrap;
    }
    .role-hr-admin    { background: #f5f3ff; color: #6d28d9; }
    .role-hr-manager  { background: #eff6ff; color: #2563eb; }
    .role-approver    { background: #f0fdf4; color: #16a34a; }
    .role-employee    { background: #f3f4f6; color: #6b7280; }

    .dept-cell { font-size: 0.82rem; color: var(--color-text-secondary); }
    .date-cell { font-size: 0.78rem; color: var(--color-text-muted); white-space: nowrap; }

    .mu-footer {
      padding: 10px 0;
      font-size: 0.75rem; color: var(--color-text-muted);
    }
  `]
})
export class ManageUsersComponent {
  readonly authService = inject(AuthService);
  private dialog   = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  cols = ['user', 'role', 'department', 'status', 'createdOn', 'actions'];
  currentUserId = () => this.authService.user()?.id;

  roleSlug(role: string) {
    return role.toLowerCase().replace(/ /g, '-');
  }

  openCreate() {
    const ref = this.dialog.open(CreateUserDialogComponent, {
      width: '540px', maxWidth: '95vw',
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      const res = this.authService.createUser(result);
      this.snackBar.open(res.message, 'Close', { duration: 3000 });
    });
  }

  toggleStatus(u: HRUser) {
    this.authService.toggleUserStatus(u.id);
    const next = u.status === 'Active' ? 'Inactive' : 'Active';
    this.snackBar.open(`${u.name} set to ${next}.`, 'Close', { duration: 2500 });
  }

  deleteUser(u: HRUser) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete User',
        message: `Delete "${u.name}" (${u.email})? They will lose all access immediately.`,
        confirmLabel: 'Delete',
        type: 'danger',
      }
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) {
        this.authService.deleteUser(u.id);
        this.snackBar.open(`${u.name} deleted.`, 'Close', { duration: 2500 });
      }
    });
  }
}
