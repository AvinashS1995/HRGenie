import { Injectable, signal } from '@angular/core';
import { LetterTemplate, TemplateType } from '../models';
import { MOCK_TEMPLATES } from '../mock/mock-data';

export interface SampleTemplateData {
  employeeName: string;
  employeeId: string;
  designation: string;
  department: string;
  currentCTC: string;
  revisedCTC: string;
  incrementPercentage: string;
  effectiveDate: string;
  basicSalary: string;
  hra: string;
  specialAllowance: string;
  location: string;
  reportingManager: string;
}

@Injectable({ providedIn: 'root' })
export class TemplateService {
  private _templates = signal<LetterTemplate[]>(MOCK_TEMPLATES);

  getTemplates(type?: TemplateType): LetterTemplate[] {
    if (type) return this._templates().filter(t => t.type === type);
    return this._templates();
  }

  getTemplate(id: string): LetterTemplate | undefined {
    return this._templates().find(t => t.id === id);
  }

  saveTemplate(template: LetterTemplate): void {
    this._templates.update(templates => {
      const idx = templates.findIndex(t => t.id === template.id);
      if (idx >= 0) {
        const updated = [...templates];
        updated[idx] = { ...template, version: String(parseInt(template.version) + 1), updatedOn: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) };
        return updated;
      }
      return [...templates, { ...template, id: 't' + Date.now() }];
    });
  }

  duplicateTemplate(id: string): void {
    const t = this.getTemplate(id);
    if (t) {
      this._templates.update(templates => [...templates, {
        ...t, id: 't' + Date.now(), name: t.name + ' (Copy)', version: '1', isDefault: false
      }]);
    }
  }

  deleteTemplate(id: string): void {
    this._templates.update(templates => templates.filter(t => t.id !== id));
  }

  // Replace template placeholders with sample/real data
  renderTemplate(content: string, data: SampleTemplateData): string {
    const rec = data as unknown as Record<string, string>;
    return content.replace(/\{\{(\w+)\}\}/g, (_, key) => rec[key] ?? `{{${key}}}`);
  }

  getSampleData(): SampleTemplateData {
    return {
      employeeName: 'Rahul Sharma',
      employeeId: 'EMP001',
      designation: 'Senior Sales Executive',
      department: 'Sales',
      currentCTC: '₹7,00,000',
      revisedCTC: '₹7,70,000',
      incrementPercentage: '10%',
      effectiveDate: '01 Apr 2026',
      basicSalary: '₹3,30,000',
      hra: '₹1,32,000',
      specialAllowance: '₹1,45,000',
      location: 'Ahmedabad',
      reportingManager: 'TM - West',
    };
  }
}
