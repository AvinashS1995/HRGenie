import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgApexchartsModule } from 'ng-apexcharts';
import type {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
  ApexTooltip,
  ApexFill,
  ApexStroke,
  ApexGrid,
  ApexMarkers,
} from 'ng-apexcharts';

import { AnalyticsService } from '../../core/services/analytics.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { AiInsightComponent } from '../../shared/components/ai-insight/ai-insight.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    NgApexchartsModule,
    PageHeaderComponent,
    ChartCardComponent,
    AiInsightComponent,
  ],
  template: `
    <div class="page-container fade-in-up">
      <app-page-header
        title="Increment Analytics"
        subtitle="Track increment trends, department-wise analysis and insights"
      >
        <button mat-button class="btn-secondary" [matMenuTriggerFor]="yearMenu">
          <mat-icon>calendar_today</mat-icon>
          2026
          <mat-icon>expand_more</mat-icon>
        </button>
        <mat-menu #yearMenu="matMenu">
          <button mat-menu-item>2026</button>
          <button mat-menu-item>2025</button>
          <button mat-menu-item>2024</button>
        </mat-menu>
        <button mat-flat-button class="btn-primary">
          <mat-icon>download</mat-icon>
          Export Report
        </button>
      </app-page-header>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="report-kpi-card">
          <div class="rkpi-icon" style="background:#eff6ff;">
            <mat-icon style="color:#3b82f6;">people_alt</mat-icon>
          </div>
          <div class="rkpi-text">
            <p class="rkpi-val">{{ stats.totalEmployees }}</p>
            <p class="rkpi-label">Total Employees</p>
          </div>
        </div>
        <div class="report-kpi-card">
          <div class="rkpi-icon" style="background:#f5f3ff;">
            <mat-icon style="color:#8b5cf6;">trending_up</mat-icon>
          </div>
          <div class="rkpi-text">
            <p class="rkpi-val">{{ stats.avgIncrement }}%</p>
            <p class="rkpi-label">Avg. Increment</p>
          </div>
        </div>
        <div class="report-kpi-card">
          <div class="rkpi-icon" style="background:#f0fdf4;">
            <mat-icon style="color:#10b981;">currency_rupee</mat-icon>
          </div>
          <div class="rkpi-text">
            <p class="rkpi-val">{{ stats.totalCost }}</p>
            <p class="rkpi-label">Total Increment Cost</p>
          </div>
        </div>
        <div class="report-kpi-card">
          <div class="rkpi-icon" style="background:#fff7ed;">
            <mat-icon style="color:#f59e0b;">emoji_events</mat-icon>
          </div>
          <div class="rkpi-text">
            <p class="rkpi-val">{{ stats.highestIncrement }}%</p>
            <p class="rkpi-label">Highest Increment</p>
          </div>
        </div>
      </div>

      <!-- Charts Row 1: Donut + Bar -->
      <div class="charts-grid-2">
        <app-chart-card title="Increment Distribution" subtitle="Distribution of increment ranges">
          <div class="donut-layout">
            <apx-chart
              [series]="donutSeries"
              [chart]="donutChart"
              [labels]="donutLabels"
              [colors]="donutColors"
              [legend]="donutLegend"
              [dataLabels]="donutDataLabels"
              [plotOptions]="donutPlotOptions"
              [stroke]="donutStroke"
              [tooltip]="donutTooltip"
            />
            <div class="donut-legend-list">
              @for (item of donutLegendItems; track item.label) {
                <div class="dl-item">
                  <span class="dl-dot" [style.background]="item.color"></span>
                  <span class="dl-label">{{ item.label }}</span>
                  <span class="dl-val">{{ item.count }}</span>
                  <span class="dl-pct">({{ item.pct }}%)</span>
                </div>
              }
            </div>
          </div>
        </app-chart-card>

        <app-chart-card
          title="Department Wise Average Increment"
          subtitle="Average increment % per department"
        >
          <apx-chart
            [series]="deptBarSeries"
            [chart]="deptBarChart"
            [xaxis]="deptBarXAxis"
            [yaxis]="deptBarYAxis"
            [colors]="deptBarColors"
            [dataLabels]="deptBarDataLabels"
            [plotOptions]="deptBarPlotOptions"
            [grid]="barGrid"
            [tooltip]="barTooltip"
            [fill]="deptBarFill"
          />
        </app-chart-card>
      </div>

      <!-- Chart Row 2: Line Trend (full width) -->
      <app-chart-card
        title="Increment Trend (Last 5 Years)"
        subtitle="Average increment percentage over time"
      >
        <apx-chart
          [series]="lineSeries"
          [chart]="lineChart"
          [xaxis]="lineXAxis"
          [yaxis]="lineYAxis"
          [colors]="lineColors"
          [dataLabels]="lineDataLabels"
          [stroke]="lineStroke"
          [markers]="lineMarkers"
          [fill]="lineFill"
          [grid]="barGrid"
          [tooltip]="lineTooltip"
        />
      </app-chart-card>

      <!-- AI Insights -->
      <div style="margin-top:20px;">
        <app-ai-insight [insights]="aiInsights" [showAskBtn]="true" />
      </div>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: var(--page-padding);
      }

      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 14px;
        margin-bottom: 20px;

        @media (max-width: 1023px) {
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (max-width: 479px) {
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
      }

      .report-kpi-card {
        background: white;
        border: var(--card-border);
        border-radius: var(--card-radius);
        padding: 18px 20px;
        display: flex;
        align-items: center;
        gap: 14px;
        min-width: 0; /* allow equal-width shrink in grid */
        overflow: hidden;

        @media (max-width: 1023px) {
          padding: 14px 16px;
          gap: 12px;
        }
        @media (max-width: 479px) {
          padding: 12px 12px;
          gap: 10px;
        }
      }

      .rkpi-icon {
        width: 46px;
        height: 46px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }

        @media (max-width: 479px) {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }
        }
      }

      .rkpi-val {
        font-size: 1.625rem;
        font-weight: 800;
        color: var(--color-text-primary);
        margin: 0 0 2px;
        letter-spacing: -0.02em;
        line-height: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        @media (max-width: 1023px) {
          font-size: 1.375rem;
        }
        @media (max-width: 479px) {
          font-size: 1.1rem;
        }
      }

      .rkpi-label {
        font-size: 0.78rem;
        font-weight: 500;
        color: var(--color-text-secondary);
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        @media (max-width: 479px) {
          font-size: 0.7rem;
        }
      }

      /* Text container inside each KPI card — must shrink freely */
      .rkpi-text {
        flex: 1;
        min-width: 0;
        overflow: hidden;
      }

      .charts-grid-2 {
        display: grid;
        grid-template-columns: 1fr 1.3fr;
        gap: 16px;
        margin-bottom: 16px;
        align-items: start; /* prevent height mismatch stretching */

        @media (max-width: 1023px) {
          grid-template-columns: 1fr; /* stack — each card is now full page width */
        }
      }

      .donut-layout {
        display: flex;
        align-items: center;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
        width: 100%; /* fill the card body */
      }

      .donut-legend-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 150px;
        flex: 1;
        max-width: 180px;

        @media (max-width: 479px) {
          flex-direction: row;
          flex-wrap: wrap;
          min-width: unset;
          max-width: 100%;
          width: 100%;
          gap: 6px 16px;
        }
      }

      .dl-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.78rem;
      }

      .dl-dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .dl-label {
        flex: 1;
        color: var(--color-text-secondary);
      }
      .dl-val {
        font-weight: 700;
        color: var(--color-text-primary);
      }
      .dl-pct {
        color: var(--color-text-muted);
        font-size: 0.72rem;
      }
    `,
  ],
})
export class ReportsComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);

  stats = this.analyticsService.getReportStats();
  distData = this.analyticsService.getIncrementDistribution();
  deptData = this.analyticsService.getDepartmentIncrements();
  trendData = this.analyticsService.getIncrementTrends();

  aiInsights = [
    'Average increment increased by 1.4% compared to the previous cycle (FY 2024-25).',
    'IT department has the highest average increment at 13.5% this year.',
    '12 employees received increments above 20% — review recommended.',
    'Total additional payroll cost for FY 2026 is estimated at ₹4.2 Cr.',
    'Sales department shows consistent growth with 11.2% average increment.',
  ];

  // ─── Donut ───────────────────────────────────────────────────────────────
  donutSeries: ApexNonAxisChartSeries = [];
  donutLabels: string[] = [];
  donutColors = ['#ef4444', '#6366f1', '#8b5cf6', '#f59e0b', '#ec4899'];
  donutLegendItems: { label: string; count: number; color: string; pct: number }[] = [];

  donutChart: ApexChart = {
    type: 'donut',
    height: 220,
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif',
  };
  donutLegend: ApexLegend = { show: false };
  donutDataLabels: ApexDataLabels = { enabled: false };
  donutPlotOptions: ApexPlotOptions = {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            fontSize: '11px',
            fontWeight: 600,
            color: '#6b7280',
            formatter: () => '312',
          },
          value: { fontSize: '20px', fontWeight: 800, color: '#111827' },
        },
      },
    },
  };
  donutStroke: ApexStroke = { width: 2, colors: ['#fff'] };
  donutTooltip: ApexTooltip = { y: { formatter: (v) => `${v} employees` } };

  // ─── Dept Bar ─────────────────────────────────────────────────────────────
  deptBarSeries: ApexAxisChartSeries = [];
  deptBarColors = ['#7c3aed'];
  deptBarChart: ApexChart = {
    type: 'bar',
    height: 320,
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif',
  };
  deptBarXAxis: ApexXAxis = {
    categories: [],
    labels: { style: { fontSize: '11px', colors: '#6b7280' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  };
  deptBarYAxis: ApexYAxis = {
    labels: { formatter: (v) => `${v}%`, style: { fontSize: '11px', colors: '#6b7280' } },
    min: 0,
    max: 16,
  };
  deptBarDataLabels: ApexDataLabels = {
    enabled: true,
    formatter: (val: number) => `${val}%`,
    style: { fontSize: '10px', fontWeight: 700 },
    offsetY: -4,
  };
  deptBarPlotOptions: ApexPlotOptions = {
    bar: { borderRadius: 5, columnWidth: '55%', dataLabels: { position: 'top' } },
  };
  barGrid: ApexGrid = {
    borderColor: '#f3f4f6',
    strokeDashArray: 3,
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: false } },
  };
  barTooltip: ApexTooltip = { y: { formatter: (v) => `${v}%` } };
  deptBarFill: ApexFill = {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.15,
      gradientToColors: ['#a78bfa'],
      opacityFrom: 1,
      opacityTo: 0.85,
    },
  };

  // ─── Line Trend ───────────────────────────────────────────────────────────
  lineSeries: ApexAxisChartSeries = [];
  lineColors = ['#7c3aed'];
  lineChart: ApexChart = {
    type: 'area',
    height: 240,
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif',
  };
  lineXAxis: ApexXAxis = {
    categories: [],
    labels: { style: { fontSize: '11px', colors: '#6b7280' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  };
  lineYAxis: ApexYAxis = {
    labels: { formatter: (v) => `${v}%`, style: { fontSize: '11px', colors: '#6b7280' } },
    min: 5,
    max: 14,
  };
  lineDataLabels: ApexDataLabels = {
    enabled: true,
    formatter: (v: number) => `${v}%`,
    style: { fontSize: '11px', fontWeight: 700, colors: ['#7c3aed'] },
    offsetY: -6,
    background: { enabled: false },
  };
  lineStroke: ApexStroke = { curve: 'smooth', width: 3 };
  lineMarkers: ApexMarkers = {
    size: 6,
    colors: ['#fff'],
    strokeColors: '#7c3aed',
    strokeWidth: 3,
    hover: { size: 8 },
  };
  lineFill: ApexFill = {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.0, stops: [0, 100] },
  };
  lineTooltip: ApexTooltip = { y: { formatter: (v) => `${v}% avg increment` } };

  ngOnInit() {
    const total = this.distData.reduce((s, d) => s + d.count, 0);
    this.donutSeries = this.distData.map((d) => d.count);
    this.donutLabels = this.distData.map((d) => d.label);
    this.donutLegendItems = this.distData.map((d) => ({
      label: d.label,
      count: d.count,
      color: d.color,
      pct: Math.round((d.count / total) * 100),
    }));

    this.deptBarXAxis = {
      ...this.deptBarXAxis,
      categories: this.deptData.map((d) => d.department),
    };
    this.deptBarSeries = [
      { name: 'Avg Increment %', data: this.deptData.map((d) => d.averageIncrement) },
    ];

    this.lineXAxis = { ...this.lineXAxis, categories: this.trendData.map((d) => String(d.year)) };
    this.lineSeries = [
      { name: 'Avg Increment %', data: this.trendData.map((d) => d.averageIncrement) },
    ];
  }
}
