import { Injectable, signal } from '@angular/core';
import { ApprovalRequest, ApprovalStatus } from '../models';
import { MOCK_APPROVALS } from '../mock/mock-data';

@Injectable({ providedIn: 'root' })
export class ApprovalService {
  private _approvals = signal<ApprovalRequest[]>(MOCK_APPROVALS);

  getApprovals(status?: ApprovalStatus): ApprovalRequest[] {
    if (status) return this._approvals().filter(a => a.status === status);
    return this._approvals();
  }

  getApproval(id: string): ApprovalRequest | undefined {
    return this._approvals().find(a => a.id === id);
  }

  approve(id: string): void {
    this._approvals.update(approvals =>
      approvals.map(a => a.id === id ? {
        ...a, status: 'Approved' as ApprovalStatus,
        timeline: a.timeline.map(s => s.status === 'current' ? { ...s, status: 'completed' as const, date: new Date().toLocaleDateString('en-IN') } : s)
      } : a)
    );
  }

  reject(id: string, reason: string): void {
    this._approvals.update(approvals =>
      approvals.map(a => a.id === id ? {
        ...a, status: 'Rejected' as ApprovalStatus, rejectionReason: reason
      } : a)
    );
  }

  getPendingCount(): number {
    return this._approvals().filter(a => a.status === 'Pending').length;
  }
}
