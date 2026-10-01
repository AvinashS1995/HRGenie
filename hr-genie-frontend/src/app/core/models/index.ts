// ─── Auth ────────────────────────────────────────────────────────────────────
export type UserRole = 'HR Admin' | 'HR Manager' | 'Approver' | 'Employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ─── Employee ────────────────────────────────────────────────────────────────
export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  joiningDate: string;
  currentCTC: number;
  location: string;
  reportingTo: string;
  status: 'Active' | 'Inactive';
  avatar?: string;
  email: string;
  phone?: string;
}

// ─── Salary ──────────────────────────────────────────────────────────────────
export interface SalaryComponent {
  name: string;
  current: number;
  revised: number;
}

export interface SalaryStructure {
  employeeId: string;
  components: SalaryComponent[];
  totalCTC: number;
  revisedCTC: number;
}

// ─── Increment Cycle ─────────────────────────────────────────────────────────
export type CycleStatus = 'Active' | 'Completed' | 'Draft' | 'Processing';

export interface IncrementCycle {
  id: string;
  cycleName: string;
  year: number;
  employees: number;
  status: CycleStatus;
  createdOn: string;
  financialYear: string;
  effectiveDate: string;
  department?: string;
  incrementType: string;
  remarks?: string;
}

// ─── Increment Record ─────────────────────────────────────────────────────────
export type ValidationStatus = 'Valid' | 'Issue' | 'Needs Review';

export interface IncrementRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  currentCTC: number;
  incrementPct: number;
  revisedCTC: number;
  status: ValidationStatus;
  remarks: string;
  cycleId: string;
}

// ─── Approval ────────────────────────────────────────────────────────────────
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface ApprovalRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  incrementPct: number;
  revisedCTC: number;
  submittedOn: string;
  currentApprover: string;
  status: ApprovalStatus;
  rejectionReason?: string;
  timeline: ApprovalTimelineStep[];
}

export interface ApprovalTimelineStep {
  label: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  actor?: string;
}

// ─── Template ────────────────────────────────────────────────────────────────
export type TemplateType = 'Increment Letter' | 'Annexure' | 'Promotion Letter' | 'Transfer Letter' | 'Salary Revision';

export interface LetterTemplate {
  id: string;
  name: string;
  type: TemplateType;
  version: string;
  updatedOn: string;
  content: string;
  isDefault: boolean;
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export interface DepartmentIncrement {
  department: string;
  averageIncrement: number;
  employeeCount: number;
  totalCost: number;
}

export interface IncrementTrend {
  year: number;
  averageIncrement: number;
}

// ─── AI Validation ───────────────────────────────────────────────────────────
export interface AIValidationResult {
  totalRecords: number;
  validRecords: number;
  issueCount: number;
  processingTime: string;
  issues: AIIssue[];
  records: IncrementRecord[];
}

export interface AIIssue {
  type: 'high_increment' | 'zero_increment' | 'ctc_mismatch' | 'missing_data';
  description: string;
  affectedCount: number;
  severity: 'warning' | 'error';
}

// ─── Notification ────────────────────────────────────────────────────────────
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
}

// ─── Audit Log ───────────────────────────────────────────────────────────────
export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  entityType: string;
  entityId?: string;
}

// ─── Settings ────────────────────────────────────────────────────────────────
export type AIProvider = 'OpenAI' | 'Gemini' | 'OpenRouter';

export interface AISettings {
  provider: AIProvider;
  model: string;
  temperature: number;
  maxTokens: number;
  enableValidation: boolean;
  enableLetterGeneration: boolean;
  enableAnnexureGeneration: boolean;
  apiKey?: string;
}

export interface ApprovalLevel {
  id: string;
  order: number;
  role: string;
  label: string;
}
