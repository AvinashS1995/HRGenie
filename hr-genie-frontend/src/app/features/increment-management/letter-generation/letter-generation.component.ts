import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TemplateService } from '../../../core/services/template.service';
import type { SampleTemplateData } from '../../../core/services/template.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-letter-generation',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatIconModule, MatButtonModule, MatTabsModule,
    MatMenuModule, MatSelectModule, MatFormFieldModule, MatTooltipModule,
    PageHeaderComponent,
  ],
  template: `
    <div class="page-container fade-in-up">
      <app-page-header
        title="Increment Letter Preview"
        subtitle="AI-generated letter with dynamic placeholders"
      >
        <mat-form-field appearance="outline" style="width:200px; margin-bottom:0;">
          <mat-label>Letter Template</mat-label>
          <mat-select [(ngModel)]="selectedTemplate" (ngModelChange)="onTemplateChange()">
            @for (t of templates; track t.id) {
              <mat-option [value]="t.id">{{ t.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <button mat-flat-button class="btn-primary">
          <mat-icon>download</mat-icon>
          Download PDF
        </button>
      </app-page-header>

      <div class="letter-layout">

        <!-- Left: Thumbnails -->
        <div class="thumb-panel">
          <p class="thumb-panel-title">Pages</p>
          <div
            class="page-thumb"
            [class.active]="activeTab() === 0"
            (click)="activeTab.set(0)"
          >
            <div class="thumb-inner letter-thumb">
              <div class="thumb-logo-bar"></div>
              <div class="thumb-lines">
                @for (l of [1,2,3,4,5,6,7,8]; track l) {
                  <div class="thumb-line" [style.width.%]="l % 3 === 0 ? 60 : 90"></div>
                }
              </div>
            </div>
            <p class="thumb-label">Increment Letter</p>
          </div>
          <div
            class="page-thumb"
            [class.active]="activeTab() === 1"
            (click)="activeTab.set(1)"
          >
            <div class="thumb-inner annex-thumb">
              <div class="thumb-logo-bar"></div>
              <div class="thumb-table">
                @for (r of [1,2,3,4,5]; track r) {
                  <div class="thumb-row"></div>
                }
              </div>
            </div>
            <p class="thumb-label">Annexure</p>
          </div>
        </div>

        <!-- Center: Document Preview -->
        <div class="preview-area">
          <mat-tab-group
            [selectedIndex]="activeTab()"
            (selectedIndexChange)="activeTab.set($event)"
            animationDuration="150ms"
            class="preview-tabs"
          >
            <!-- Letter Tab -->
            <mat-tab label="Increment Letter">
              <div class="doc-preview-wrapper">
                <div class="doc-preview">
                  <!-- Company Header -->
                  <div class="doc-header">
                    <div class="doc-logo">
                      <div class="logo-box">
                        <mat-icon>business</mat-icon>
                      </div>
                      <div>
                        <p class="company-name">TORRENT PHARMA</p>
                        <p class="company-sub">Pharmaceuticals Limited</p>
                      </div>
                    </div>
                    <div class="doc-date">
                      <p>Date: 01 April 2026</p>
                    </div>
                  </div>

                  <div class="doc-divider"></div>

                  <!-- Employee Info -->
                  <div class="doc-to">
                    <p class="doc-to-label">To,</p>
                    <p><strong>{{ sampleData.employeeName }}</strong></p>
                    <p>{{ sampleData.designation }}</p>
                    <p>{{ sampleData.department }}</p>
                    <p>Employee ID: <strong>{{ sampleData.employeeId }}</strong></p>
                  </div>

                  <!-- Subject -->
                  <div class="doc-subject">
                    <p><strong>Subject: Increment Letter – 2026</strong></p>
                  </div>

                  <!-- Body -->
                  <div class="doc-body">
                    <p>Dear {{ sampleData.employeeName }},</p>
                    <p>
                      We are pleased to inform you that based on your performance and contribution
                      during the year, your compensation has been revised with effect from
                      <strong>{{ sampleData.effectiveDate }}</strong>.
                    </p>
                    <p>
                      Your revised Cost to Company (CTC) is
                      <strong>₹{{ sampleData.revisedCTC }}</strong> per annum.
                    </p>
                    <p>
                      We appreciate your valuable contributions and look forward to your
                      continued support.
                    </p>
                  </div>

                  <!-- Signature -->
                  <div class="doc-signature">
                    <p>Regards,</p>
                    <div class="sig-line"></div>
                    <p><strong>HR Team</strong></p>
                    <p class="sig-company">Torrent Pharmaceuticals Limited</p>
                  </div>
                </div>
              </div>
            </mat-tab>

            <!-- Annexure Tab -->
            <mat-tab label="Annexure – Salary Structure">
              <div class="doc-preview-wrapper">
                <div class="doc-preview">
                  <!-- Company Header -->
                  <div class="doc-header">
                    <div class="doc-logo">
                      <div class="logo-box"><mat-icon>business</mat-icon></div>
                      <div>
                        <p class="company-name">TORRENT PHARMA</p>
                        <p class="company-sub">Pharmaceuticals Limited</p>
                      </div>
                    </div>
                  </div>
                  <div class="doc-divider"></div>

                  <!-- Annexure Title -->
                  <div class="annex-title-block">
                    <h2 class="annex-title">SALARY REVISION ANNEXURE</h2>
                    <p class="annex-subtitle">Confidential | {{ sampleData.effectiveDate }}</p>
                  </div>

                  <!-- Employee Info Row -->
                  <div class="annex-emp-row">
                    <span><strong>Employee:</strong> {{ sampleData.employeeName }}</span>
                    <span><strong>ID:</strong> {{ sampleData.employeeId }}</span>
                    <span><strong>Designation:</strong> {{ sampleData.designation }}</span>
                  </div>

                  <!-- Salary Table -->
                  <table class="annex-table">
                    <thead>
                      <tr>
                        <th>Salary Component</th>
                        <th>Current (₹/annum)</th>
                        <th>Revised (₹/annum)</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (comp of annexureComponents; track comp.name) {
                        <tr [class.changed]="comp.current !== comp.revised">
                          <td>{{ comp.name }}</td>
                          <td>{{ comp.current | number }}</td>
                          <td [class.revised-val]="comp.current !== comp.revised">
                            {{ comp.revised | number }}
                            @if (comp.current !== comp.revised) {
                              <span class="change-arrow">↑</span>
                            }
                          </td>
                        </tr>
                      }
                    </tbody>
                    <tfoot>
                      <tr class="total-row">
                        <td><strong>Total CTC</strong></td>
                        <td><strong>7,00,000</strong></td>
                        <td class="revised-val"><strong>7,70,000 ↑</strong></td>
                      </tr>
                    </tfoot>
                  </table>

                  <!-- Footer Note -->
                  <div class="annex-note">
                    <mat-icon>info_outline</mat-icon>
                    <p>This is a confidential document. Increment effective from {{ sampleData.effectiveDate }}.</p>
                  </div>

                  <div class="doc-signature">
                    <p>Authorized Signatory</p>
                    <div class="sig-line"></div>
                    <p><strong>HR Department</strong></p>
                  </div>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </div>

        <!-- Right: Actions Panel -->
        <div class="actions-panel">
          <div class="action-panel-card card">
            <h3 class="panel-section-title">Quick Actions</h3>
            <div class="panel-actions">
              <button mat-button class="panel-btn">
                <mat-icon>download</mat-icon>
                Download PDF
              </button>
              <button mat-button class="panel-btn">
                <mat-icon>email</mat-icon>
                Send via Email
              </button>
              <button mat-button class="panel-btn">
                <mat-icon>print</mat-icon>
                Print
              </button>
              <button mat-button class="panel-btn">
                <mat-icon>share</mat-icon>
                Share Link
              </button>
            </div>
          </div>

          <div class="employee-mini-card card">
            <h3 class="panel-section-title">Employee</h3>
            <div class="emp-mini">
              <div class="emp-mini-avatar">{{ sampleData.employeeName[0] }}</div>
              <div>
                <p class="emp-mini-name">{{ sampleData.employeeName }}</p>
                <p class="emp-mini-id">{{ sampleData.employeeId }}</p>
              </div>
            </div>
            <div class="emp-meta-list">
              <div class="emp-meta-row">
                <span>Increment</span>
                <span class="meta-badge-green">10%</span>
              </div>
              <div class="emp-meta-row">
                <span>Current CTC</span>
                <span>₹7,00,000</span>
              </div>
              <div class="emp-meta-row">
                <span>Revised CTC</span>
                <span class="meta-purple">₹7,70,000</span>
              </div>
              <div class="emp-meta-row">
                <span>Effective</span>
                <span>01 Apr 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: var(--page-padding); }

    .letter-layout {
      display: grid;
      grid-template-columns: 100px 1fr 240px;
      gap: 16px;
      align-items: start;

      @media (max-width: 1023px) {
        grid-template-columns: 1fr 220px;
      }

      @media (max-width: 767px) {
        grid-template-columns: 1fr;
      }
    }

    /* Thumbnails */
    .thumb-panel {
      display: flex;
      flex-direction: column;
      gap: 12px;

      @media (max-width: 767px) { display: none; }
    }
    .thumb-panel-title { font-size: 0.72rem; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px; }

    .page-thumb {
      cursor: pointer; border-radius: 8px; overflow: hidden;
      border: 2px solid var(--color-border); transition: all 0.15s;

      &.active { border-color: var(--color-primary); }
      &:hover { border-color: #c4b5fd; }
    }

    .thumb-inner {
      background: white; padding: 8px; min-height: 80px;
    }

    .thumb-logo-bar { height: 6px; background: #1a1f3c; border-radius: 2px; margin-bottom: 6px; }
    .thumb-lines { display: flex; flex-direction: column; gap: 3px; }
    .thumb-line { height: 3px; background: #e5e7eb; border-radius: 1px; }
    .thumb-table { display: flex; flex-direction: column; gap: 3px; margin-top: 4px; }
    .thumb-row { height: 5px; background: #e5e7eb; border-radius: 1px; }

    .thumb-label { font-size: 0.65rem; text-align: center; color: var(--color-text-muted); padding: 4px; background: #f8f9fc; font-weight: 500; }

    /* Preview Area */
    .preview-area { background: #f0f2f5; border-radius: 12px; padding: 0; overflow: hidden; }

    .preview-tabs { background: transparent; }

    .doc-preview-wrapper {
      padding: 24px; display: flex; justify-content: center;
      background: #f0f2f5; min-height: 600px;
    }

    .doc-preview {
      background: white; width: 100%; max-width: 640px;
      padding: 32px 36px; border-radius: 4px;
      box-shadow: 0 2px 16px rgb(0 0 0 / 0.1);
      font-size: 0.85rem; line-height: 1.6; color: #1f2937;
    }

    .doc-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 16px;
    }

    .doc-logo {
      display: flex; align-items: center; gap: 10px;
    }

    .logo-box {
      width: 40px; height: 40px; background: #1a1f3c;
      border-radius: 8px; display: flex; align-items: center; justify-content: center;
      mat-icon { color: white; font-size: 22px; width: 22px; height: 22px; }
    }

    .company-name { font-size: 0.95rem; font-weight: 800; color: #1a1f3c; margin: 0; letter-spacing: 0.05em; }
    .company-sub { font-size: 0.7rem; color: #6b7280; margin: 0; }
    .doc-date { font-size: 0.8rem; color: #6b7280; text-align: right; }

    .doc-divider { height: 2px; background: #1a1f3c; margin: 12px 0 20px; }

    .doc-to { margin-bottom: 16px; }
    .doc-to-label { font-size: 0.8rem; color: #6b7280; margin: 0 0 4px; }
    .doc-to p { margin: 1px 0; font-size: 0.85rem; }

    .doc-subject { margin-bottom: 16px; padding: 10px 14px; background: #f5f3ff; border-left: 3px solid #7c3aed; border-radius: 4px; }
    .doc-subject p { margin: 0; font-size: 0.875rem; }

    .doc-body p { margin: 0 0 10px; font-size: 0.875rem; }

    .doc-signature {
      margin-top: 28px;
      p { margin: 3px 0; font-size: 0.85rem; }
    }

    .sig-line { width: 140px; height: 1px; background: #9ca3af; margin: 16px 0 8px; }
    .sig-company { color: #6b7280; font-size: 0.75rem; }

    /* Annexure */
    .annex-title-block { text-align: center; margin-bottom: 16px; }
    .annex-title { font-size: 1rem; font-weight: 800; color: #1a1f3c; margin: 0 0 4px; letter-spacing: 0.06em; }
    .annex-subtitle { font-size: 0.75rem; color: #6b7280; margin: 0; }

    .annex-emp-row {
      display: flex; gap: 20px; margin-bottom: 16px;
      padding: 10px 14px; background: #f8f9fc; border-radius: 6px;
      font-size: 0.8rem; flex-wrap: wrap;
    }

    .annex-table {
      width: 100%; border-collapse: collapse; margin-bottom: 16px;
      th, td { padding: 9px 14px; text-align: left; font-size: 0.82rem; border-bottom: 1px solid #f3f4f6; }
      th { background: #1a1f3c; color: white; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; }
    }

    .changed td { background: #faf5ff; }
    .revised-val { font-weight: 700; color: #7c3aed; }
    .change-arrow { color: #10b981; margin-left: 4px; font-weight: 800; }
    .total-row td { background: #f8f9fc; border-top: 2px solid #1a1f3c; border-bottom: none; }

    .annex-note {
      display: flex; align-items: flex-start; gap: 6px;
      padding: 8px 12px; background: #f0fdf4; border-radius: 6px;
      margin-bottom: 16px;
      mat-icon { font-size: 14px; width: 14px; height: 14px; color: #10b981; margin-top: 2px; flex-shrink: 0; }
      p { font-size: 0.75rem; color: #065f46; margin: 0; }
    }

    /* Right Actions Panel */
    .actions-panel {
      display: flex;
      flex-direction: column;
      gap: 14px;

      @media (max-width: 767px) { display: none; }
      @media (max-width: 1023px) {
        .employee-mini-card { display: none; }
      }
    }

    .action-panel-card, .employee-mini-card { padding: 16px; }

    .panel-section-title { font-size: 0.8rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px; }

    .panel-actions { display: flex; flex-direction: column; gap: 2px; }

    .panel-btn {
      width: 100% !important; justify-content: flex-start !important;
      color: var(--color-text-secondary) !important;
      padding: 8px 10px !important; border-radius: 6px !important;
      font-size: 0.8rem !important; gap: 8px;

      mat-icon { font-size: 16px !important; width: 16px !important; height: 16px !important; }
      &:hover { background: #f5f3ff !important; color: var(--color-primary) !important; }
    }

    .emp-mini { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }

    .emp-mini-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 0.875rem; font-weight: 700; flex-shrink: 0;
    }

    .emp-mini-name { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); margin: 0 0 1px; }
    .emp-mini-id { font-size: 0.72rem; color: #6366f1; margin: 0; font-weight: 600; }

    .emp-meta-list { display: flex; flex-direction: column; gap: 8px; }

    .emp-meta-row {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 0.78rem;
      span:first-child { color: var(--color-text-muted); }
      span:last-child { font-weight: 600; color: var(--color-text-primary); }
    }

    .meta-badge-green { background: #dcfce7; color: #16a34a; padding: 1px 8px; border-radius: 10px; font-size: 0.72rem !important; }
    .meta-purple { color: #7c3aed !important; }
  `]
})
export class LetterGenerationComponent {
  private templateService = inject(TemplateService);
  activeTab = signal(0);
  selectedTemplate = signal('t1');

  templates = this.templateService.getTemplates('Increment Letter');
  sampleData: SampleTemplateData = this.templateService.getSampleData();

  annexureComponents = [
    { name: 'Basic Salary', current: 300000, revised: 330000 },
    { name: 'HRA', current: 120000, revised: 132000 },
    { name: 'Conveyance', current: 48000, revised: 48000 },
    { name: 'Medical Allowance', current: 15000, revised: 15000 },
    { name: 'Special Allowance', current: 117000, revised: 145000 },
  ];

  onTemplateChange() {
    // In a real app, re-render with selected template
  }
}
