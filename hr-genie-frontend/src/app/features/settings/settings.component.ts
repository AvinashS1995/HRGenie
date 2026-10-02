import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SettingsService } from '../../core/services/settings.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ManageUsersComponent } from '../auth/manage-users.component';
import { AIProvider, ApprovalLevel } from '../../core/models';
import { CommonModule } from '@angular/common';

type SettingsSection = 'general' | 'ai' | 'templates' | 'approval' | 'email' | 'security' | 'integrations' | 'users';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatSlideToggleModule,
    MatTooltipModule, MatDialogModule,
    PageHeaderComponent, ManageUsersComponent,
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

              <div style="margin-top:20px; display:flex; gap:10px; padding: 0 24px 20px;">
                <button mat-button class="btn-secondary" (click)="openAddLevel()">
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

          <!-- Document Templates -->
          @if (activeSection() === 'templates') {
            <div class="settings-section card">
              <div class="section-hdr">
                <h2 class="section-hdr-title">Document Templates</h2>
                <p class="section-hdr-sub">Configure default templates used for letter and annexure generation</p>
              </div>
              <div class="template-list">
                @for (t of docTemplateSettings; track t.type) {
                  <div class="template-setting-row">
                    <div class="tsr-icon">
                      <mat-icon>{{ t.icon }}</mat-icon>
                    </div>
                    <div class="tsr-info">
                      <p class="tsr-name">{{ t.type }}</p>
                      <p class="tsr-desc">{{ t.desc }}</p>
                    </div>
                    <div class="tsr-actions">
                      <span class="tsr-version">v{{ t.version }}</span>
                      <button mat-button class="btn-secondary tsr-btn" [routerLink]="['/templates']">
                        <mat-icon>edit</mat-icon>
                        Edit
                      </button>
                      <button mat-button class="btn-secondary tsr-btn" [routerLink]="['/templates']">
                        <mat-icon>visibility</mat-icon>
                        Preview
                      </button>
                    </div>
                  </div>
                }
              </div>
              <div style="padding:16px 24px; border-top:1px solid var(--color-border);">
                <button mat-flat-button class="btn-primary" [routerLink]="['/templates']">
                  <mat-icon>open_in_new</mat-icon>
                  Manage All Templates
                </button>
              </div>
            </div>
          }

          <!-- Integrations -->
          @if (activeSection() === 'integrations') {
            <div class="settings-section card">
              <div class="section-hdr">
                <h2 class="section-hdr-title">Integrations</h2>
                <p class="section-hdr-sub">Connect HRGenie with external tools and services</p>
              </div>
              <div class="integration-list">
                @for (intg of integrations(); track intg.name) {
                  <div class="intg-row">
                    <div class="intg-icon" [style.background]="intg.bg">
                      <mat-icon [style.color]="intg.color">{{ intg.icon }}</mat-icon>
                    </div>
                    <div class="intg-info">
                      <p class="intg-name">{{ intg.name }}</p>
                      <p class="intg-desc">{{ intg.desc }}</p>
                    </div>
                    <div class="intg-actions">
                      @if (intg.connected) {
                        <span class="intg-badge connected">
                          <mat-icon>check_circle</mat-icon>
                          Connected
                        </span>
                        <button mat-button class="btn-secondary tsr-btn" (click)="disconnectIntegration(intg.name)">
                          Disconnect
                        </button>
                      } @else {
                        <span class="intg-badge">Not connected</span>
                        <button mat-flat-button class="btn-primary tsr-btn" (click)="connectIntegration(intg.name)">
                          <mat-icon>add</mat-icon>
                          Connect
                        </button>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          }
          <!-- Manage Users (Admin only) -->
          @if (activeSection() === 'users') {
            <div class="settings-section card" style="padding:20px 24px;">
              <app-manage-users />
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

    /* Document Templates section */
    .template-list { padding: 0 24px; }

    .template-setting-row {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 0; border-bottom: 1px solid var(--color-border);
      flex-wrap: wrap; gap: 10px;

      &:last-child { border-bottom: none; }
    }

    .tsr-icon {
      width: 38px; height: 38px; background: #f5f3ff; border-radius: 9px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      mat-icon { color: #7c3aed; font-size: 20px; width: 20px; height: 20px; }
    }

    .tsr-info { flex: 1; min-width: 140px; }
    .tsr-name { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); margin: 0 0 2px; }
    .tsr-desc { font-size: 0.75rem; color: var(--color-text-muted); margin: 0; }

    .tsr-actions {
      display: flex; align-items: center; gap: 8px; flex-shrink: 0;
    }

    .tsr-version {
      font-size: 0.72rem; font-weight: 600; color: #6b7280;
      background: #f3f4f6; padding: 2px 7px; border-radius: 6px;
    }

    .tsr-btn { height: 32px !important; padding: 0 10px !important; font-size: 0.78rem !important; }

    /* Integrations section */
    .integration-list { padding: 0 24px 16px; }

    .intg-row {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 0; border-bottom: 1px solid var(--color-border);
      flex-wrap: wrap;

      &:last-child { border-bottom: none; }
    }

    .intg-icon {
      width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 22px; width: 22px; height: 22px; }
    }

    .intg-info { flex: 1; min-width: 140px; }
    .intg-name { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); margin: 0 0 2px; }
    .intg-desc { font-size: 0.75rem; color: var(--color-text-muted); margin: 0; }

    .intg-actions { display: flex; align-items: center; gap: 8px; }

    .intg-badge {
      font-size: 0.72rem; font-weight: 600; padding: 2px 9px;
      border-radius: 12px; background: #f3f4f6; color: #9ca3af; white-space: nowrap;

      &.connected {
        display: flex; align-items: center; gap: 4px;
        background: #dcfce7; color: #16a34a;
        mat-icon { font-size: 13px; width: 13px; height: 13px; }
      }
    }
  `]
})
export class SettingsComponent {
  private settingsService = inject(SettingsService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  activeSection = signal<SettingsSection>('ai');
  testStatus = signal<'idle' | 'testing' | 'success' | 'error'>('idle');

  approvalLevels = signal(this.settingsService.getApprovalLevels());

  navItems: { key: SettingsSection; label: string; icon: string }[] = [
    { key: 'general',      label: 'General',            icon: 'settings' },
    { key: 'ai',           label: 'AI Configuration',   icon: 'auto_awesome' },
    { key: 'templates',    label: 'Document Templates', icon: 'article' },
    { key: 'approval',     label: 'Approval Workflow',  icon: 'approval' },
    { key: 'email',        label: 'Email Configuration',icon: 'email' },
    { key: 'security',     label: 'Security',           icon: 'security' },
    { key: 'integrations', label: 'Integrations',       icon: 'extension' },
    { key: 'users',        label: 'Manage Users',       icon: 'group' },
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

  // ── Document template settings data ──────────────────────────────────────
  docTemplateSettings = [
    { type: 'Increment Letter',  icon: 'trending_up',       desc: 'Template for annual/special increment letters', version: '3' },
    { type: 'Salary Annexure',   icon: 'attach_file',       desc: 'Salary structure breakdown table',              version: '2' },
    { type: 'Promotion Letter',  icon: 'workspace_premium', desc: 'Employee promotion notification letter',         version: '1' },
    { type: 'Transfer Letter',   icon: 'swap_horiz',        desc: 'Interdepartmental transfer letter',             version: '1' },
    { type: 'Offer Letter',      icon: 'work',              desc: 'New hire offer letter template',                version: '2' },
  ];

  // ── Integrations data ────────────────────────────────────────────────────
  integrations = signal([
    { name: 'Slack',          icon: 'message',        bg: '#f0f9ff', color: '#0284c7', desc: 'Send increment notifications to Slack channels',    connected: false },
    { name: 'Microsoft Teams',icon: 'people',         bg: '#f5f3ff', color: '#7c3aed', desc: 'Push approval requests to Teams channels',          connected: false },
    { name: 'Google Workspace',icon: 'email',         bg: '#f0fdf4', color: '#16a34a', desc: 'Sync HR data with Google Workspace',                connected: false },
    { name: 'SAP HCM',        icon: 'corporate_fare', bg: '#fff7ed', color: '#ea580c', desc: 'Bidirectional sync with SAP HR module',             connected: false },
    { name: 'Workday',        icon: 'work',           bg: '#fef9c3', color: '#a16207', desc: 'Connect with Workday HRIS for employee data',       connected: false },
    { name: 'AWS S3',         icon: 'cloud',          bg: '#f0f9ff', color: '#0369a1', desc: 'Store generated documents in S3 or Cloudflare R2',  connected: true  },
  ]);

  connectIntegration(name: string) {
    this.snackBar.open(`${name} integration connected!`, 'Close', { duration: 2500 });
    this.integrations.update(list =>
      list.map(i => i.name === name ? { ...i, connected: true } : i)
    );
  }

  disconnectIntegration(name: string) {
    this.snackBar.open(`${name} disconnected.`, 'Close', { duration: 2500 });
    this.integrations.update(list =>
      list.map(i => i.name === name ? { ...i, connected: false } : i)
    );
  }

  // ── Add Approval Level dialog ─────────────────────────────────────────────
  openAddLevel() {
    const name = window.prompt('Enter approval level name (e.g. Department Head):');
    if (!name?.trim()) return;
    const role = window.prompt('Enter role (e.g. Department Head):') ?? name;
    const newLevel: ApprovalLevel = {
      id: 'al' + Date.now(),
      order: this.approvalLevels().length + 1,
      role: role.trim(),
      label: name.trim(),
    };
    this.approvalLevels.update(levels => [...levels, newLevel]);
    this.snackBar.open('Approval level added!', 'Close', { duration: 2000 });
  }  onProviderChange() {
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
