import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="empty-state">
      <div class="empty-state__icon">
        <mat-icon>{{ icon }}</mat-icon>
      </div>
      <h3 class="empty-state__title">{{ title }}</h3>
      <p class="empty-state__desc">{{ description }}</p>
      <ng-content />
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }

    .empty-state__icon {
      width: 64px;
      height: 64px;
      background: #f5f3ff;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: #8b5cf6;
      }
    }

    .empty-state__title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 6px;
    }

    .empty-state__desc {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin: 0 0 20px;
      max-width: 320px;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'No data found';
  @Input() description = 'There is nothing to display here yet.';
}
