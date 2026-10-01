import { Injectable, signal } from '@angular/core';
import { Employee, SalaryStructure } from '../models';
import { MOCK_EMPLOYEES, MOCK_SALARY_STRUCTURES } from '../mock/mock-data';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private _employees = signal<Employee[]>(MOCK_EMPLOYEES);

  getEmployees() {
    return this._employees();
  }

  getEmployee(id: string): Employee | undefined {
    return this._employees().find(e => e.employeeId === id || e.id === id);
  }

  getSalaryStructure(employeeId: string): SalaryStructure | null {
    return MOCK_SALARY_STRUCTURES[employeeId] ?? null;
  }

  searchEmployees(query: string): Employee[] {
    const q = query.toLowerCase();
    return this._employees().filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.employeeId.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q)
    );
  }
}
