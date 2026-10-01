import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ApprovalTimelineStep } from '../../../core/models';

@Component({
  selector: 'app-approval-timeline',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="timeline">
      @for (step of steps; track step.label; let last = $last) {
        <div class="timeline-item">
          <div class="timeline-left">
            <div class="timeline-dot" [class]="'timeline-dot--' + step.status">
              @if (step.status === 'completed') {
                <mat-icon>check</mat-icon>
              } @else if (step.status === 'current') {
                <div class="pulse-dot"></div>
              }
            </div>
            @if (!last) {
              <div class="timeline-line" [class.timeline-line--done]="step.status === 'completed'"></div>
            }
          </div>
          <div class="timeline-content">
            <p class="timeline-label" [class.timeline-label--current]="step.status === 'current'">
              {{ step.label }}
            </p>
            @if (step.date || step.actor) {
              <p class="timeline-meta">
                @if (step.actor) { <span>{{ step.actor }}</span> }
                @if (step.date) { <span class="timeline-date">· {{ step.date }}</span> }
              </p>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .timeline {
      display: flex;
      flex-direction: column;
    }

    .timeline-item {
      display: flex;
      gap: 14px;
    }

    .timeline-left {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
    }

    .timeline-dot {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.2s;

      mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
        color: white;
      }

      &--completed {
        background: #10b981;
        border: 2px solid #10b981;
      }

      &--current {
        background: white;
        border: 2px solid var(--color-primary);
      }

      &--pending {
        background: white;
        border: 2px solid #d1d5db;
      }
    }

    .pulse-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--color-primary);
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.7; }
    }

    .timeline-line {
      flex: 1;
      width: 2px;
      background: #e5e7eb;
      margin: 3px 0;
      min-height: 20px;

      &--done { background: #10b981; }
    }

    .timeline-content {
      padding: 3px 0 20px;
      flex: 1;
    }

    .timeline-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      margin: 0 0 2px;

      &--current {
        color: var(--color-primary);
        font-weight: 600;
      }
    }

    .timeline-meta {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      margin: 0;
    }

    .timeline-date { color: var(--color-text-muted); }
  `]
})
export class ApprovalTimelineComponent {
  @Input() steps: ApprovalTimelineStep[] = [];
}
