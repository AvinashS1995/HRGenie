import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TemplateService } from '../../core/services/template.service';
import { LetterTemplate, TemplateType } from '../../core/models';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

const PLACEHOLDERS: { group: string; items: string[] }[] = [
  { group: 'Employee', items: ['{{employeeName}}', '{{employeeId}}', '{{designation}}', '{{department}}', '{{location}}', '{{reportingManager}}'] },
  { group: 'Salary', items: ['{{currentCTC}}', '{{revisedCTC}}', '{{incrementPercentage}}', '{{basicSalary}}', '{{hra}}', '{{specialAllowance}}'] },
  { group: 'Date', items: ['{{effectiveDate}}'] },
];

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatIconModule,
    MatButtonModule, MatTabsModule, MatTooltipModule,
    PageHeaderComponent,
  ],
  template: `
    <div class="page-container fade-in-up">
      <app-page-header
        title="Letter Templates"
        subtitle="Manage and customize your HR letter templates"
      >
        <button mat-flat-button class="btn-primary" (click)="createNew()">
          <mat-icon>add</mat-icon>
          New Template
        </button>
      </app-page-header>

      @if (!editMode()) {
        <!-- Template Grid -->
        <mat-tab-group animationDuration="150ms" class="template-tabs">
          @for (type of templateTypes; track type) {
            <mat-tab [label]="type">
              <div class="template-grid">
                @for (t of templatesByType(type); track t.id) {
                  <div class="template-card card">
                    <div class="tc-header">
                      <div class="tc-icon">
                        <mat-icon>{{ typeIcon(type) }}</mat-icon>
                      </div>
                      @if (t.isDefault) {
                        <span class="default-badge">Default</span>
                      }
                    </div>
                    <h3 class="tc-name">{{ t.name }}</h3>
                    <div class="tc-meta">
                      <span class="tc-version">Version {{ t.version }}</span>
                      <span class="tc-date">Updated {{ t.updatedOn }}</span>
                    </div>
                    <div class="tc-preview">
                      <p>{{ t.content | slice:0:100 }}...</p>
                    </div>
                    <div class="tc-actions">
                      <button mat-button class="tc-btn" (click)="editTemplate(t)">
                        <mat-icon>edit</mat-icon>
                        Edit
                      </button>
                      <button mat-button class="tc-btn" (click)="previewTemplate(t)">
                        <mat-icon>visibility</mat-icon>
                        Preview
                      </button>
                      <button mat-button class="tc-btn" (click)="duplicateTemplate(t.id)">
                        <mat-icon>content_copy</mat-icon>
                        Duplicate
                      </button>
                    </div>
                  </div>
                }

                @if (templatesByType(type).length === 0) {
                  <div class="empty-type">
                    <mat-icon>article</mat-icon>
                    <p>No {{ type }} templates yet.</p>
                    <button mat-flat-button class="btn-primary" (click)="createNew()">
                      <mat-icon>add</mat-icon>
                      Create Template
                    </button>
                  </div>
                }
              </div>
            </mat-tab>
          }
        </mat-tab-group>

      } @else {
        <!-- Template Editor -->
        <div class="editor-layout">
          <!-- Left: Placeholders -->
          <div class="placeholders-panel card">
            <div class="panel-header">
              <mat-icon>code</mat-icon>
              <h3>Placeholders</h3>
            </div>
            <p class="panel-hint">Click or drag to insert into template</p>
            @for (group of placeholders; track group.group) {
              <div class="ph-group">
                <p class="ph-group-title">{{ group.group }}</p>
                @for (ph of group.items; track ph) {
                  <button class="ph-item" (click)="insertPlaceholder(ph)">{{ ph }}</button>
                }
              </div>
            }
          </div>

          <!-- Center: Editor -->
          <div class="editor-main card">
            <div class="editor-toolbar">
              <input class="template-name-input" [(ngModel)]="editingTemplate()!.name" placeholder="Template name..." />
              <div class="editor-actions">
                <button mat-button class="btn-secondary" (click)="editMode.set(false)">Cancel</button>
                <button mat-flat-button class="btn-primary" (click)="saveTemplate()">
                  <mat-icon>save</mat-icon>
                  Save Template
                </button>
              </div>
            </div>
            <textarea
              #editorRef
              class="template-editor"
              [(ngModel)]="editContent"
              (input)="updatePreview()"
              placeholder="Start typing your template here...&#10;&#10;Use {{placeholders}} for dynamic content."
            ></textarea>
          </div>

          <!-- Right: Live Preview -->
          <div class="preview-panel card">
            <div class="panel-header">
              <mat-icon>preview</mat-icon>
              <h3>Live Preview</h3>
            </div>
            <div class="preview-content">
              <div class="preview-doc" [innerHTML]="previewHtml()"></div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: var(--page-padding); }

    .template-tabs { margin-top: 0; }

    .template-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      padding: 20px 0;

      @media (max-width: 479px) { grid-template-columns: 1fr; }
    }

    .template-card {
      padding: 20px;
      transition: all 0.15s;

      &:hover {
        border-color: #c4b5fd;
        box-shadow: 0 4px 12px rgb(124 58 237 / 0.08);
      }
    }

    .tc-header {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
    }

    .tc-icon {
      width: 40px; height: 40px; border-radius: 10px; background: #f5f3ff;
      display: flex; align-items: center; justify-content: center;
      mat-icon { color: #8b5cf6; font-size: 20px; width: 20px; height: 20px; }
    }

    .default-badge {
      background: #eff6ff; color: #3b82f6;
      padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; font-weight: 700;
    }

    .tc-name { font-size: 0.95rem; font-weight: 700; color: var(--color-text-primary); margin: 0 0 6px; }

    .tc-meta {
      display: flex; gap: 10px; margin-bottom: 10px;
    }

    .tc-version { font-size: 0.72rem; color: var(--color-text-muted); background: #f3f4f6; padding: 1px 7px; border-radius: 6px; font-weight: 600; }
    .tc-date { font-size: 0.72rem; color: var(--color-text-muted); }

    .tc-preview {
      background: #f8f9fc; border-radius: 6px; padding: 10px;
      margin-bottom: 14px;
      p { font-size: 0.78rem; color: var(--color-text-secondary); margin: 0; line-height: 1.5; font-family: monospace; }
    }

    .tc-actions { display: flex; gap: 4px; border-top: 1px solid var(--color-border); padding-top: 12px; }

    .tc-btn {
      flex: 1; font-size: 0.78rem !important; color: var(--color-text-secondary) !important;
      padding: 0 !important; height: 32px !important;
      mat-icon { font-size: 15px !important; width: 15px !important; height: 15px !important; }
      &:hover { color: var(--color-primary) !important; background: #f5f3ff !important; }
    }

    .empty-type {
      grid-column: 1/-1; display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 60px; text-align: center;
      mat-icon { font-size: 36px; width: 36px; height: 36px; color: #d1d5db; margin-bottom: 12px; }
      p { color: var(--color-text-muted); margin: 0 0 16px; }
    }

    /* Editor Layout */
    .editor-layout {
      display: grid;
      grid-template-columns: 220px 1fr 240px;
      gap: 16px;
      align-items: start;

      @media (max-width: 1023px) { grid-template-columns: 1fr; }
    }

    .placeholders-panel {
      padding: 16px;
      @media (max-width: 1023px) { display: none; }
    }

    .preview-panel {
      padding: 16px;
      @media (max-width: 1023px) { display: none; }
    }

    .panel-header {
      display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
      mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--color-primary); }
      h3 { font-size: 0.875rem; font-weight: 700; color: var(--color-text-primary); margin: 0; }
    }

    .panel-hint { font-size: 0.72rem; color: var(--color-text-muted); margin: 0 0 14px; }

    .ph-group { margin-bottom: 14px; }
    .ph-group-title { font-size: 0.68rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px; }

    .ph-item {
      display: block; width: 100%; text-align: left;
      background: #f5f3ff; color: #6d28d9; border: none;
      padding: 5px 10px; border-radius: 6px; font-size: 0.75rem;
      font-family: monospace; cursor: pointer; margin-bottom: 4px;
      transition: background 0.1s;
      &:hover { background: #ede9fe; }
    }

    .editor-toolbar {
      display: flex; align-items: center; gap: 12px; padding: 12px 16px;
      border-bottom: 1px solid var(--color-border);
    }

    .template-name-input {
      flex: 1; border: 1px solid var(--color-border); border-radius: 8px;
      padding: 6px 12px; font-size: 0.875rem; font-weight: 600; outline: none;
      font-family: inherit; color: var(--color-text-primary);
      &:focus { border-color: var(--color-primary); }
    }

    .editor-actions { display: flex; gap: 8px; flex-shrink: 0; }

    .template-editor {
      width: 100%; min-height: 400px; padding: 16px;
      border: none; outline: none; resize: none;
      font-size: 0.875rem; font-family: 'Courier New', monospace;
      line-height: 1.6; color: var(--color-text-primary);
      background: #fafafa;
    }

    .preview-content {
      background: white; border: 1px solid var(--color-border); border-radius: 8px;
      padding: 16px; min-height: 300px; margin-top: 8px;
    }

    .preview-doc {
      font-size: 0.82rem; line-height: 1.7; color: var(--color-text-primary);
      white-space: pre-wrap;
    }
  `]
})
export class TemplatesComponent {
  private templateService = inject(TemplateService);
  private snackBar = inject(MatSnackBar);

  editMode = signal(false);
  editingTemplate = signal<LetterTemplate | null>(null);
  editContent = '';
  placeholders = PLACEHOLDERS;

  templateTypes: TemplateType[] = ['Increment Letter', 'Annexure', 'Promotion Letter', 'Transfer Letter', 'Salary Revision'];

  templatesByType(type: TemplateType) {
    return this.templateService.getTemplates(type);
  }

  typeIcon(type: string): string {
    const map: Record<string, string> = {
      'Increment Letter': 'trending_up',
      'Annexure': 'attach_file',
      'Promotion Letter': 'workspace_premium',
      'Transfer Letter': 'swap_horiz',
      'Salary Revision': 'currency_rupee',
    };
    return map[type] ?? 'article';
  }

  previewHtml = computed(() => {
    if (!this.editContent) return '<em style="color:#9ca3af">Start typing to see preview...</em>';
    const rendered = this.templateService.renderTemplate(
      this.editContent,
      this.templateService.getSampleData()
    );
    return rendered.replace(/\n/g, '<br>');
  });

  editTemplate(t: LetterTemplate) {
    this.editingTemplate.set({ ...t });
    this.editContent = t.content;
    this.editMode.set(true);
  }

  previewTemplate(t: LetterTemplate) {
    this.editTemplate(t);
  }

  duplicateTemplate(id: string) {
    this.templateService.duplicateTemplate(id);
    this.snackBar.open('Template duplicated!', 'Close', { duration: 2000 });
  }

  createNew() {
    const blank: LetterTemplate = {
      id: '', name: 'New Template', type: 'Increment Letter',
      version: '1', updatedOn: '', content: '', isDefault: false,
    };
    this.editingTemplate.set(blank);
    this.editContent = '';
    this.editMode.set(true);
  }

  insertPlaceholder(ph: string) {
    this.editContent += ph;
    this.editingTemplate.update(t => t ? { ...t, content: this.editContent } : t);
  }

  updatePreview() {
    this.editingTemplate.update(t => t ? { ...t, content: this.editContent } : t);
  }

  saveTemplate() {
    const t = this.editingTemplate();
    if (t) {
      this.templateService.saveTemplate({ ...t, content: this.editContent });
      this.snackBar.open('Template saved!', 'Close', { duration: 2500 });
      this.editMode.set(false);
    }
  }
}
