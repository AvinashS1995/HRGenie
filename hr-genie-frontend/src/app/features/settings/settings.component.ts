import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SettingsService } from '../../core/services/settings.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { AIProvider } from '../../core/models';

type SettingsSection = 'general' | 'ai' | 'templates' | 'approval' | 'email' | 'security' | 'integrations';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatSlideToggleModule,
    MatTooltipModule,
    PageHeaderComponent,
  ],
  template: `
    <div class="page-container fade-in-up">
      <app-page-header
        title="System Settings"
        subtitle="Configure AI, templates and workflow settings"
      >
        <button mat-flat-button class="btn-primary" (click)="saveAll()">
          <mat-icon>save</mat-icon>
          Save Settings
        </button>
      </app-page-header>

      <div class="settings-layout">
        <!-- Left Nav -->
        <nav class="settings-nav card">
          @for (item of navItems; track item.key) {
            <button
              class="snav-item"
              [class.snav-item--active]="activeSection() === item.key"
              (click)="activeSection.set(item.key)"
            >
              <mat-icon>{{ item.icon }}</mat-icon>
              <span>{{ item.label }}</span>
            </button>
          }
        </nav>

        <!-- Right Content -->
        <div class="settings-content">

          <!-- General -->
          @if (activeSection() === 'general') {
            <div class="settings-section card">
              <div class="section-hdr">
                <h2 class="section-hdr-title">General Settings</h2>
                <p class="section-hdr-sub">Configure your organization's basic settings</p>
              </div>
              <div class="settings-form">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Organization Name</mat-label>
                  <input matInput value="Torrent Pharmaceuticals Limited" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>HR Email</mat-label>
                  <input matInput value="hr@torrentpharma.com" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Fiscal Year Start</mat-label>
                  <mat-select value="April">
                    <mat-option value="April">April</mat-option>
                    <mat-option value="January">January</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>
          }

          <!-- AI Configuration -->
          @if (activeSection() === 'ai') {
            <div class="settings-section card">
              <div class="section-hdr">
                <h2 class="section-hdr-title">AI Configuration</h2>
                <p class="section-hdr-sub">Configure the AI provider for HR operations</p>
              </div>

              <div class="settings-form" [formGroup]="aiForm">
                <mat-form-field appearance="outline">
                  <mat-label>AI Provider</mat-label>
                  <mat-select formControlName="provider" (selectionChange)="onProviderChange()">
                    <mat-option value="OpenAI">OpenAI</mat-option>
                    <mat-option value="Gemini">Gemini</mat-option>
                    <mat-option value="OpenRouter">OpenRouter</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Model</mat-label>
                  <mat-select formControlName="model">
                    @for (m of availableModels(); track m) {
                      <mat-option [value]="m">{{ m }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Temperature</mat-label>
                  <input matInput formControlName="temperature" type="number" step="0.1" min="0" max="1" />
                  <mat-hint>0.0 = deterministic, 1.0 = creative</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Max Tokens</mat-label>
                  <input matInput formControlName="maxTokens" type="number" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>API Key</mat-label>
                  <input matInput formControlName="apiKey" type="password" placeholder="sk-..." />
                  <mat-icon matSuffix>key</mat-icon>
                  <mat-hint>Your API key is stored securely and never exposed in the UI</mat-hint>
                </mat-form-field>
              </div>

              <!-- Toggles -->
              <div class="toggles-section">
                <h3 class="toggles-title">Feature Toggles</h3>
                <div class="toggles-list">
                  <div class="toggle-item">
                    <div class="toggle-info">
                      <p class="toggle-label">Enable AI Validation</p>
                      <p class="toggle-desc">Automatically validate increment data using AI</p>
                    </div>
                    <mat-slide-toggle [formControl]="$any(aiForm.get('enableValidation'))" color="primary" />
                  </div>
                  <hr class="toggle-divider" />
                  <div class="toggle-item">
                    <div class="toggle-info">
                      <p class="toggle-label">Enable Letter Generation</p>
                      <p class="toggle-desc">Use AI to generate increment letters</p>
                    </div>
                    <mat-slide-toggle [formControl]="$any(aiForm.get('enableLetterGeneration'))" color="primary" />
                  </div>
                  <hr class="toggle-divider" />
                  <div class="toggle-item">
                    <div class="toggle-info">
                      <p class="toggle-label">Enable Annexure Generation</p>
                      <p class="toggle-desc">Use AI to generate salary annexures</p>
                    </div>
                    <mat-slide-toggle [formControl]="$any(aiForm.get('enableAnnexureGeneration'))" color="primary" />
                  </div>
                </div>
              </div>

              <!-- Test Connection -->
              <div class="test-connection">
                <button mat-flat-button class="btn-primary" (click)="testConnection()">
                  <mat-icon>{{ testStatus() === 'success' ? 'check_circle' : testStatus() === 'error' ? 'error' : 'wifi' }}</mat-icon>
                  {{ testStatus() === 'idle' ? 'Test Connection' : testStatus() === 'testing' ? 'Testing...' : testStatus() === 'success' ? 'Connected!' : 'Failed' }}
                </button>
                @if (testStatus() === 'success') {
                  <span class="test-ok"><mat-icon>check_circle</mat-icon>AI connection successful</span>
                }
              </div>
            </div>
          }

          <!-- Approval Workflow -->
          @if (activeSection() === 'approval') {
            <div class="settings-section card">
              <div class="section-hdr">
                <h2 class="section-hdr-title">Approval Workflow</h2>
                <p class="section-hdr-sub">Configure the approval hierarchy for increment letters</p>
              </div>

              <div class="approval-levels">
                @for (level of approvalLevels(); track level.id; let i = $index) {
                  <div class="approval-level-row">
                    <div class="level-order">{{ i + 1 }}</div>
                    <div class="level-icon">
                      <mat-icon>person</mat-icon>
                    </div>
                    <div class="level-info">
                      <p class="level-label">{{ level.label }}</p>
                      <p class="level-role">{{ level.role }}</p>
                    </div>
                    <div class="level-actions">
                      @if (i > 0) {
                        <button mat-icon-button matTooltip="Move Up" (click)="moveLevel(i, -1)">
                          <mat-icon>arrow_upward</mat-icon>
                        </button>
                      }
                      @if (i < approvalLevels().length - 1) {
                        <button mat-icon-button matTooltip="Move Down" (click)="moveLevel(i, 1)">
                          <mat-icon>arrow_downward</mat-icon>
                        </button>
                      }
                    </div>
                  </div>
                  @if (i < approvalLevels().length - 1) {
                    <div class="level-connector">
                      <mat-icon>arrow_downward</mat-icon>
                    </div>
                  }
                }
              </div>

              <div style="margin-top:20px; display:flex; gap:10px;">
                <button mat-button class="btn-secondary">
                  <mat-icon>add</mat-icon>
                  Add Approval Level
                </button>
                <button mat-flat-button class="btn-primary" (click)="saveWorkflow()">
                  <mat-icon>save</mat-icon>
                  Save Workflow
                </button>
              </div>
            </div>
          }

          <!-- Email Config -->
          @if (activeSection() === 'email') {
            <div class="settings-section card">
              <div class="section-hdr">
                <h2 class="section-hdr-title">Email Configuration</h2>
                <p class="section-hdr-sub">Configure SMTP settings for notifications</p>
              </div>
              <div class="settings-form">
                <mat-form-field appearance="outline">
                  <mat-label>SMTP Host</mat-label>
                  <input matInput placeholder="smtp.gmail.com" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>SMTP Port</mat-label>
                  <input matInput type="number" value="587" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Username</mat-label>
                  <input matInput placeholder="hr@company.com" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Password</mat-label>
                  <input matInput type="password" />
                  <mat-icon matSuffix>visibility_off</mat-icon>
                </mat-form-field>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>From Email</mat-label>
                  <input matInput placeholder="noreply@company.com" />
                </mat-form-field>
              </div>
            </div>
          }

          <!-- Security -->
          @if (activeSection() === 'security') {
            <div class="settings-section card">
              <div class="section-hdr">
                <h2 class="section-hdr-title">Security Settings</h2>
                <p class="section-hdr-sub">Manage authentication and access control</p>
              </div>
              <div class="toggles-list">
                <div class="toggle-item">
                  <div class="toggle-info">
                    <p class="toggle-label">Two-Factor Authentication</p>
                    <p class="toggle-desc">Require 2FA for all admin users</p>
                  </div>
                  <mat-slide-toggle color="primary" />
                </div>
                <hr class="toggle-divider" />
                <div class="toggle-item">
                  <div class="toggle-info">
                    <p class="toggle-label">Session Timeout</p>
                    <p class="toggle-desc">Auto-logout after 30 minutes of inactivity</p>
                  </div>
                  <mat-slide-toggle [checked]="true" color="primary" />
                </div>
                <hr class="toggle-divider" />
                <div class="toggle-item">
                  <div class="toggle-info">
                    <p class="toggle-label">Audit Logging</p>
                    <p class="toggle-desc">Log all HR operations for compliance</p>
                  </div>
                  <mat-slide-toggle [checked]="true" color="primary" />
                </div>
              </div>
            </div>
          }

          <!-- Placeholder for other sections -->
          @if (activeSection() === 'templates' || activeSection() === 'integrations') {
            <div class="settings-section card">
              <div class="section-hdr">
                <h2 class="section-hdr-title">{{ sectionLabel() }}</h2>
                <p class="section-hdr-sub">Configure {{ sectionLabel().toLowerCase() }} settings</p>
              </div>
              <div class="coming-soon">
                <mat-icon>construction</mat-icon>
                <p>This section is coming soon.</p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: var(--page-padding); }

    .settings-layout {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 16px;
      align-items: start;

      @media (max-width: 1023px) { grid-template-columns: 1fr; }
    }

    /* Nav */
    .settings-nav {
      padding: 8px;

      @media (max-width: 1023px) {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 4px;
        padding: 8px;
      }
    }

    .snav-item {
      display: flex; align-items: center; gap: 10px;
      width: 100%; padding: 9px 12px; border-radius: 8px;
      border: none; background: transparent; cursor: pointer;
      font-size: 0.875rem; font-weight: 500; color: var(--color-text-secondary);
      transition: all 0.15s; text-align: left;

      mat-icon { font-size: 18px; width: 18px; height: 18px; color: inherit; }

      &:hover { background: #f5f3ff; color: var(--color-primary); }
      &--active { background: #f5f3ff; color: var(--color-primary); font-weight: 600; }

      @media (max-width: 1023px) {
        width: auto;
        padding: 7px 12px;
        font-size: 0.8rem;
        border: 1px solid var(--color-border);

        &--active { border-color: var(--color-primary); }
      }

      @media (max-width: 479px) {
        span { display: none; }
        mat-icon { font-size: 20px !important; width: 20px !important; height: 20px !important; }
        padding: 8px 10px;
      }
    }

    /* Section */
    .settings-section { padding: 0; overflow: hidden; }

    .section-hdr {
      padding: 20px 24px;
      border-bottom: 1px solid var(--color-border);
    }

    .section-hdr-title { font-size: 1.05rem; font-weight: 700; color: var(--color-text-primary); margin: 0 0 3px; }
    .section-hdr-sub { font-size: 0.8rem; color: var(--color-text-secondary); margin: 0; }

    .settings-form {
      display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; padding: 20px 24px;

      @media (max-width: 767px) { grid-template-columns: 1fr; padding: 16px; }

      .full-width { grid-column: 1 / -1; }
    }

    mat-form-field { width: 100%; }

    /* Toggles */
    .toggles-section { padding: 0 24px 20px; @media (max-width: 479px) { padding: 0 16px 16px; } }
    .toggles-title { font-size: 0.875rem; font-weight: 700; color: var(--color-text-primary); margin: 0 0 14px; }
    .toggles-list { border: 1px solid var(--color-border); border-radius: 10px; overflow: hidden; padding: 0 16px; }
    .toggle-divider { border: none; border-top: 1px solid var(--color-border); margin: 0; }

    .toggle-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 0;
    }

    .toggle-info { flex: 1; }
    .toggle-label { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); margin: 0 0 2px; }
    .toggle-desc { font-size: 0.78rem; color: var(--color-text-secondary); margin: 0; }

    /* Test Connection */
    .test-connection {
      display: flex; align-items: center; gap: 12px;
      padding: 0 24px 20px;
    }

    .test-ok {
      display: flex; align-items: center; gap: 4px;
      font-size: 0.82rem; color: #10b981; font-weight: 600;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }

    /* Approval Levels */
    .approval-levels { padding: 20px 24px 0; }

    .approval-level-row {
      display: flex; align-items: center; gap: 14px;
      background: #f8f9fc; border: 1px solid var(--color-border);
      border-radius: 10px; padding: 14px 16px;
    }

    .level-order {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--color-primary); color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; font-weight: 800; flex-shrink: 0;
    }

    .level-icon {
      width: 36px; height: 36px; border-radius: 8px;
      background: white; border: 1px solid var(--color-border);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      mat-icon { font-size: 18px; width: 18px; height: 18px; color: #6b7280; }
    }

    .level-info { flex: 1; }
    .level-label { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); margin: 0 0 1px; }
    .level-role { font-size: 0.75rem; color: var(--color-text-muted); margin: 0; }

    .level-actions { display: flex; gap: 2px; }
    .level-connector { display: flex; justify-content: center; padding: 4px 0; mat-icon { color: #d1d5db; font-size: 18px; } }

    .coming-soon {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 60px; color: var(--color-text-muted);
      mat-icon { font-size: 36px; width: 36px; height: 36px; margin-bottom: 10px; }
      p { font-size: 0.875rem; margin: 0; }
    }
  `]
})
export class SettingsComponent {
  private settingsService = inject(SettingsService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  activeSection = signal<SettingsSection>('ai');
  testStatus = signal<'idle' | 'testing' | 'success' | 'error'>('idle');

  approvalLevels = signal(this.settingsService.getApprovalLevels());

  navItems: { key: SettingsSection; label: string; icon: string }[] = [
    { key: 'general', label: 'General', icon: 'settings' },
    { key: 'ai', label: 'AI Configuration', icon: 'auto_awesome' },
    { key: 'templates', label: 'Document Templates', icon: 'article' },
    { key: 'approval', label: 'Approval Workflow', icon: 'approval' },
    { key: 'email', label: 'Email Configuration', icon: 'email' },
    { key: 'security', label: 'Security', icon: 'security' },
    { key: 'integrations', label: 'Integrations', icon: 'extension' },
  ];

  private _aiSettings = this.settingsService.getAISettings();

  aiForm = this.fb.group({
    provider: [this._aiSettings.provider as AIProvider],
    model: [this._aiSettings.model],
    temperature: [this._aiSettings.temperature, [Validators.min(0), Validators.max(1)]],
    maxTokens: [this._aiSettings.maxTokens],
    apiKey: [''],
    enableValidation: [this._aiSettings.enableValidation],
    enableLetterGeneration: [this._aiSettings.enableLetterGeneration],
    enableAnnexureGeneration: [this._aiSettings.enableAnnexureGeneration],
  });

  availableModels = signal(this.settingsService.getModels(this._aiSettings.provider));

  sectionLabel() {
    return this.navItems.find(n => n.key === this.activeSection())?.label ?? '';
  }

  onProviderChange() {
    const provider = this.aiForm.value.provider as AIProvider ?? 'OpenAI';
    const models = this.settingsService.getModels(provider);
    this.availableModels.set(models);
    this.aiForm.patchValue({ model: models[0] });
  }

  testConnection() {
    this.testStatus.set('testing');
    setTimeout(() => this.testStatus.set('success'), 1800);
  }

  moveLevel(idx: number, dir: number) {
    this.approvalLevels.update(levels => {
      const arr = [...levels];
      const tmp = arr[idx];
      arr[idx] = arr[idx + dir];
      arr[idx + dir] = tmp;
      return arr;
    });
  }

  saveWorkflow() {
    this.settingsService.saveApprovalLevels(this.approvalLevels());
    this.snackBar.open('Approval workflow saved!', 'Close', { duration: 2500 });
  }

  saveAll() {
    const v = this.aiForm.value;
    this.settingsService.saveAISettings({
      provider: v.provider as AIProvider ?? 'OpenAI',
      model: v.model ?? '',
      temperature: v.temperature ?? 0.2,
      maxTokens: v.maxTokens ?? 2000,
      enableValidation: v.enableValidation ?? true,
      enableLetterGeneration: v.enableLetterGeneration ?? true,
      enableAnnexureGeneration: v.enableAnnexureGeneration ?? true,
    });
    this.snackBar.open('Settings saved successfully!', 'Close', { duration: 2500 });
  }
}
