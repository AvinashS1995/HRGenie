import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexChart, ApexNonAxisChartSeries, ApexAxisChartSeries,
  ApexXAxis, ApexYAxis, ApexDataLabels, ApexLegend,
  ApexPlotOptions, ApexTooltip, ApexFill, ApexStroke, ApexGrid
} from 'ng-apexcharts';

import { AuthService } from '../../core/services/auth.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { AiInsightComponent } from '../../shared/components/ai-insight/ai-insight.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatIconModule, MatButtonModule, MatMenuModule,
    NgApexchartsModule,
    KpiCardComponent, ChartCardComponent, AiInsightComponent,
  ],
  template: `
    <div class="page-container fade-in-up">

      <!-- Page Header -->
      <div class="dash-header">
        <div>
          <h1 class="dash-title">Welcome back, {{ authService.user()?.name }} 👋</h1>
          <p class="dash-subtitle">AI-powered HR operations for smarter workforce management</p>
        </div>
        <button mat-button class="period-btn" [matMenuTriggerFor]="periodMenu">
          <mat-icon>calendar_today</mat-icon>
          Last 30 days
          <mat-icon>expand_more</mat-icon>
        </button>
        <mat-menu #periodMenu="matMenu">
          <button mat-menu-item>Last 7 days</button>
          <button mat-menu-item>Last 30 days</button>
          <button mat-menu-item>Last 90 days</button>
          <button mat-menu-item>This Year</button>
        </mat-menu>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        <app-kpi-card
          label="Total Employees"
          [value]="stats.totalEmployees.value"
          [change]="stats.totalEmployees.change"
          direction="up"
          icon="people_alt"
          iconBg="#f5f3ff"
          iconColor="#7c3aed"
        />
        <app-kpi-card
          label="Increment Cycles"
          [value]="stats.incrementCycles.value"
          [change]="stats.incrementCycles.change"
          direction="up"
          icon="loop"
          iconBg="#eff6ff"
          iconColor="#3b82f6"
        />
        <app-kpi-card
          label="Letters Generated"
          [value]="stats.lettersGenerated.value"
          [change]="stats.lettersGenerated.change"
          direction="up"
          icon="description"
          iconBg="#f0fdf4"
          iconColor="#10b981"
        />
        <app-kpi-card
          label="Pending Approvals"
          [value]="stats.pendingApprovals.value"
          [change]="stats.pendingApprovals.change"
          direction="down"
          icon="pending_actions"
          iconBg="#fff7ed"
          iconColor="#f59e0b"
        />
      </div>

      <!-- Charts Row -->
      <div class="charts-grid">

        <!-- Increment Process Status - Donut -->
        <app-chart-card title="Increment Process Status" subtitle="Current cycle breakdown">
          <div class="donut-layout">
            <apx-chart
              [series]="donutSeries"
              [chart]="donutChart"
              [labels]="donutLabels"
              [colors]="donutColors"
              [legend]="donutLegend"
              [dataLabels]="donutDataLabels"
              [plotOptions]="donutPlotOptions"
              [tooltip]="donutTooltip"
              [stroke]="donutStroke"
            />
            <div class="donut-legend">
              @for (item of donutLegendData; track item.label) {
                <div class="legend-item">
                  <span class="legend-dot" [style.background]="item.color"></span>
                  <span class="legend-label">{{ item.label }}</span>
                  <span class="legend-value">{{ item.value }}</span>
                </div>
              }
            </div>
          </div>
        </app-chart-card>

        <!-- Department Wise Bar -->
        <app-chart-card title="Department Wise Increment" subtitle="Average increment % by department">
          <apx-chart
            [series]="barSeries"
            [chart]="barChart"
            [xaxis]="barXAxis"
            [yaxis]="barYAxis"
            [colors]="barColors"
            [dataLabels]="barDataLabels"
            [plotOptions]="barPlotOptions"
            [grid]="barGrid"
            [tooltip]="barTooltip"
            [fill]="barFill"
          />
        </app-chart-card>

      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <h2 class="section-title" style="margin-bottom:16px;">Quick Actions</h2>
        <div class="quick-actions-grid">
          @for (action of quickActions; track action.title) {
            <a class="quick-action-card" [routerLink]="action.route">
              <div class="qa-icon" [style.background]="action.iconBg">
                <mat-icon [style.color]="action.iconColor">{{ action.icon }}</mat-icon>
              </div>
              <div class="qa-content">
                <p class="qa-title">{{ action.title }}</p>
                <p class="qa-sub">{{ action.subtitle }}</p>
              </div>
              <mat-icon class="qa-arrow">chevron_right</mat-icon>
            </a>
          }
        </div>
      </div>

      <!-- AI Insights -->
      <app-ai-insight
        [insights]="aiInsights"
        [showAskBtn]="true"
      />

    </div>
  `,
  styles: [`
    .page-container { padding: var(--page-padding); }

    .dash-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 28px;
      gap: 16px;

      @media (max-width: 767px) {
        flex-direction: column;
        margin-bottom: 20px;
        gap: 10px;
      }
    }

    .dash-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-text-primary);
      margin: 0 0 4px;
      letter-spacing: -0.02em;
    }

    .dash-subtitle {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin: 0;
    }

    .period-btn {
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
      border: 1px solid var(--color-border) !important;
      border-radius: 8px !important;
      background: white !important;
      color: var(--color-text-secondary) !important;
      font-size: 0.875rem !important;
      font-weight: 500 !important;
      padding: 0 14px !important;
      height: 38px !important;
      white-space: nowrap;

      mat-icon { font-size: 16px !important; width: 16px !important; height: 16px !important; }
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;

      @media (max-width: 1023px) { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      @media (max-width: 479px)  { grid-template-columns: 1fr; gap: 10px; }
    }

    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 16px;
      margin-bottom: 24px;

      @media (max-width: 1023px) { grid-template-columns: 1fr; }
    }

    .donut-layout {
      display: flex;
      align-items: center;
      gap: 12px;
      justify-content: center;
      width: 100%;
      flex-wrap: wrap;

      @media (max-width: 479px) { flex-direction: column; }
    }

    .donut-legend {
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 140px;
      flex: 1;
      max-width: 160px;

      @media (max-width: 479px) { min-width: unset; max-width: 100%; width: 100%; flex-direction: row; flex-wrap: wrap; gap: 6px 14px; }
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .legend-label {
      font-size: 0.78rem;
      color: var(--color-text-secondary);
      flex: 1;
    }

    .legend-value {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .quick-actions-section { margin-bottom: 24px; }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;

      @media (max-width: 1023px) { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      @media (max-width: 479px)  { grid-template-columns: 1fr; }
    }

    .quick-action-card {
      background: var(--color-surface);
      border: var(--card-border);
      border-radius: var(--card-radius);
      padding: 18px;
      display: flex;
      align-items: center;
      gap: 14px;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        border-color: #c4b5fd;
        box-shadow: 0 4px 12px rgb(124 58 237 / 0.08);
        transform: translateY(-1px);
      }
    }

    .qa-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon { font-size: 22px; width: 22px; height: 22px; }
    }

    .qa-content { flex: 1; min-width: 0; }

    .qa-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 2px;
    }

    .qa-sub {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      margin: 0;
    }

    .qa-arrow {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
      color: var(--color-text-muted) !important;
    }
  `]
})
export class DashboardComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly analyticsService = inject(AnalyticsService);

  stats = this.analyticsService.getDashboardStats();
  processStatus = this.analyticsService.getIncrementProcessStatus();
  deptData = this.analyticsService.getDepartmentIncrements();

  // ─── Donut Chart ─────────────────────────────────────────────────────────
  donutSeries: ApexNonAxisChartSeries = [];
  donutLabels: string[] = [];
  donutColors = ['#10b981', '#6366f1', '#f59e0b', '#ef4444'];
  donutLegendData: { label: string; value: number; color: string }[] = [];

  donutChart: ApexChart = {
    type: 'donut',
    height: 200,
    sparkline: { enabled: false },
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif',
  };

  donutLegend: ApexLegend = { show: false };
  donutDataLabels: ApexDataLabels = { enabled: false };

  donutPlotOptions: ApexPlotOptions = {
    pie: {
      donut: {
        size: '68%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            fontSize: '12px',
            fontWeight: 600,
            color: '#6b7280',
            formatter: () => '312',
          },
          value: {
            fontSize: '22px',
            fontWeight: 800,
            color: '#111827',
          }
        }
      }
    }
  };

  donutTooltip: ApexTooltip = {
    y: { formatter: (val) => `${val} cycles` }
  };

  donutStroke: ApexStroke = { width: 2, colors: ['#fff'] };

  // ─── Bar Chart ────────────────────────────────────────────────────────────
  barSeries: ApexAxisChartSeries = [];
  barColors = ['#7c3aed'];

  barChart: ApexChart = {
    type: 'bar',
    height: 200,
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif',
  };

  barXAxis: ApexXAxis = {
    categories: [],
    labels: { style: { fontSize: '11px', colors: '#6b7280' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  };

  barYAxis: ApexYAxis = {
    labels: {
      style: { fontSize: '11px', colors: '#6b7280' },
      formatter: (val) => `${val}%`
    },
    min: 0,
    max: 16,
  };

  barDataLabels: ApexDataLabels = { enabled: false };

  barPlotOptions: ApexPlotOptions = {
    bar: {
      borderRadius: 5,
      columnWidth: '55%',
    }
  };

  barGrid: ApexGrid = {
    borderColor: '#f3f4f6',
    strokeDashArray: 3,
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: false } },
  };

  barTooltip: ApexTooltip = {
    y: { formatter: (val) => `${val}%` }
  };

  barFill: ApexFill = {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.2,
      gradientToColors: ['#a78bfa'],
      opacityFrom: 1,
      opacityTo: 0.85,
    }
  };

  quickActions = [
    { title: 'Upload Increment Data', subtitle: 'Excel Upload', icon: 'upload_file', route: '/increment/upload', iconBg: '#f5f3ff', iconColor: '#7c3aed' },
    { title: 'Generate Letters', subtitle: 'AI assisted generation', icon: 'description', route: '/increment/letters', iconBg: '#eff6ff', iconColor: '#3b82f6' },
    { title: 'Manage Templates', subtitle: 'Letter & Annexure templates', icon: 'article', route: '/templates', iconBg: '#f0fdf4', iconColor: '#10b981' },
    { title: 'View Approvals', subtitle: 'Pending HR approvals', icon: 'check_circle', route: '/approvals', iconBg: '#fff7ed', iconColor: '#f59e0b' },
  ];

  aiInsights = [
    'Average increment increased by 1.4% compared to the previous cycle.',
    'The HR department has the highest average increment at 10.4%.',
    '12 employees have increments above 20% and should be reviewed.',
    'Total additional salary cost for this cycle is estimated at ₹4.2 Cr.',
  ];

  ngOnInit() {
    // Donut data
    const s = this.processStatus;
    this.donutSeries = [s.completed, s.inProgress, s.pendingReview, s.issuesFound];
    this.donutLabels = ['Completed', 'In Progress', 'Pending Review', 'Issues Found'];
    this.donutLegendData = [
      { label: 'Completed', value: s.completed, color: '#10b981' },
      { label: 'In Progress', value: s.inProgress, color: '#6366f1' },
      { label: 'Pending Review', value: s.pendingReview, color: '#f59e0b' },
      { label: 'Issues Found', value: s.issuesFound, color: '#ef4444' },
    ];

    // Bar data
    this.barXAxis = {
      ...this.barXAxis,
      categories: this.deptData.map(d => d.department),
    };
    this.barSeries = [{
      name: 'Avg Increment %',
      data: this.deptData.map(d => d.averageIncrement),
    }];
  }
}
