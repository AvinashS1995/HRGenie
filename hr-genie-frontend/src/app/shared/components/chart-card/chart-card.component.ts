import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="chart-card card">
      <div class="chart-card__header card-header">
        <div>
          <h3 class="section-title">{{ title }}</h3>
          @if (subtitle) {
            <p class="chart-subtitle">{{ subtitle }}</p>
          }
        </div>
        <div class="chart-card__actions">
          <ng-content select="[actions]" />
        </div>
      </div>
      <div class="chart-card__body card-body">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;        /* make the custom element a block so it fills the grid cell */
      min-width: 0;          /* allow shrinking below content size */
    }

    .chart-card {
      height: 100%;
    }

    .chart-subtitle {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      margin: 2px 0 0;
    }

    .chart-card__actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class ChartCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
