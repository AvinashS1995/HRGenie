import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, DEMO_USERS } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  template: `
    <div class="auth-shell">
      <!-- Left brand panel -->
      <div class="auth-brand">
        <div class="brand-content">
          <div class="brand-logo">
            <mat-icon>auto_awesome</mat-icon>
          </div>
          <h1 class="brand-name">HRGenie</h1>
          <p class="brand-tagline">AI HR Operations Agent</p>

          <div class="brand-features">
            @for (f of features; track f.icon) {
              <div class="brand-feature">
                <div class="bf-icon">
                  <mat-icon>{{ f.icon }}</mat-icon>
                </div>
                <div>
                  <p class="bf-title">{{ f.title }}</p>
                  <p class="bf-desc">{{ f.desc }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Right form panel -->
      <div class="auth-form-panel">
        <div class="auth-form-wrap">
          @if (!showForgot()) {
            <!-- ── Login Form ── -->
            <div class="form-header">
              <h2 class="form-title">Welcome back 👋</h2>
              <p class="form-sub">Sign in to your HRGenie account</p>
            </div>

            <!-- Demo accounts quick-fill -->
            <div class="demo-accounts">
              <p class="demo-label">Demo Accounts — click to auto-fill:</p>
              <div class="demo-btns">
                @for (d of demoAccounts; track d.email) {
                  <button
                    class="demo-btn"
                    [class.demo-btn--active]="d.role === 'HR Admin'"
                    (click)="fillDemo(d)"
                  >
                    <mat-icon>{{ d.icon }}</mat-icon>
                    <span>{{ d.label }}</span>
                  </button>
                }
              </div>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="auth-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email Address</mat-label>
                <input
                  matInput
                  formControlName="email"
                  type="email"
                  placeholder="you@company.com"
                  autocomplete="email"
                />
                <mat-icon matPrefix>email</mat-icon>
                <mat-error>Enter a valid email</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <input
                  matInput
                  formControlName="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  placeholder="Your password"
                  autocomplete="current-password"
                />
                <mat-icon matPrefix>lock_outline</mat-icon>
                <button type="button" mat-icon-button matSuffix (click)="toggleShowPassword()">
                  <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                <mat-error>Password is required</mat-error>
              </mat-form-field>

              <div class="form-row-between">
                <mat-checkbox formControlName="rememberMe" color="primary">
                  <span class="remember-label">Remember me</span>
                </mat-checkbox>
                <button type="button" class="forgot-link" (click)="showForgot.set(true)">
                  Forgot password?
                </button>
              </div>

              @if (errorMsg()) {
                <div class="error-banner">
                  <mat-icon>error_outline</mat-icon>
                  <span>{{ errorMsg() }}</span>
                </div>
              }

              <button
                type="submit"
                mat-flat-button
                class="submit-btn"
                [disabled]="loginForm.invalid || loading()"
              >
                <span class="btn-inner">
                  <mat-icon [class.spin]="loading()">{{ loading() ? 'sync' : 'login' }}</mat-icon>
                  {{ loading() ? 'Signing in...' : 'Sign In' }}
                </span>
              </button>
            </form>

            <!-- Credentials hint -->
            <div class="creds-hint">
              <p class="hint-title">Quick reference:</p>
              @for (d of demoAccounts; track d.email) {
                <div class="hint-row">
                  <span class="hint-role" [class.hint-admin]="d.role === 'HR Admin'">{{
                    d.label
                  }}</span>
                  <span class="hint-creds">{{ d.email }} / {{ d.password }}</span>
                </div>
              }
            </div>
          } @else {
            <!-- ── Forgot Password Form ── -->
            <div class="form-header">
              <button class="back-btn" (click)="showForgot.set(false)">
                <mat-icon>arrow_back</mat-icon>
                Back to login
              </button>
              <h2 class="form-title" style="margin-top:16px;">Reset Password</h2>
              <p class="form-sub">Enter your email and we'll send a reset link</p>
            </div>

            @if (!resetSent()) {
              <form [formGroup]="forgotForm" (ngSubmit)="onForgot()" class="auth-form">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email Address</mat-label>
                  <input
                    matInput
                    formControlName="email"
                    type="email"
                    placeholder="you@company.com"
                  />
                  <mat-icon matPrefix>email</mat-icon>
                  <mat-error>Enter a valid email</mat-error>
                </mat-form-field>

                @if (forgotError()) {
                  <div class="error-banner">
                    <mat-icon>error_outline</mat-icon>
                    <span>{{ forgotError() }}</span>
                  </div>
                }

                <button
                  type="submit"
                  mat-flat-button
                  class="submit-btn"
                  [disabled]="forgotForm.invalid"
                >
                  <span class="btn-inner">
                    <mat-icon>send</mat-icon>
                    Send Reset Link
                  </span>
                </button>
              </form>
            } @else {
              <div class="reset-success">
                <div class="reset-icon"><mat-icon>mark_email_read</mat-icon></div>
                <h3>Check your inbox</h3>
                <p>
                  A password reset link has been sent to
                  <strong>{{ forgotForm.value.email }}</strong
                  >.
                </p>
                <p class="reset-note">
                  Didn't receive it? Check your spam folder or contact your HR Admin.
                </p>
                <button
                  mat-flat-button
                  class="submit-btn"
                  (click)="showForgot.set(false); resetSent.set(false)"
                >
                  Back to Sign In
                </button>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-shell {
        min-height: 100vh;
        display: flex;

        @media (max-width: 767px) {
          flex-direction: column;
        }
      }

      /* ── Brand Panel ── */
      .auth-brand {
        width: 420px;
        flex-shrink: 0;
        background: #1a1f3c;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 48px 40px;

        @media (max-width: 1023px) {
          width: 340px;
          padding: 40px 28px;
        }
        @media (max-width: 767px) {
          width: 100%;
          padding: 32px 24px;
        }
      }

      .brand-content {
        width: 100%;
        max-width: 320px;
      }

      .brand-logo {
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, #7c3aed, #a78bfa);
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        mat-icon {
          color: white;
          font-size: 28px;
          width: 28px;
          height: 28px;
        }
      }

      .brand-name {
        font-size: 2rem;
        font-weight: 800;
        color: #fff;
        letter-spacing: -0.02em;
        margin: 0 0 4px;
      }

      .brand-tagline {
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.5);
        margin: 0 0 40px;

        @media (max-width: 767px) {
          margin-bottom: 20px;
        }
      }

      .brand-features {
        display: flex;
        flex-direction: column;
        gap: 20px;
        @media (max-width: 767px) {
          display: none;
        }
      }

      .brand-feature {
        display: flex;
        align-items: flex-start;
        gap: 14px;
      }

      .bf-icon {
        width: 36px;
        height: 36px;
        border-radius: 9px;
        background: rgba(124, 58, 237, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        mat-icon {
          color: #a78bfa;
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }

      .bf-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: #fff;
        margin: 0 0 2px;
      }
      .bf-desc {
        font-size: 0.78rem;
        color: rgba(255, 255, 255, 0.45);
        margin: 0;
        line-height: 1.4;
      }

      /* ── Form Panel ── */
      .auth-form-panel {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f9fc;
        padding: 40px 24px;
      }

      .auth-form-wrap {
        width: 100%;
        max-width: 440px;
        background: white;
        border-radius: 16px;
        border: 1px solid #e5e7eb;
        padding: 36px 32px;
        box-shadow: 0 4px 24px rgb(0 0 0 / 0.06);

        @media (max-width: 479px) {
          padding: 24px 20px;
          border-radius: 12px;
        }
      }

      .form-header {
        margin-bottom: 24px;
      }

      .form-title {
        font-size: 1.5rem;
        font-weight: 800;
        color: #111827;
        margin: 0 0 6px;
        letter-spacing: -0.02em;
      }
      .form-sub {
        font-size: 0.875rem;
        color: #6b7280;
        margin: 0;
      }

      /* Demo accounts */
      .demo-accounts {
        margin-bottom: 20px;
      }

      .demo-label {
        font-size: 0.72rem;
        font-weight: 600;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin: 0 0 8px;
      }

      .demo-btns {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .demo-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        background: white;
        font-size: 0.78rem;
        font-weight: 500;
        color: #374151;
        cursor: pointer;
        transition: all 0.15s;

        mat-icon {
          font-size: 15px;
          width: 15px;
          height: 15px;
        }

        &:hover {
          border-color: #7c3aed;
          color: #7c3aed;
          background: #faf5ff;
        }
        &--active {
          border-color: #7c3aed;
          background: #f5f3ff;
          color: #6d28d9;
        }
      }

      /* Form fields */
      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .full-width {
        width: 100%;
      }

      .form-row-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 4px 0 8px;
      }

      .remember-label {
        font-size: 0.82rem;
        color: #374151;
      }

      .forgot-link {
        background: none;
        border: none;
        font-size: 0.82rem;
        font-weight: 600;
        color: #7c3aed;
        cursor: pointer;
        padding: 0;
        &:hover {
          text-decoration: underline;
        }
      }

      /* Error banner */
      .error-banner {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 8px;
        padding: 10px 14px;
        font-size: 0.82rem;
        color: #dc2626;
        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }
      }

      /* Submit button */
      .submit-btn {
        width: 100%;
        background: #7c3aed !important;
        color: white !important;
        border-radius: 10px !important;
        height: 46px !important;
        font-size: 0.9rem !important;
        font-weight: 600 !important;
        letter-spacing: 0.01em !important;
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }

        &:hover:not(:disabled) {
          background: #6d28d9 !important;
        }
        &:disabled {
          background: #c4b5fd !important;
        }
      }

      /* Inline icon+text inside Material button */
      .btn-inner {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        line-height: 1;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          line-height: 18px;
          vertical-align: middle;
        }
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      .spin {
        animation: spin 0.8s linear infinite;
      }

      /* Credentials hint */
      .creds-hint {
        margin-top: 20px;
        padding: 14px 16px;
        background: #f8f9fc;
        border-radius: 10px;
        border: 1px solid #e5e7eb;
      }

      .hint-title {
        font-size: 0.72rem;
        font-weight: 700;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin: 0 0 8px;
      }

      .hint-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 3px 0;
      }

      .hint-role {
        font-size: 0.75rem;
        font-weight: 600;
        color: #6b7280;
        background: #f3f4f6;
        padding: 1px 8px;
        border-radius: 6px;
        white-space: nowrap;
      }
      .hint-admin {
        background: #f5f3ff;
        color: #6d28d9;
      }

      .hint-creds {
        font-size: 0.72rem;
        color: #9ca3af;
        font-family: monospace;
      }

      /* Back button */
      .back-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.82rem;
        font-weight: 600;
        color: #6b7280;
        padding: 0;
        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
        &:hover {
          color: #7c3aed;
        }
      }

      /* Reset success */
      .reset-success {
        text-align: center;
        padding: 20px 0;
      }

      .reset-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #f0fdf4;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: #10b981;
        }
      }

      .reset-success h3 {
        font-size: 1.1rem;
        font-weight: 700;
        color: #111827;
        margin: 0 0 8px;
      }
      .reset-success p {
        font-size: 0.875rem;
        color: #6b7280;
        margin: 0 0 6px;
      }
      .reset-note {
        font-size: 0.78rem !important;
        color: #9ca3af !important;
      }
    `,
  ],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  showForgot = signal(false);
  showPassword = signal(false);
  loading = signal(false);
  errorMsg = signal('');
  forgotError = signal('');
  resetSent = signal(false);

  loginForm = this.fb.group({
    email: ['admin@hrgenie.com', [Validators.required, Validators.email]],
    password: ['Admin@123', Validators.required],
    rememberMe: [false],
  });

  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  features = [
    {
      icon: 'trending_up',
      title: 'Increment Management',
      desc: 'Automate salary increments end-to-end',
    },
    {
      icon: 'auto_awesome',
      title: 'AI Validation',
      desc: 'Detect anomalies with AI-powered analysis',
    },
    {
      icon: 'description',
      title: 'Letter Generation',
      desc: 'Generate letters with dynamic templates',
    },
    {
      icon: 'check_circle',
      title: 'Approval Workflow',
      desc: 'Multi-level configurable approvals',
    },
  ];

  demoAccounts = [
    {
      label: 'HR Admin',
      email: 'admin@hrgenie.com',
      password: 'Admin@123',
      role: 'HR Admin',
      icon: 'admin_panel_settings',
    },
    {
      label: 'HR Manager',
      email: 'hr@hrgenie.com',
      password: 'HR@123',
      role: 'HR Manager',
      icon: 'manage_accounts',
    },
    {
      label: 'Approver',
      email: 'approver@hrgenie.com',
      password: 'Approver@123',
      role: 'Approver',
      icon: 'approval',
    },
    {
      label: 'Employee',
      email: 'emp@hrgenie.com',
      password: 'Emp@123',
      role: 'Employee',
      icon: 'person',
    },
  ];

  fillDemo(d: { email: string; password: string }) {
    this.loginForm.patchValue({ email: d.email, password: d.password });
    this.errorMsg.set('');
  }

  toggleShowPassword() {
    this.showPassword.set(!this.showPassword());
  }

  onLogin() {
    if (this.loginForm.invalid) return;
    this.loading.set(true);
    this.errorMsg.set('');

    // Simulate network delay
    setTimeout(() => {
      const { email, password } = this.loginForm.value;
      const result = this.authService.login(email!, password!);
      this.loading.set(false);

      if (result.success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMsg.set(result.message);
      }
    }, 600);
  }

  onForgot() {
    if (this.forgotForm.invalid) return;
    const found = this.authService.requestPasswordReset(this.forgotForm.value.email!);
    if (found) {
      this.resetSent.set(true);
      this.forgotError.set('');
    } else {
      this.forgotError.set('No account found with this email address.');
    }
  }
}
