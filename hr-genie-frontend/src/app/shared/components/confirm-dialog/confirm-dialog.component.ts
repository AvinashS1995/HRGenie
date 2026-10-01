import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <div class="confirm-dialog__icon" [class]="'confirm-dialog__icon--' + (data.type || 'danger')">
        <mat-icon>{{ iconMap[data.type || 'danger'] }}</mat-icon>
      </div>
      <h2 class="confirm-dialog__title">{{ data.title }}</h2>
      <p class="confirm-dialog__message">{{ data.message }}</p>
      <div class="confirm-dialog__actions">
        <button mat-button class="btn-secondary" (click)="dialogRef.close(false)">
          {{ data.cancelLabel || 'Cancel' }}
        </button>
        <button
          mat-flat-button
          [class]="data.type === 'danger' ? 'btn-danger' : 'btn-primary'"
          (click)="dialogRef.close(true)"
        >
          {{ data.confirmLabel || 'Confirm' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      padding: 28px;
      text-align: center;
      min-width: 360px;
      max-width: 420px;
    }

    .confirm-dialog__icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;

      mat-icon { font-size: 28px; width: 28px; height: 28px; }

      &--danger { background: #fef2f2; mat-icon { color: #ef4444; } }
      &--warning { background: #fff7ed; mat-icon { color: #f59e0b; } }
      &--info { background: #eff6ff; mat-icon { color: #3b82f6; } }
    }

    .confirm-dialog__title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 8px;
    }

    .confirm-dialog__message {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin: 0 0 24px;
      line-height: 1.5;
    }

    .confirm-dialog__actions {
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    .btn-danger {
      background: #ef4444 !important;
      color: white !important;
      border-radius: 8px !important;
      font-weight: 600 !important;
      padding: 0 20px !important;
    }
  `]
})
export class ConfirmDialogComponent {
  iconMap: Record<string, string> = {
    danger: 'delete_outline',
    warning: 'warning_amber',
    info: 'info_outline',
  };

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
