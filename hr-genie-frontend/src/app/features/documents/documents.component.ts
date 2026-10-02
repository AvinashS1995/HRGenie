import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusChipComponent } from '../../shared/components/status-chip/status-chip.component';

// ─── Generate Document Dialog ────────────────────────────────────────────────
@Component({
  selector: 'app-gen-doc-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule,
            MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule],
  template: `
    <div style="width:460px; max-width:95vw;">
      <div style="display:flex;align-items:center;gap:12px;padding:18px 20px 14px;border-bottom:1px solid var(--color-border);">
        <div style="width:38px;height:38px;background:#f5f3ff;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <mat-icon style="color:#7c3aed;font-size:20px;width:20px;height:20px;">description</mat-icon>
        </div>
        <div>
          <h2 style="font-size:1rem;font-weight:700;color:var(--color-text-primary);margin:0 0 1px;">Generate Document</h2>
          <p style="font-size:0.75rem;color:var(--color-text-muted);margin:0;">Create a new HR document for an employee</p>
        </div>
        <button mat-icon-button style="margin-left:auto;" (click)="ref.close()"><mat-icon>close</mat-icon></button>
      </div>
      <form [formGroup]="form" (ngSubmit)="submit()" style="padding:16px 20px 20px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 14px;">
          <mat-form-field appearance="outline" style="grid-column:1/-1;width:100%;">
            <mat-label>Employee</mat-label>
            <mat-select formControlName="employee">
              @for (e of employees; track e.id) {
                <mat-option [value]="e.id">{{ e.name }} ({{ e.id }})</mat-option>
              }
            </mat-select>
            <mat-error>Select an employee</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" style="width:100%;">
            <mat-label>Document Type</mat-label>
            <mat-select formControlName="type">
              <mat-option value="Increment Letter">Increment Letter</mat-option>
              <mat-option value="Annexure">Annexure</mat-option>
              <mat-option value="Promotion Letter">Promotion Letter</mat-option>
              <mat-option value="Transfer Letter">Transfer Letter</mat-option>
              <mat-option value="Offer Letter">Offer Letter</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" style="width:100%;">
            <mat-label>Template</mat-label>
            <mat-select formControlName="template">
              <mat-option value="default">Default Template</mat-option>
              <mat-option value="v2">Version 2</mat-option>
              <mat-option value="v3">Version 3</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" style="grid-column:1/-1;width:100%;">
            <mat-label>Remarks (optional)</mat-label>
            <input matInput formControlName="remarks" placeholder="Any notes for this document..." />
          </mat-form-field>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:8px;padding-top:14px;border-top:1px solid var(--color-border);">
          <button type="button" mat-button class="btn-secondary" (click)="ref.close()">Cancel</button>
          <button type="submit" mat-flat-button class="btn-primary" [disabled]="form.invalid">
            <mat-icon>auto_awesome</mat-icon>Generate
          </button>
        </div>
      </form>
    </div>
  `,
})
export class GenDocDialogComponent {
  readonly ref = inject(MatDialogRef<GenDocDialogComponent>);
  private fb   = inject(FormBuilder);

  employees = [
    { id: 'EMP001', name: 'Rahul Sharma' },
    { id: 'EMP002', name: 'Priya Patel' },
    { id: 'EMP003', name: 'Amit Kumar' },
    { id: 'EMP004', name: 'Sneha Desai' },
    { id: 'EMP005', name: 'Vikram Singh' },
    { id: 'EMP006', name: 'Neha Gupta' },
    { id: 'EMP007', name: 'Pooja Jain' },
    { id: 'EMP008', name: 'Karan Mehta' },
  ];

  form = this.fb.group({
    employee: ['', Validators.required],
    type:     ['Increment Letter', Validators.required],
    template: ['default'],
    remarks:  [''],
  });

  submit() { if (this.form.valid) this.ref.close(this.form.value); }
}

type DocType = 'Increment Letter' | 'Annexure' | 'Promotion Letter' | 'Transfer Letter' | 'Offer Letter';
type DocStatus = 'Generated' | 'Sent' | 'Pending' | 'Draft';

interface HRDocument {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: DocType;
  status: DocStatus;
  generatedOn: string;
  sentOn?: string;
  size: string;
  cycleYear?: number;
}

const MOCK_DOCS: HRDocument[] = [
  { id: 'd1',  employeeId: 'EMP001', employeeName: 'Rahul Sharma',  department: 'Sales',     type: 'Increment Letter', status: 'Sent',      generatedOn: '26 Sep 2026', sentOn: '26 Sep 2026', size: '48 KB', cycleYear: 2026 },
  { id: 'd2',  employeeId: 'EMP001', employeeName: 'Rahul Sharma',  department: 'Sales',     type: 'Annexure',         status: 'Sent',      generatedOn: '26 Sep 2026', sentOn: '26 Sep 2026', size: '32 KB', cycleYear: 2026 },
  { id: 'd3',  employeeId: 'EMP002', employeeName: 'Priya Patel',   department: 'Marketing', type: 'Increment Letter', status: 'Generated', generatedOn: '25 Sep 2026', size: '46 KB', cycleYear: 2026 },
  { id: 'd4',  employeeId: 'EMP002', employeeName: 'Priya Patel',   department: 'Marketing', type: 'Annexure',         status: 'Generated', generatedOn: '25 Sep 2026', size: '30 KB', cycleYear: 2026 },
  { id: 'd5',  employeeId: 'EMP003', employeeName: 'Amit Kumar',    department: 'IT',        type: 'Increment Letter', status: 'Pending',   generatedOn: '24 Sep 2026', size: '44 KB', cycleYear: 2026 },
  { id: 'd6',  employeeId: 'EMP004', employeeName: 'Sneha Desai',   department: 'Finance',   type: 'Increment Letter', status: 'Sent',      generatedOn: '24 Sep 2026', sentOn: '25 Sep 2026', size: '47 KB', cycleYear: 2026 },
  { id: 'd7',  employeeId: 'EMP004', employeeName: 'Sneha Desai',   department: 'Finance',   type: 'Annexure',         status: 'Sent',      generatedOn: '24 Sep 2026', sentOn: '25 Sep 2026', size: '31 KB', cycleYear: 2026 },
  { id: 'd8',  employeeId: 'EMP005', employeeName: 'Vikram Singh',  department: 'HR',        type: 'Promotion Letter', status: 'Generated', generatedOn: '20 Sep 2026', size: '52 KB' },
  { id: 'd9',  employeeId: 'EMP006', employeeName: 'Neha Gupta',    department: 'Operations',type: 'Transfer Letter',  status: 'Sent',      generatedOn: '18 Sep 2026', sentOn: '19 Sep 2026', size: '38 KB' },
  { id: 'd10', employeeId: 'EMP007', employeeName: 'Pooja Jain',    department: 'HR',        type: 'Increment Letter', status: 'Draft',     generatedOn: '26 Sep 2026', size: '44 KB', cycleYear: 2026 },
  { id: 'd11', employeeId: 'EMP008', employeeName: 'Karan Mehta',   department: 'IT',        type: 'Offer Letter',     status: 'Sent',      generatedOn: '10 Sep 2026', sentOn: '10 Sep 2026', size: '55 KB' },
  { id: 'd12', employeeId: 'EMP003', employeeName: 'Amit Kumar',    department: 'IT',        type: 'Annexure',         status: 'Pending',   generatedOn: '24 Sep 2026', size: '29 KB', cycleYear: 2026 },
];

const TYPE_ICONS: Record<DocType, string> = {
  'Increment Letter': 'trending_up',
  'Annexure':         'attach_file',
  'Promotion Letter': 'workspace_premium',
  'Transfer Letter':  'swap_horiz',
  'Offer Letter':     'work',
};

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatTableModule,
    MatTooltipModule, MatTabsModule, MatDialogModule,
    PageHeaderComponent, StatusChipComponent,
  ],
  template: `
    <div class="page-container fade-in-up">
      <app-page-header
        title="Documents"
        subtitle="All generated HR letters, annexures and employment documents"
      >
        <button mat-button class="btn-secondary">
          <mat-icon>download</mat-icon>
          Export List
        </button>
        <button mat-flat-button class="btn-primary" (click)="openGenerate()">
          <mat-icon>add</mat-icon>
          Generate Document
        </button>
      </app-page-header>

      <!-- Summary KPIs -->
      <div class="doc-kpi-row">
        @for (k of kpis; track k.label) {
          <div class="doc-kpi card">
            <div class="dkpi-icon" [style.background]="k.bg">
              <mat-icon [style.color]="k.color">{{ k.icon }}</mat-icon>
            </div>
            <div class="dkpi-text">
              <p class="dkpi-val">{{ k.value }}</p>
              <p class="dkpi-label">{{ k.label }}</p>
            </div>
          </div>
        }
      </div>

      <!-- Filters -->
      <div class="card" style="overflow:hidden;">
        <div class="doc-toolbar">
          <mat-form-field appearance="outline" class="search-f">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput [formControl]="searchCtrl" placeholder="Search by employee name or ID..." />
          </mat-form-field>
          <mat-form-field appearance="outline" style="width:170px;">
            <mat-label>Document Type</mat-label>
            <mat-select [formControl]="typeCtrl">
              <mat-option value="">All Types</mat-option>
              @for (t of docTypes; track t) { <mat-option [value]="t">{{ t }}</mat-option> }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" style="width:150px;">
            <mat-label>Status</mat-label>
            <mat-select [formControl]="statusCtrl">
              <mat-option value="">All Status</mat-option>
              <mat-option value="Generated">Generated</mat-option>
              <mat-option value="Sent">Sent</mat-option>
              <mat-option value="Pending">Pending</mat-option>
              <mat-option value="Draft">Draft</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" style="width:150px;">
            <mat-label>Department</mat-label>
            <mat-select [formControl]="deptCtrl">
              <mat-option value="">All Depts</mat-option>
              @for (d of depts; track d) { <mat-option [value]="d">{{ d }}</mat-option> }
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Stat tabs -->
        <div class="stat-tabs">
          @for (t of statTabs; track t.label) {
            <button
              class="stat-tab"
              [class.active]="activeTab() === t.value"
              (click)="activeTab.set(t.value)"
            >
              {{ t.label }}
              <span class="stab-count" [class]="'stab-' + t.value">{{ t.count }}</span>
            </button>
          }
        </div>

        <!-- Table -->
        <div style="overflow-x:auto;">
          <table mat-table [dataSource]="filtered()" style="width:100%;">

            <ng-container matColumnDef="doc">
              <th mat-header-cell *matHeaderCellDef>Document</th>
              <td mat-cell *matCellDef="let d">
                <div class="doc-cell">
                  <div class="doc-icon-wrap" [class]="'doc-icon--' + slugType(d.type)">
                    <mat-icon>{{ typeIcon(d.type) }}</mat-icon>
                  </div>
                  <div>
                    <p class="doc-name">{{ d.type }}</p>
                    <p class="doc-size">{{ d.size }}{{ d.cycleYear ? ' · FY ' + d.cycleYear : '' }}</p>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="employee">
              <th mat-header-cell *matHeaderCellDef>Employee</th>
              <td mat-cell *matCellDef="let d">
                <div style="display:flex;align-items:center;gap:9px;">
                  <div class="emp-av">{{ d.employeeName[0] }}</div>
                  <div>
                    <p class="emp-nm">{{ d.employeeName }}</p>
                    <p class="emp-id">{{ d.employeeId }}</p>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef>Department</th>
              <td mat-cell *matCellDef="let d">
                <span class="dept-tag">{{ d.department }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let d">
                <app-status-chip [type]="statusType(d.status)" [label]="d.status"/>
              </td>
            </ng-container>

            <ng-container matColumnDef="generatedOn">
              <th mat-header-cell *matHeaderCellDef>Generated On</th>
              <td mat-cell *matCellDef="let d" class="date-cell">{{ d.generatedOn }}</td>
            </ng-container>

            <ng-container matColumnDef="sentOn">
              <th mat-header-cell *matHeaderCellDef>Sent On</th>
              <td mat-cell *matCellDef="let d" class="date-cell">{{ d.sentOn ?? '—' }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let d">
                <button mat-icon-button matTooltip="Preview" style="color:#6366f1;"
                  [routerLink]="['/increment/letters']">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Download PDF" style="color:#10b981;"
                  (click)="downloadPdf(d)">
                  <mat-icon>download</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Send via Email" style="color:#f59e0b;"
                  (click)="sendEmail(d)">
                  <mat-icon>email</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols;"></tr>
          </table>
        </div>

        <div class="table-footer">
          <span>Showing {{ filtered().length }} of {{ allDocs.length }} documents</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: var(--page-padding); }

    /* KPI Row */
    .doc-kpi-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 20px;

      @media (max-width: 1023px) { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      @media (max-width: 479px)  { grid-template-columns: 1fr 1fr; gap: 8px; }
    }

    .doc-kpi {
      padding: 14px 16px;
      display: flex; align-items: center; gap: 12px;
      min-width: 0;
    }

    .dkpi-icon {
      width: 40px; height: 40px; border-radius: 9px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }

    .dkpi-text { min-width: 0; }
    .dkpi-val { font-size: 1.25rem; font-weight: 800; color: var(--color-text-primary); margin: 0 0 1px; line-height: 1; }
    .dkpi-label { font-size: 0.72rem; font-weight: 500; color: var(--color-text-secondary); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* Toolbar */
    .doc-toolbar {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px 6px;
      flex-wrap: wrap; border-bottom: 1px solid var(--color-border);
    }
    .search-f { flex: 1; min-width: 200px; }

    /* Stat tabs */
    .stat-tabs {
      display: flex; gap: 0; padding: 0 16px;
      border-bottom: 1px solid var(--color-border);
      overflow-x: auto; -webkit-overflow-scrolling: touch;
    }

    .stat-tab {
      display: flex; align-items: center; gap: 6px;
      padding: 10px 14px; border: none; background: transparent; cursor: pointer;
      font-size: 0.82rem; font-weight: 500; color: var(--color-text-secondary);
      border-bottom: 2px solid transparent; white-space: nowrap; transition: all 0.15s;

      &.active { color: var(--color-primary); border-bottom-color: var(--color-primary); font-weight: 600; }
      &:hover { color: var(--color-primary); }
    }

    .stab-count {
      padding: 1px 6px; border-radius: 10px;
      font-size: 0.68rem; font-weight: 700;
      background: #f3f4f6; color: #6b7280;
    }
    .stab-sent      { background: #dcfce7 !important; color: #16a34a !important; }
    .stab-generated { background: #eff6ff !important; color: #3b82f6 !important; }
    .stab-pending   { background: #fef9c3 !important; color: #a16207 !important; }
    .stab-draft     { background: #f3f4f6 !important; color: #6b7280 !important; }

    /* Document cell */
    .doc-cell { display: flex; align-items: center; gap: 10px; }

    .doc-icon-wrap {
      width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }

      &--increment-letter  { background: #f5f3ff; mat-icon { color: #7c3aed; } }
      &--annexure          { background: #f0fdf4; mat-icon { color: #10b981; } }
      &--promotion-letter  { background: #fef9c3; mat-icon { color: #a16207; } }
      &--transfer-letter   { background: #eff6ff; mat-icon { color: #3b82f6; } }
      &--offer-letter      { background: #fff7ed; mat-icon { color: #f59e0b; } }
    }

    .doc-name { font-size: 0.825rem; font-weight: 600; color: var(--color-text-primary); margin: 0 0 1px; }
    .doc-size { font-size: 0.7rem; color: var(--color-text-muted); margin: 0; }

    /* Employee cell */
    .emp-av {
      width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 0.72rem; font-weight: 700;
    }
    .emp-nm { font-size: 0.82rem; font-weight: 600; color: var(--color-text-primary); margin: 0 0 1px; }
    .emp-id { font-size: 0.68rem; font-weight: 600; color: #6366f1; margin: 0; }

    .dept-tag { font-size: 0.75rem; font-weight: 500; background: #f3f4f6; color: #6b7280; padding: 2px 8px; border-radius: 6px; }
    .date-cell { font-size: 0.8rem; color: var(--color-text-secondary); white-space: nowrap; }

    .table-footer {
      padding: 10px 20px; border-top: 1px solid var(--color-border);
      background: #f8f9fc; font-size: 0.8rem; color: var(--color-text-muted);
    }
  `]
})
export class DocumentsComponent {
  allDocs = MOCK_DOCS;
  activeTab = signal('all');
  private dialog   = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  searchCtrl = new FormControl('');
  typeCtrl   = new FormControl('');
  statusCtrl = new FormControl('');
  deptCtrl   = new FormControl('');

  depts    = ['Sales', 'Marketing', 'IT', 'Finance', 'HR', 'Operations'];
  docTypes = ['Increment Letter', 'Annexure', 'Promotion Letter', 'Transfer Letter', 'Offer Letter'] as DocType[];
  cols     = ['doc', 'employee', 'department', 'status', 'generatedOn', 'sentOn', 'actions'];

  kpis = [
    { icon: 'description',  label: 'Total Documents', value: String(MOCK_DOCS.length), bg: '#f5f3ff', color: '#7c3aed' },
    { icon: 'send',         label: 'Sent',            value: String(MOCK_DOCS.filter(d => d.status === 'Sent').length),      bg: '#f0fdf4', color: '#10b981' },
    { icon: 'hourglass_top',label: 'Pending',         value: String(MOCK_DOCS.filter(d => d.status === 'Pending').length),   bg: '#fef9c3', color: '#a16207' },
    { icon: 'drafts',       label: 'Draft',           value: String(MOCK_DOCS.filter(d => d.status === 'Draft').length),     bg: '#f3f4f6', color: '#6b7280' },
  ];

  statTabs = [
    { label: 'All',       value: 'all',       count: MOCK_DOCS.length },
    { label: 'Sent',      value: 'sent',      count: MOCK_DOCS.filter(d => d.status === 'Sent').length },
    { label: 'Generated', value: 'generated', count: MOCK_DOCS.filter(d => d.status === 'Generated').length },
    { label: 'Pending',   value: 'pending',   count: MOCK_DOCS.filter(d => d.status === 'Pending').length },
    { label: 'Draft',     value: 'draft',     count: MOCK_DOCS.filter(d => d.status === 'Draft').length },
  ];

  filtered = computed(() => {
    let docs = this.allDocs;
    const tab    = this.activeTab();
    const q      = this.searchCtrl.value?.toLowerCase() ?? '';
    const type   = this.typeCtrl.value ?? '';
    const status = this.statusCtrl.value ?? '';
    const dept   = this.deptCtrl.value ?? '';

    if (tab !== 'all') docs = docs.filter(d => d.status.toLowerCase() === tab);
    if (q)      docs = docs.filter(d => d.employeeName.toLowerCase().includes(q) || d.employeeId.toLowerCase().includes(q));
    if (type)   docs = docs.filter(d => d.type === type);
    if (status) docs = docs.filter(d => d.status === status);
    if (dept)   docs = docs.filter(d => d.department === dept);
    return docs;
  });

  typeIcon(t: DocType) { return TYPE_ICONS[t] ?? 'description'; }

  slugType(t: DocType) { return t.toLowerCase().replace(/ /g, '-'); }

  statusType(s: DocStatus): string {
    const map: Record<DocStatus, string> = {
      'Generated': 'active',
      'Sent':      'completed',
      'Pending':   'pending',
      'Draft':     'draft',
    };
    return map[s];
  }

  openGenerate() {
    const ref = this.dialog.open(GenDocDialogComponent, {
      width: '480px', maxWidth: '95vw',
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.snackBar.open(
        `${result.type} generated successfully for ${result.employee}!`,
        'Close',
        { duration: 3500 }
      );
    });
  }

  downloadPdf(doc: HRDocument) {
    // In production this would call the backend PDF generation API
    this.snackBar.open(
      `Downloading ${doc.type} for ${doc.employeeName} (${doc.size})…`,
      'Close',
      { duration: 3000 }
    );
  }

  sendEmail(doc: HRDocument) {
    // In production this would trigger the email service
    this.snackBar.open(
      `${doc.type} sent to ${doc.employeeName} via email!`,
      'Undo',
      { duration: 3500 }
    );
  }
}
