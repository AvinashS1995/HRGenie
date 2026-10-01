import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ai-insight',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="ai-insight">
      <div class="ai-insight__header">
        <div class="ai-insight__badge">
          <mat-icon>auto_awesome</mat-icon>
          <span>AI HR Insight</span>
        </div>
        @if (showAskBtn) {
          <button mat-button class="ask-btn" (click)="askAI.emit()">
            <mat-icon>chat</mat-icon>
            Ask AI Analyst
          </button>
        }
      </div>
      <div class="ai-insight__content">
        @for (insight of insights; track insight) {
          <div class="ai-insight__item">
            <span class="ai-insight__dot"></span>
            <span>{{ insight }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .ai-insight {
      background: linear-gradient(135deg, #faf5ff 0%, #f0f9ff 100%);
      border: 1px solid #e9d5ff;
      border-radius: var(--card-radius);
      padding: 20px;
    }

    .ai-insight__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }

    .ai-insight__badge {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.875rem;
      font-weight: 700;
      color: #6d28d9;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #8b5cf6;
      }
    }

    .ask-btn {
      color: var(--color-primary) !important;
      font-size: 0.8rem !important;
      font-weight: 600 !important;
      gap: 4px;

      mat-icon {
        font-size: 16px !important;
        width: 16px !important;
        height: 16px !important;
      }
    }

    .ai-insight__content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .ai-insight__item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      line-height: 1.5;
    }

    .ai-insight__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #8b5cf6;
      margin-top: 6px;
      flex-shrink: 0;
    }
  `]
})
export class AiInsightComponent {
  @Input() insights: string[] = [];
  @Input() showAskBtn = true;
  @Output() askAI = new EventEmitter<void>();
}
