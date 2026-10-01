import { Injectable, signal } from '@angular/core';
import { IncrementCycle, IncrementRecord, AIValidationResult } from '../models';
import { MOCK_CYCLES, MOCK_INCREMENT_RECORDS, MOCK_AI_VALIDATION } from '../mock/mock-data';

@Injectable({ providedIn: 'root' })
export class IncrementService {
  private _cycles = signal<IncrementCycle[]>(MOCK_CYCLES);
  private _records = signal<IncrementRecord[]>(MOCK_INCREMENT_RECORDS);

  getCycles(): IncrementCycle[] { return this._cycles(); }

  getCycle(id: string): IncrementCycle | undefined {
    return this._cycles().find(c => c.id === id);
  }

  addCycle(cycle: Partial<IncrementCycle>): void {
    const newCycle: IncrementCycle = {
      id: 'c' + Date.now(),
      cycleName: cycle.cycleName ?? 'New Cycle',
      year: cycle.year ?? new Date().getFullYear(),
      employees: 0,
      status: 'Draft',
      createdOn: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      financialYear: cycle.financialYear ?? '',
      effectiveDate: cycle.effectiveDate ?? '',
      incrementType: cycle.incrementType ?? 'Merit Based',
      remarks: cycle.remarks,
    };
    this._cycles.update(cycles => [newCycle, ...cycles]);
  }

  deleteCycle(id: string): void {
    this._cycles.update(cycles => cycles.filter(c => c.id !== id));
  }

  getRecords(cycleId?: string): IncrementRecord[] {
    if (cycleId) return this._records().filter(r => r.cycleId === cycleId);
    return this._records();
  }

  getValidationResult(): AIValidationResult {
    return MOCK_AI_VALIDATION;
  }

  // Simulated upload progress steps
  getUploadSteps(): string[] {
    return ['Uploading', 'Reading Excel', 'Validating', 'Calculating', 'AI Analysis', 'Ready for Review'];
  }
}
