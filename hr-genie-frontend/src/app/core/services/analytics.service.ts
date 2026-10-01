import { Injectable } from '@angular/core';
import { MOCK_DEPT_INCREMENTS, MOCK_TRENDS, MOCK_CYCLES, MOCK_INCREMENT_RECORDS } from '../mock/mock-data';
import { DepartmentIncrement, IncrementTrend } from '../models';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  getDashboardStats() {
    return {
      totalEmployees: { value: 1248, change: 5, direction: 'up' as const },
      incrementCycles: { value: 312, change: 12, direction: 'up' as const },
      lettersGenerated: { value: 1180, change: 20, direction: 'up' as const },
      pendingApprovals: { value: 38, change: 15, direction: 'down' as const },
    };
  }

  getIncrementProcessStatus() {
    return {
      completed: 182,
      inProgress: 64,
      pendingReview: 38,
      issuesFound: 28,
    };
  }

  getDepartmentIncrements(): DepartmentIncrement[] {
    return MOCK_DEPT_INCREMENTS;
  }

  getIncrementTrends(): IncrementTrend[] {
    return MOCK_TRENDS;
  }

  getIncrementDistribution() {
    return [
      { label: '0–5%', count: 28, color: '#ef4444' },
      { label: '6–10%', count: 148, color: '#6366f1' },
      { label: '11–15%', count: 92, color: '#8b5cf6' },
      { label: '16–20%', count: 32, color: '#f59e0b' },
      { label: '>20%', count: 12, color: '#ec4899' },
    ];
  }

  getReportStats() {
    return {
      totalEmployees: 312,
      avgIncrement: 11.2,
      totalCost: '₹4.2 Cr',
      highestIncrement: 25,
    };
  }
}
