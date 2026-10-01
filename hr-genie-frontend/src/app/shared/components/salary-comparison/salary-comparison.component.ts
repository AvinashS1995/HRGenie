import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SalaryComponent } from '../../../core/models';

@Component({
  selector: 'app-salary-comparison',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="salary-comparison">
      <!-- Current -->
      <div class="salary-card">
        <div class="salary-card__header">
          <span class="salary-card__title">Current Structure</span>
          <span class="salary-card__ctc">₹{{ (totalCTC | number) ?? 0 }}</span>
        </div>
        <div class="salary-rows">
          @for (comp of components; track comp.name) {
            <div class="salary-row">
              <span class="salary-row__label">{{ comp.name }}</span>
              <span class="salary-row__value">{{ comp.current | number }}</span>
            </div>
          }
        </div>
        <div class="salary-total">
          <span>Total CTC</span>
          <span class="salary-total__value">₹{{ (totalCTC | number) }}</span>
        </div>
      </div>

      <!-- Arrow -->
      <div class="salary-arrow">
        <div class="arrow-circle">
          <mat-icon>arrow_forward</mat-icon>
        </div>
        <div class="increment-badge">+{{ incrementPct }}%</div>
      </div>

      <!-- Revised -->
      <div class="salary-card salary-card--revised">
        <div class="salary-card__header">
          <span class="salary-card__title">Revised Structure</span>
          <span class="salary-card__ctc revised-ctc">₹{{ (revisedCTC | number) ?? 0 }}</span>
        </div>
        <div class="salary-rows">
          @for (comp of components; track comp.name) {
            <div class="salary-row" [class.salary-row--changed]="comp.current !== comp.revised">
              <span class="salary-row__label">{{ comp.name }}</span>
              <span class="salary-row__value" [class.revised-value]="comp.current !== comp.revised">
                {{ comp.revised | number }}
              </span>
            </div>
          }
        </div>
        <div class="salary-total">
          <span>Total CTC</span>
          <span class="salary-total__value revised-ctc">₹{{ (revisedCTC | number) }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .salary-comparison {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 16px;
      align-items: start;

      @media (max-width: 767px) {
        grid-template-columns: 1fr;
        gap: 8px;
      }
    }

    .salary-card {
      background: #f8f9fc;
      border: 1px solid var(--color-border);
      border-radius: 10px;
      overflow: hidden;

      &--revised {
        background: #faf5ff;
        border-color: #e9d5ff;
      }
    }

    .salary-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--color-border);
      background: white;
    }

    .salary-card__title {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .salary-card__ctc {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    .salary-rows { padding: 8px 0; }

    .salary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 7px 16px;
      transition: background 0.1s;

      &--changed { background: rgba(124, 58, 237, 0.04); }
    }

    .salary-row__label {
      font-size: 0.8rem;
      color: var(--color-text-secondary);
    }

    .salary-row__value {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--color-text-primary);
    }

    .revised-value {
      color: #7c3aed;
      font-weight: 600;
    }

    .salary-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
      border-top: 1px solid var(--color-border);
      background: white;

      span:first-child {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--color-text-primary);
      }
    }

    .salary-total__value {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .revised-ctc { color: #7c3aed; }

    .salary-arrow {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding-top: 48px;

      @media (max-width: 767px) {
        flex-direction: row;
        padding-top: 0;
        padding: 8px 0;
        justify-content: flex-start;
      }
    }

    .arrow-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        color: white;
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .increment-badge {
      background: #dcfce7;
      color: #16a34a;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 10px;
      white-space: nowrap;
    }
  `]
})
export class SalaryComparisonComponent {
  @Input() components: SalaryComponent[] = [];
  @Input() totalCTC = 0;
  @Input() revisedCTC = 0;
  @Input() incrementPct = 0;
}
