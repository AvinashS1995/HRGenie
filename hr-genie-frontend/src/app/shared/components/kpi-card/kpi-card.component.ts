import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="kpi-card">
      <div class="kpi-card__top">
        <div class="kpi-card__icon" [style.background]="iconBg">
          <mat-icon [style.color]="iconColor">{{ icon }}</mat-icon>
        </div>
        <div class="kpi-card__change" [class.kpi-card__change--up]="direction === 'up'" [class.kpi-card__change--down]="direction === 'down'">
          <mat-icon class="change-arrow">{{ direction === 'up' ? 'arrow_upward' : 'arrow_downward' }}</mat-icon>
          <span>{{ change }}%</span>
        </div>
      </div>
      <div class="kpi-card__value">{{ value | number }}</div>
      <div class="kpi-card__label">{{ label }}</div>
      <div class="kpi-card__sub">vs last {{ period }}</div>
    </div>
  `,
  styles: [`
    .kpi-card {
      background: var(--color-surface);
      border: var(--card-border);
      border-radius: var(--card-radius);
      padding: 20px;
      box-shadow: 0 1px 3px rgb(0 0 0 / 0.04);
      transition: box-shadow 0.2s;
      cursor: default;

      &:hover { box-shadow: 0 4px 12px rgb(0 0 0 / 0.08); }
    }

    .kpi-card__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }

    .kpi-card__icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }
    }

    .kpi-card__change {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 20px;

      &--up {
        background: #dcfce7;
        color: #16a34a;
        .change-arrow { color: #16a34a; }
      }

      &--down {
        background: #fef2f2;
        color: #dc2626;
        .change-arrow { color: #dc2626; }
      }
    }

    .change-arrow {
      font-size: 12px !important;
      width: 12px !important;
      height: 12px !important;
      line-height: 12px !important;
    }

    .kpi-card__value {
      font-size: 1.875rem;
      font-weight: 800;
      color: var(--color-text-primary);
      line-height: 1;
      margin-bottom: 4px;
      letter-spacing: -0.02em;
    }

    .kpi-card__label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin-bottom: 2px;
    }

    .kpi-card__sub {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }
  `]
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value: number = 0;
  @Input() change: number = 0;
  @Input() direction: 'up' | 'down' = 'up';
  @Input() icon = 'people';
  @Input() iconBg = '#f5f3ff';
  @Input() iconColor = '#7c3aed';
  @Input() period = '30 days';
}
