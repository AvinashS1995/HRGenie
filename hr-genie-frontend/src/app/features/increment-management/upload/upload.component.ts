import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

type UploadStep = 'idle' | 'uploading' | 'reading' | 'validating' | 'calculating' | 'ai' | 'done';

const TEMPLATE_COLUMNS = [
  'Employee ID', 'Employee Name', 'Current CTC', 'Increment %',
  'Revised CTC', 'Effective Date', 'Department', 'Designation', 'Remarks'
];

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule, MatIconModule, MatButtonModule,
    MatStepperModule, MatProgressBarModule, PageHeaderComponent,
  ],
  template: `
    <div class="page-container fade-in-up">
      <app-page-header
        title="Upload Increment Data"
        subtitle="Upload Excel file containing employee increment details"
      />

      <!-- Horizontal Stepper -->
      <div class="stepper-card card">
        <div class="stepper-header">
          @for (step of steps; track step.label; let i = $index) {
            <div class="step-item" [class.step-active]="currentStep() === i" [class.step-done]="currentStep() > i">
              <div class="step-circle">
                @if (currentStep() > i) {
                  <mat-icon>check</mat-icon>
                } @else {
                  <span>{{ i + 1 }}</span>
                }
              </div>
              <span class="step-label">{{ step.label }}</span>
              @if (i < steps.length - 1) {
                <div class="step-line" [class.step-line--done]="currentStep() > i"></div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Step 0: Upload File -->
      @if (currentStep() === 0) {
        <div class="upload-layout">

          <!-- Upload Zone -->
          <div class="upload-zone-card card">
            <div
              class="dropzone"
              [class.dropzone--active]="isDragOver()"
              [class.dropzone--file]="selectedFile()"
              (dragover)="onDragOver($event)"
              (dragleave)="isDragOver.set(false)"
              (drop)="onDrop($event)"
            >
              @if (!selectedFile()) {
                <div class="dropzone-empty">
                  <div class="dropzone-icon">
                    <mat-icon>cloud_upload</mat-icon>
                  </div>
                  <h3 class="dropzone-title">Drag & Drop Excel File Here</h3>
                  <p class="dropzone-or">or</p>
                  <label class="browse-btn">
                    <input type="file" accept=".xlsx,.xls" (change)="onFileSelected($event)" hidden />
                    <mat-icon>folder_open</mat-icon>
                    Browse File
                  </label>
                  <div class="dropzone-hints">
                    <span><strong>Supported formats:</strong> .xlsx, .xls</span>
                    <span><strong>Maximum file size:</strong> 10MB</span>
                  </div>
                </div>
              } @else {
                <div class="dropzone-file">
                  <div class="file-icon">
                    <mat-icon>description</mat-icon>
                  </div>
                  <div class="file-info">
                    <p class="file-name">{{ selectedFile()!.name }}</p>
                    <p class="file-size">{{ formatSize(selectedFile()!.size) }}</p>
                  </div>
                  <button mat-icon-button (click)="clearFile()" class="remove-file">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              }
            </div>
          </div>

          <!-- Template Card -->
          <div class="template-card card">
            <div class="template-header">
              <mat-icon>download</mat-icon>
              <h3>Download Template</h3>
            </div>
            <p class="template-desc">Use our template to upload increment data correctly.</p>
            <button mat-flat-button class="btn-primary download-btn">
              <mat-icon>download</mat-icon>
              Download Excel Template
            </button>
            <div class="template-columns">
              <p class="template-cols-title">Template Columns:</p>
              @for (col of templateColumns; track col) {
                <div class="template-col-item">
                  <mat-icon>check_circle</mat-icon>
                  <span>{{ col }}</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Bottom Actions -->
        <div class="step-actions">
          <button mat-button class="btn-secondary" (click)="goToCycles()">
            <mat-icon>arrow_back</mat-icon>
            Cancel
          </button>
          <button mat-flat-button class="btn-primary" [disabled]="!selectedFile()" (click)="startUpload()">
            Next
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>
      }

      <!-- Step 1: Processing -->
      @if (currentStep() === 1) {
        <div class="processing-card card">
          <div class="processing-content">
            <div class="processing-icon">
              <mat-icon class="spin">sync</mat-icon>
            </div>
            <h2 class="processing-title">Processing Your File</h2>
            <p class="processing-sub">Please wait while we analyze and validate your data...</p>

            <!-- Progress Steps -->
            <div class="process-steps">
              @for (ps of processSteps; track ps.label; let i = $index) {
                <div class="process-step" [class.ps-done]="processStepIdx() > i" [class.ps-active]="processStepIdx() === i">
                  <div class="ps-dot">
                    @if (processStepIdx() > i) {
                      <mat-icon>check</mat-icon>
                    } @else if (processStepIdx() === i) {
                      <div class="ps-pulse"></div>
                    }
                  </div>
                  <span class="ps-label">{{ ps.label }}</span>
                  @if (processStepIdx() > i) {
                    <mat-icon class="ps-done-icon">check_circle</mat-icon>
                  }
                </div>
              }
            </div>

            <!-- Progress Bar -->
            <div class="progress-wrapper">
              <mat-progress-bar
                mode="determinate"
                [value]="progress()"
                color="primary"
              />
              <span class="progress-label">{{ progress() }}%</span>
            </div>
          </div>
        </div>
      }

      <!-- Step 2: Done → navigate to validation -->
      @if (currentStep() === 2) {
        <div class="success-card card">
          <div class="success-content">
            <div class="success-icon">
              <mat-icon>check_circle</mat-icon>
            </div>
            <h2>File Processed Successfully!</h2>
            <p>312 records have been loaded and are ready for review.</p>
            <button mat-flat-button class="btn-primary" (click)="goToValidation()">
              <mat-icon>verified</mat-icon>
              View Validation Results
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: var(--page-padding); }

    /* ─── Stepper Header ─── */
    .stepper-card { padding: 24px; margin-bottom: 24px; }

    .stepper-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      overflow-x: auto;
      padding-bottom: 4px;
    }

    .step-item {
      display: flex;
      align-items: center;
      gap: 0;
      flex: 1;
      max-width: 200px;
      position: relative;
      min-width: 80px;
    }

    .step-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #e5e7eb;
      background: white;
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--color-text-muted);
      flex-shrink: 0;
      transition: all 0.2s;
      z-index: 1;

      mat-icon { font-size: 16px; width: 16px; height: 16px; color: white; }
    }

    .step-label {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--color-text-muted);
      margin-left: 8px;
      white-space: nowrap;
      transition: color 0.2s;
    }

    .step-line {
      flex: 1;
      height: 2px;
      background: #e5e7eb;
      margin: 0 12px;
      transition: background 0.3s;

      &--done { background: var(--color-primary); }
    }

    .step-active {
      .step-circle {
        border-color: var(--color-primary);
        background: var(--color-primary);
        color: white;
        box-shadow: 0 0 0 4px rgba(124,58,237,0.12);
      }
      .step-label { color: var(--color-primary); font-weight: 600; }
    }

    .step-done {
      .step-circle {
        border-color: #10b981;
        background: #10b981;
      }
      .step-label { color: #059669; }
    }

    /* ─── Upload Layout ─── */
    .upload-layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 20px;
      margin-bottom: 20px;

      @media (max-width: 1023px) { grid-template-columns: 1fr; }
    }

    .upload-zone-card { padding: 24px; }

    .dropzone {
      border: 2px dashed #d1d5db;
      border-radius: 12px;
      padding: 48px 32px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      min-height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;

      &--active {
        border-color: var(--color-primary);
        background: #faf5ff;
      }

      &--file {
        border-style: solid;
        border-color: #10b981;
        background: #f0fdf4;
      }
    }

    .dropzone-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; }

    .dropzone-icon {
      width: 64px; height: 64px;
      background: #f5f3ff; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 8px;

      mat-icon { font-size: 32px; width: 32px; height: 32px; color: #8b5cf6; }
    }

    .dropzone-title { font-size: 1.1rem; font-weight: 700; color: var(--color-text-primary); margin: 0; }
    .dropzone-or { font-size: 0.875rem; color: var(--color-text-muted); margin: 4px 0; }

    .browse-btn {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--color-primary); color: white;
      padding: 8px 20px; border-radius: 8px;
      font-size: 0.875rem; font-weight: 600;
      cursor: pointer; transition: background 0.15s;

      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover { background: var(--color-primary-dark); }
    }

    .dropzone-hints {
      display: flex;
      gap: 20px;
      margin-top: 8px;
      font-size: 0.78rem;
      color: var(--color-text-muted);
      flex-wrap: wrap;
      justify-content: center;
    }

    .dropzone-file {
      display: flex; align-items: center; gap: 14px;
      padding: 16px 20px; background: white;
      border-radius: 10px; border: 1px solid #d1fae5; width: 100%;
    }

    .file-icon {
      width: 44px; height: 44px; background: #f0fdf4;
      border-radius: 8px; display: flex; align-items: center; justify-content: center;
      mat-icon { color: #10b981; font-size: 24px; width: 24px; height: 24px; }
    }

    .file-info { flex: 1; }
    .file-name { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); margin: 0 0 2px; }
    .file-size { font-size: 0.75rem; color: var(--color-text-muted); margin: 0; }

    .remove-file { color: #ef4444 !important; }

    /* ─── Template Card ─── */
    .template-card { padding: 20px; }

    .template-header {
      display: flex; align-items: center; gap: 8px;
      margin-bottom: 8px;

      mat-icon { color: var(--color-primary); font-size: 20px; width: 20px; height: 20px; }
      h3 { font-size: 0.95rem; font-weight: 700; color: var(--color-text-primary); margin: 0; }
    }

    .template-desc { font-size: 0.8rem; color: var(--color-text-secondary); margin: 0 0 14px; }
    .download-btn { width: 100%; margin-bottom: 20px !important; }

    .template-cols-title { font-size: 0.78rem; font-weight: 600; color: var(--color-text-secondary); margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.04em; }

    .template-col-item {
      display: flex; align-items: center; gap: 6px;
      font-size: 0.78rem; color: var(--color-text-secondary);
      padding: 3px 0;

      mat-icon { font-size: 13px; width: 13px; height: 13px; color: #10b981; }
    }

    /* ─── Step Actions ─── */
    .step-actions {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 0;
    }

    /* ─── Processing ─── */
    .processing-card { padding: 48px 24px; }

    .processing-content {
      max-width: 480px; margin: 0 auto; text-align: center;
    }

    .processing-icon {
      width: 72px; height: 72px;
      background: #f5f3ff; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;

      mat-icon { font-size: 36px; width: 36px; height: 36px; color: #8b5cf6; }
    }

    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .spin { animation: spin 1s linear infinite; }

    .processing-title { font-size: 1.25rem; font-weight: 700; color: var(--color-text-primary); margin: 0 0 6px; }
    .processing-sub { font-size: 0.875rem; color: var(--color-text-secondary); margin: 0 0 32px; }

    .process-steps { display: flex; flex-direction: column; gap: 0; text-align: left; margin-bottom: 28px; }

    .process-step {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 16px; border-radius: 8px;
      transition: background 0.2s;
    }

    .ps-active { background: #faf5ff; }

    .ps-dot {
      width: 20px; height: 20px; border-radius: 50%;
      border: 2px solid #e5e7eb;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; background: white;

      mat-icon { font-size: 12px; width: 12px; height: 12px; color: #10b981; }
    }

    .ps-active .ps-dot { border-color: var(--color-primary); }
    .ps-done .ps-dot { border-color: #10b981; background: #10b981; }

    .ps-pulse {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--color-primary);
      animation: pulse 1s infinite;
    }

    @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.4); } }

    .ps-label { font-size: 0.875rem; font-weight: 500; color: var(--color-text-secondary); flex: 1; }
    .ps-active .ps-label { color: var(--color-primary); font-weight: 600; }
    .ps-done .ps-label { color: #059669; }

    .ps-done-icon { font-size: 16px !important; width: 16px !important; height: 16px !important; color: #10b981 !important; }

    .progress-wrapper { position: relative; }
    .progress-label {
      position: absolute; right: 0; top: -20px;
      font-size: 0.78rem; font-weight: 700; color: var(--color-primary);
    }

    /* ─── Success ─── */
    .success-card { padding: 64px 24px; }
    .success-content { max-width: 400px; margin: 0 auto; text-align: center; }

    .success-icon {
      width: 80px; height: 80px; background: #f0fdf4;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;

      mat-icon { font-size: 40px; width: 40px; height: 40px; color: #10b981; }
    }

    .success-content h2 { font-size: 1.25rem; font-weight: 700; margin: 0 0 8px; }
    .success-content p { color: var(--color-text-secondary); font-size: 0.875rem; margin: 0 0 24px; }
  `]
})
export class UploadComponent {
  private router = inject(Router);

  currentStep = signal(0);
  isDragOver = signal(false);
  selectedFile = signal<File | null>(null);
  processStepIdx = signal(0);
  progress = signal(0);

  templateColumns = TEMPLATE_COLUMNS;

  steps = [
    { label: 'Upload File' },
    { label: 'Validate Data' },
    { label: 'Preview & Confirm' },
    { label: 'Processing' },
  ];

  processSteps = [
    { label: 'Uploading' },
    { label: 'Reading Excel' },
    { label: 'Validating' },
    { label: 'Calculating' },
    { label: 'AI Analysis' },
    { label: 'Ready for Review' },
  ];

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragOver.set(true);
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragOver.set(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && this.isValidFile(file)) this.selectedFile.set(file);
  }

  onFileSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file && this.isValidFile(file)) this.selectedFile.set(file);
  }

  isValidFile(file: File): boolean {
    return file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
  }

  clearFile() { this.selectedFile.set(null); }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  startUpload() {
    this.currentStep.set(1);
    this.runProcessingSteps();
  }

  private runProcessingSteps() {
    let step = 0;
    const totalSteps = this.processSteps.length;
    const interval = setInterval(() => {
      this.processStepIdx.set(step);
      this.progress.set(Math.round(((step + 1) / totalSteps) * 100));
      step++;
      if (step >= totalSteps) {
        clearInterval(interval);
        setTimeout(() => this.currentStep.set(2), 600);
      }
    }, 700);
  }

  goToCycles() { this.router.navigate(['/increment/cycles']); }

  goToValidation() {
    this.router.navigate(['/increment/validation']);
  }
}
