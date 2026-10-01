import {
  Employee, IncrementCycle, IncrementRecord, ApprovalRequest,
  LetterTemplate, DepartmentIncrement, IncrementTrend,
  AIValidationResult, AuditLog, Notification, AISettings, ApprovalLevel, SalaryStructure
} from '../models';

// ─── Current User ────────────────────────────────────────────────────────────
export const MOCK_USER = {
  id: 'u1',
  name: 'Avinash',
  email: 'avinash@company.com',
  role: 'HR Admin' as const,
  department: 'Human Resources',
};

// ─── Employees ───────────────────────────────────────────────────────────────
export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'e1', employeeId: 'EMP001', name: 'Rahul Sharma', designation: 'Senior Sales Executive', department: 'Sales', joiningDate: '15 Mar 2020', currentCTC: 700000, location: 'Ahmedabad', reportingTo: 'TM - West', status: 'Active', email: 'rahul.sharma@company.com' },
  { id: 'e2', employeeId: 'EMP002', name: 'Priya Patel', designation: 'Marketing Manager', department: 'Marketing', joiningDate: '01 Jun 2019', currentCTC: 850000, location: 'Mumbai', reportingTo: 'VP Marketing', status: 'Active', email: 'priya.patel@company.com' },
  { id: 'e3', employeeId: 'EMP003', name: 'Amit Kumar', designation: 'Senior Developer', department: 'IT', joiningDate: '10 Jan 2021', currentCTC: 900000, location: 'Bangalore', reportingTo: 'Tech Lead', status: 'Active', email: 'amit.kumar@company.com' },
  { id: 'e4', employeeId: 'EMP004', name: 'Sneha Desai', designation: 'Finance Analyst', department: 'Finance', joiningDate: '20 Aug 2020', currentCTC: 650000, location: 'Pune', reportingTo: 'CFO', status: 'Active', email: 'sneha.desai@company.com' },
  { id: 'e5', employeeId: 'EMP005', name: 'Vikram Singh', designation: 'HR Executive', department: 'HR', joiningDate: '05 Feb 2022', currentCTC: 780000, location: 'Delhi', reportingTo: 'HR Manager', status: 'Active', email: 'vikram.singh@company.com' },
  { id: 'e6', employeeId: 'EMP006', name: 'Neha Gupta', designation: 'Operations Lead', department: 'Operations', joiningDate: '12 Nov 2018', currentCTC: 820000, location: 'Hyderabad', reportingTo: 'COO', status: 'Active', email: 'neha.gupta@company.com' },
  { id: 'e7', employeeId: 'EMP007', name: 'Pooja Jain', designation: 'HR Executive', department: 'HR', joiningDate: '22 Sep 2019', currentCTC: 908000, location: 'Chennai', reportingTo: 'HR Manager', status: 'Active', email: 'pooja.jain@company.com' },
  { id: 'e8', employeeId: 'EMP008', name: 'Karan Mehta', designation: 'IT Support', department: 'IT', joiningDate: '30 Apr 2021', currentCTC: 825000, location: 'Mumbai', reportingTo: 'IT Manager', status: 'Active', email: 'karan.mehta@company.com' },
];

// ─── Salary Structures ───────────────────────────────────────────────────────
export const MOCK_SALARY_STRUCTURES: Record<string, SalaryStructure> = {
  'EMP001': {
    employeeId: 'EMP001',
    components: [
      { name: 'Basic Salary', current: 300000, revised: 330000 },
      { name: 'HRA', current: 120000, revised: 132000 },
      { name: 'Conveyance', current: 48000, revised: 48000 },
      { name: 'Medical Allowance', current: 15000, revised: 15000 },
      { name: 'Special Allowance', current: 117000, revised: 145000 },
    ],
    totalCTC: 700000,
    revisedCTC: 770000,
  },
  'EMP002': {
    employeeId: 'EMP002',
    components: [
      { name: 'Basic Salary', current: 360000, revised: 403200 },
      { name: 'HRA', current: 144000, revised: 161280 },
      { name: 'Conveyance', current: 48000, revised: 48000 },
      { name: 'Medical Allowance', current: 15000, revised: 15000 },
      { name: 'Special Allowance', current: 283000, revised: 324520 },
    ],
    totalCTC: 850000,
    revisedCTC: 952000,
  },
};

// ─── Increment Cycles ─────────────────────────────────────────────────────────
export const MOCK_CYCLES: IncrementCycle[] = [
  { id: 'c1', cycleName: 'Annual Increment', year: 2026, employees: 312, status: 'Active', createdOn: '01 Jan 2026', financialYear: 'FY 2025-26', effectiveDate: '01 Apr 2026', incrementType: 'Merit Based', remarks: 'FY 2026 annual review' },
  { id: 'c2', cycleName: 'Mid Year Increment', year: 2025, employees: 248, status: 'Completed', createdOn: '01 Jul 2025', financialYear: 'FY 2024-25', effectiveDate: '01 Jul 2025', incrementType: 'Performance Based', remarks: 'H1 2025 review' },
  { id: 'c3', cycleName: 'Special Increment', year: 2025, employees: 45, status: 'Completed', createdOn: '15 Mar 2025', financialYear: 'FY 2024-25', effectiveDate: '01 Apr 2025', incrementType: 'Special', remarks: 'Retention bonus' },
  { id: 'c4', cycleName: 'Annual Increment', year: 2025, employees: 298, status: 'Completed', createdOn: '01 Jan 2025', financialYear: 'FY 2024-25', effectiveDate: '01 Apr 2025', incrementType: 'Merit Based', remarks: 'FY 2025 annual review' },
  { id: 'c5', cycleName: 'Annual Increment', year: 2024, employees: 285, status: 'Completed', createdOn: '01 Jan 2024', financialYear: 'FY 2023-24', effectiveDate: '01 Apr 2024', incrementType: 'Merit Based', remarks: 'FY 2024 annual review' },
];

// ─── Increment Records ────────────────────────────────────────────────────────
export const MOCK_INCREMENT_RECORDS: IncrementRecord[] = [
  { id: 'r1', employeeId: 'EMP001', employeeName: 'Rahul Sharma', designation: 'Senior Sales Executive', department: 'Sales', currentCTC: 700000, incrementPct: 10, revisedCTC: 770000, status: 'Valid', remarks: 'Good Performance', cycleId: 'c1' },
  { id: 'r2', employeeId: 'EMP002', employeeName: 'Priya Patel', designation: 'Marketing Manager', department: 'Marketing', currentCTC: 850000, incrementPct: 12, revisedCTC: 952000, status: 'Valid', remarks: 'Excellent', cycleId: 'c1' },
  { id: 'r3', employeeId: 'EMP003', employeeName: 'Amit Kumar', designation: 'Senior Developer', department: 'IT', currentCTC: 900000, incrementPct: 25, revisedCTC: 1125000, status: 'Issue', remarks: 'High increment %', cycleId: 'c1' },
  { id: 'r4', employeeId: 'EMP004', employeeName: 'Sneha Desai', designation: 'Finance Analyst', department: 'Finance', currentCTC: 650000, incrementPct: 8, revisedCTC: 702000, status: 'Valid', remarks: '', cycleId: 'c1' },
  { id: 'r5', employeeId: 'EMP005', employeeName: 'Vikram Singh', designation: 'HR Executive', department: 'HR', currentCTC: 780000, incrementPct: 0, revisedCTC: 780000, status: 'Issue', remarks: 'Zero increment', cycleId: 'c1' },
  { id: 'r6', employeeId: 'EMP006', employeeName: 'Neha Gupta', designation: 'Operations Lead', department: 'Operations', currentCTC: 820000, incrementPct: 15, revisedCTC: 943000, status: 'Valid', remarks: '', cycleId: 'c1' },
  { id: 'r7', employeeId: 'EMP007', employeeName: 'Pooja Jain', designation: 'HR Executive', department: 'HR', currentCTC: 908000, incrementPct: 9, revisedCTC: 989720, status: 'Needs Review', remarks: 'Verify designation', cycleId: 'c1' },
  { id: 'r8', employeeId: 'EMP008', employeeName: 'Karan Mehta', designation: 'IT Support', department: 'IT', currentCTC: 825000, incrementPct: 11, revisedCTC: 915750, status: 'Valid', remarks: '', cycleId: 'c1' },
];

// ─── AI Validation Result ─────────────────────────────────────────────────────
export const MOCK_AI_VALIDATION: AIValidationResult = {
  totalRecords: 312,
  validRecords: 278,
  issueCount: 34,
  processingTime: '12s',
  issues: [
    { type: 'high_increment', description: '3 employees have increment greater than 20%', affectedCount: 3, severity: 'warning' },
    { type: 'zero_increment', description: '2 employees have zero increment', affectedCount: 2, severity: 'error' },
    { type: 'ctc_mismatch', description: '1 employee has revised CTC less than current CTC', affectedCount: 1, severity: 'error' },
    { type: 'missing_data', description: '5 records have missing department information', affectedCount: 5, severity: 'warning' },
  ],
  records: MOCK_INCREMENT_RECORDS,
};

// ─── Approvals ────────────────────────────────────────────────────────────────
export const MOCK_APPROVALS: ApprovalRequest[] = [
  {
    id: 'a1', employeeId: 'EMP001', employeeName: 'Amit Kumar', designation: 'Sales Executive', department: 'Sales', incrementPct: 12, revisedCTC: 943000, submittedOn: '24 Sep 2026', currentApprover: 'HR Manager', status: 'Pending',
    timeline: [
      { label: 'HR Uploaded Data', status: 'completed', date: '24 Sep 2026', actor: 'Avinash' },
      { label: 'AI Validation', status: 'completed', date: '24 Sep 2026', actor: 'AI System' },
      { label: 'HR Review', status: 'completed', date: '24 Sep 2026', actor: 'Avinash' },
      { label: 'Manager Approval', status: 'current', actor: 'HR Manager' },
      { label: 'Final Approval', status: 'pending' },
      { label: 'Letter Generated', status: 'pending' },
    ]
  },
  {
    id: 'a2', employeeId: 'EMP002', employeeName: 'Neha Gupta', designation: 'Marketing Exec', department: 'Marketing', incrementPct: 10, revisedCTC: 943000, submittedOn: '24 Sep 2026', currentApprover: 'HH - North', status: 'Pending',
    timeline: [
      { label: 'HR Uploaded Data', status: 'completed', date: '24 Sep 2026', actor: 'Avinash' },
      { label: 'AI Validation', status: 'completed', date: '24 Sep 2026', actor: 'AI System' },
      { label: 'HR Review', status: 'completed', date: '24 Sep 2026', actor: 'Avinash' },
      { label: 'Manager Approval', status: 'current', actor: 'HH - North' },
      { label: 'Final Approval', status: 'pending' },
      { label: 'Letter Generated', status: 'pending' },
    ]
  },
  {
    id: 'a3', employeeId: 'EMP004', employeeName: 'Sales Executive', designation: 'Sales Exec', department: 'Sales', incrementPct: 15, revisedCTC: 898000, submittedOn: '23 Sep 2026', currentApprover: 'TM-West', status: 'Pending',
    timeline: [
      { label: 'HR Uploaded Data', status: 'completed', date: '23 Sep 2026', actor: 'Avinash' },
      { label: 'AI Validation', status: 'completed', date: '23 Sep 2026', actor: 'AI System' },
      { label: 'HR Review', status: 'current', actor: 'Avinash' },
      { label: 'Manager Approval', status: 'pending' },
      { label: 'Final Approval', status: 'pending' },
      { label: 'Letter Generated', status: 'pending' },
    ]
  },
  {
    id: 'a4', employeeId: 'EMP003', employeeName: 'Priya Jain', designation: 'HR Executive', department: 'HR', incrementPct: 12, revisedCTC: 825000, submittedOn: '22 Sep 2026', currentApprover: 'HR Head', status: 'Approved',
    timeline: [
      { label: 'HR Uploaded Data', status: 'completed', date: '22 Sep 2026', actor: 'Avinash' },
      { label: 'AI Validation', status: 'completed', date: '22 Sep 2026', actor: 'AI System' },
      { label: 'HR Review', status: 'completed', date: '22 Sep 2026', actor: 'Avinash' },
      { label: 'Manager Approval', status: 'completed', date: '23 Sep 2026', actor: 'HR Head' },
      { label: 'Final Approval', status: 'completed', date: '24 Sep 2026', actor: 'Director' },
      { label: 'Letter Generated', status: 'completed', date: '24 Sep 2026', actor: 'System' },
    ]
  },
  {
    id: 'a5', employeeId: 'EMP006', employeeName: 'Karan Mehta', designation: 'IT Support', department: 'IT', incrementPct: 5, revisedCTC: 825000, submittedOn: '22 Sep 2026', currentApprover: 'IT Manager', status: 'Rejected', rejectionReason: 'Increment percentage below policy threshold',
    timeline: [
      { label: 'HR Uploaded Data', status: 'completed', date: '22 Sep 2026', actor: 'Avinash' },
      { label: 'AI Validation', status: 'completed', date: '22 Sep 2026', actor: 'AI System' },
      { label: 'HR Review', status: 'completed', date: '22 Sep 2026', actor: 'Avinash' },
      { label: 'Manager Approval', status: 'completed', date: '23 Sep 2026', actor: 'IT Manager' },
      { label: 'Final Approval', status: 'pending' },
      { label: 'Letter Generated', status: 'pending' },
    ]
  },
];

// ─── Templates ────────────────────────────────────────────────────────────────
export const MOCK_TEMPLATES: LetterTemplate[] = [
  {
    id: 't1', name: 'Annual Increment Letter', type: 'Increment Letter', version: '3', updatedOn: '25 Sep 2026', isDefault: true,
    content: `Dear {{employeeName}},

We are pleased to inform you that based on your performance and contribution during the year, your compensation has been revised with effect from {{effectiveDate}}.

Your revised Cost to Company (CTC) is ₹{{revisedCTC}} per annum.

We appreciate your valuable contributions and look forward to your continued support.

Regards,
HR Team`
  },
  {
    id: 't2', name: 'Standard Annexure', type: 'Annexure', version: '2', updatedOn: '25 Sep 2026', isDefault: true,
    content: `SALARY REVISION ANNEXURE

Employee: {{employeeName}} | ID: {{employeeId}}
Effective Date: {{effectiveDate}}`
  },
  {
    id: 't3', name: 'Promotion Letter', type: 'Promotion Letter', version: '1', updatedOn: '20 Sep 2026', isDefault: false,
    content: `Dear {{employeeName}},

We are delighted to inform you of your promotion to the position of {{designation}} effective {{effectiveDate}}.`
  },
  {
    id: 't4', name: 'Transfer Letter', type: 'Transfer Letter', version: '1', updatedOn: '18 Sep 2026', isDefault: false,
    content: `Dear {{employeeName}},

This is to inform you that your transfer to {{department}} has been approved effective {{effectiveDate}}.`
  },
  {
    id: 't5', name: 'Salary Revision Letter', type: 'Salary Revision', version: '2', updatedOn: '15 Sep 2026', isDefault: false,
    content: `Dear {{employeeName}},

Your salary structure has been revised effective {{effectiveDate}}.`
  },
];

// ─── Department Increments ────────────────────────────────────────────────────
export const MOCK_DEPT_INCREMENTS: DepartmentIncrement[] = [
  { department: 'Sales', averageIncrement: 11.2, employeeCount: 56, totalCost: 4200000 },
  { department: 'Marketing', averageIncrement: 9.8, employeeCount: 32, totalCost: 2800000 },
  { department: 'IT', averageIncrement: 13.5, employeeCount: 48, totalCost: 5600000 },
  { department: 'Finance', averageIncrement: 8.9, employeeCount: 28, totalCost: 1900000 },
  { department: 'HR', averageIncrement: 10.4, employeeCount: 24, totalCost: 1500000 },
  { department: 'Operations', averageIncrement: 9.2, employeeCount: 38, totalCost: 2200000 },
];

// ─── Increment Trends ─────────────────────────────────────────────────────────
export const MOCK_TRENDS: IncrementTrend[] = [
  { year: 2021, averageIncrement: 7.5 },
  { year: 2022, averageIncrement: 8.2 },
  { year: 2023, averageIncrement: 9.1 },
  { year: 2024, averageIncrement: 10.4 },
  { year: 2025, averageIncrement: 9.8 },
  { year: 2026, averageIncrement: 11.2 },
];

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'al1', timestamp: '26 Sep 2026 10:41', actor: 'Avinash', action: 'Increment letter generated', details: 'Letter generated for Rahul Sharma (EMP001)', entityType: 'Document' },
  { id: 'al2', timestamp: '26 Sep 2026 10:40', actor: 'Avinash', action: 'Increment approved', details: 'Rahul Sharma increment approved by HR Manager', entityType: 'Approval' },
  { id: 'al3', timestamp: '26 Sep 2026 10:34', actor: 'AI System', action: 'AI validation completed', details: '312 records validated, 34 issues found', entityType: 'Validation' },
  { id: 'al4', timestamp: '26 Sep 2026 10:32', actor: 'Avinash', action: 'Excel file uploaded', details: 'increment_2026.xlsx uploaded (312 records)', entityType: 'Upload' },
  { id: 'al5', timestamp: '25 Sep 2026 15:20', actor: 'Avinash', action: 'Increment cycle created', details: 'Annual Increment 2026 cycle created', entityType: 'Cycle' },
];

// ─── Notifications ─────────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: '3 Approvals Pending', message: 'You have 3 increment approvals pending review.', type: 'warning', createdAt: '2 hours ago', read: false },
  { id: 'n2', title: 'AI Validation Complete', message: 'Validation complete: 278 valid, 34 issues found.', type: 'success', createdAt: '3 hours ago', read: false },
  { id: 'n3', title: 'Excel Upload Complete', message: '312 records uploaded successfully.', type: 'info', createdAt: '4 hours ago', read: true },
  { id: 'n4', title: 'Letter Generated', message: 'Increment letter for Rahul Sharma is ready.', type: 'success', createdAt: '5 hours ago', read: true },
];

// ─── AI Settings ──────────────────────────────────────────────────────────────
export const MOCK_AI_SETTINGS: AISettings = {
  provider: 'OpenAI',
  model: 'gpt-4o',
  temperature: 0.2,
  maxTokens: 2000,
  enableValidation: true,
  enableLetterGeneration: true,
  enableAnnexureGeneration: true,
};

// ─── Approval Levels ──────────────────────────────────────────────────────────
export const MOCK_APPROVAL_LEVELS: ApprovalLevel[] = [
  { id: 'al1', order: 1, role: 'HR Executive', label: 'HR Executive' },
  { id: 'al2', order: 2, role: 'HR Manager', label: 'HR Manager' },
  { id: 'al3', order: 3, role: 'Department Head', label: 'Department Head' },
  { id: 'al4', order: 4, role: 'HR Admin', label: 'Final HR Approval' },
];
