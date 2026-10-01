import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ChipType = 'active' | 'completed' | 'draft' | 'processing' | 'valid' | 'issue' | 'review' | 'pending' | 'approved' | 'rejected';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="chip" [ngClass]="'chip-' + type.toLowerCase()">{{ label || type }}</span>`,
  styles: [`
    :host { display: inline-flex; }
    .chip {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.01em;
      white-space: nowrap;
      text-transform: capitalize;
    }
    .chip-active     { background: #dcfce7; color: #16a34a; }
    .chip-completed  { background: #d1fae5; color: #059669; }
    .chip-draft      { background: #f3f4f6; color: #6b7280; }
    .chip-processing { background: #fff7ed; color: #c2410c; }
    .chip-valid      { background: #dcfce7; color: #16a34a; }
    .chip-issue      { background: #fef2f2; color: #dc2626; }
    .chip-review, .chip-needs\ review { background: #fff7ed; color: #d97706; }
    .chip-pending    { background: #fef9c3; color: #a16207; }
    .chip-approved   { background: #dcfce7; color: #16a34a; }
    .chip-rejected   { background: #fef2f2; color: #dc2626; }
  `]
})
export class StatusChipComponent {
  @Input() type: string = 'draft';
  @Input() label?: string;
}
