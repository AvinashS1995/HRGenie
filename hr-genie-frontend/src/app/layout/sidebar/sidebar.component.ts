import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule],
  template: `
    <aside
      class="sidebar"
      [class.sidebar--collapsed]="isIconOnly()"
      [class.sidebar--open]="isOpen && isMobile"
      [class.sidebar--mobile]="isMobile"
    >
      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="logo-icon">
          <mat-icon>auto_awesome</mat-icon>
        </div>
        @if (!isIconOnly()) {
          <div class="logo-text">
            <span class="logo-name">HRGenie</span>
            <span class="logo-tagline">AI HR Operations Agent</span>
          </div>
        }
        <!-- Mobile close btn -->
        @if (isMobile) {
          <button class="sidebar-close-btn" (click)="closeRequest.emit()">
            <mat-icon>close</mat-icon>
          </button>
        }
      </div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        @for (item of navItems; track item.label) {
          @if (!item.children) {
            <a
              class="nav-item"
              [routerLink]="item.route"
              routerLinkActive="nav-item--active"
              [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
              [matTooltip]="isIconOnly() ? item.label : ''"
              matTooltipPosition="right"
              (click)="onNavClick()"
            >
              <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
              @if (!isIconOnly()) {
                <span class="nav-label">{{ item.label }}</span>
              }
            </a>
          } @else {
            <div class="nav-group">
              <button
                class="nav-item nav-item--group"
                [class.nav-item--expanded]="isExpanded(item.label)"
                (click)="toggleGroup(item.label)"
                [matTooltip]="isIconOnly() ? item.label : ''"
                matTooltipPosition="right"
              >
                <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
                @if (!isIconOnly()) {
                  <span class="nav-label">{{ item.label }}</span>
                  <mat-icon class="nav-chevron">
                    {{ isExpanded(item.label) ? 'expand_less' : 'expand_more' }}
                  </mat-icon>
                }
              </button>
              @if (!isIconOnly()) {
                <div
                  class="nav-children"
                  [class.nav-children--open]="isExpanded(item.label)"
                >
                  @for (child of item.children; track child.label) {
                    <a
                      class="nav-child"
                      [routerLink]="child.route"
                      routerLinkActive="nav-child--active"
                      (click)="onNavClick()"
                    >
                      <span class="nav-child-dot"></span>
                      <span>{{ child.label }}</span>
                    </a>
                  }
                </div>
              }
            </div>
          }
        }
      </nav>

      <!-- Footer -->
      @if (!isIconOnly()) {
        <div class="sidebar-footer">
          <div class="sidebar-footer-badge">
            <mat-icon>shield</mat-icon>
            <span>Enterprise Edition</span>
          </div>
        </div>
      }
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      min-height: 100vh;
      background: var(--color-sidebar-bg);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 100;
      overflow-y: auto;
      overflow-x: hidden;
      transition: width 0.25s ease, transform 0.25s ease;

      /* Tablet: icon-only mode */
      @media (max-width: 1023px) {
        width: 64px;
        overflow: visible;
      }

      /* Mobile: hidden off-screen */
      @media (max-width: 767px) {
        width: 240px;
        transform: translateX(-100%);

        &--open { transform: translateX(0); }
      }
    }

    .sidebar--collapsed {
      .sidebar-logo {
        padding: 16px 14px;
        justify-content: center;
      }
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 20px 16px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      min-height: 64px;
      flex-shrink: 0;
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      mat-icon { color: white; font-size: 20px; width: 20px; height: 20px; }
    }

    .logo-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }

    .logo-name {
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.01em;
      line-height: 1.2;
    }

    .logo-tagline {
      font-size: 0.65rem;
      color: rgba(255,255,255,0.45);
      letter-spacing: 0.02em;
      line-height: 1.3;
    }

    .sidebar-close-btn {
      margin-left: auto;
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.5);
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 4px;
      border-radius: 6px;
      flex-shrink: 0;

      mat-icon { font-size: 20px; width: 20px; height: 20px; }
      &:hover { color: white; background: rgba(255,255,255,0.1); }
    }

    .sidebar-nav {
      flex: 1;
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: 8px;
      color: rgba(255,255,255,0.55);
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.15s ease;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
      white-space: nowrap;

      &:hover {
        background: rgba(255,255,255,0.06);
        color: rgba(255,255,255,0.85);
      }

      &--active {
        background: rgba(124, 58, 237, 0.25) !important;
        color: #c4b5fd !important;
        .nav-icon { color: #a78bfa; }
      }

      &--group { justify-content: flex-start; }
      &--expanded { color: rgba(255,255,255,0.75); }
    }

    /* Icon-only centering */
    .sidebar--collapsed .nav-item {
      padding: 10px;
      justify-content: center;
      gap: 0;
    }

    .nav-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      line-height: 20px;
      color: inherit;
      flex-shrink: 0;
    }

    .nav-label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nav-chevron {
      font-size: 16px;
      width: 16px;
      height: 16px;
      line-height: 16px;
      color: rgba(255,255,255,0.35);
      flex-shrink: 0;
    }

    .nav-children {
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.2s ease;
      &--open { max-height: 400px; }
    }

    .nav-child {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 7px 12px 7px 36px;
      color: rgba(255,255,255,0.45);
      font-size: 0.825rem;
      font-weight: 400;
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.15s ease;
      margin: 1px 0;
      white-space: nowrap;

      &:hover {
        color: rgba(255,255,255,0.75);
        background: rgba(255,255,255,0.04);
      }

      &--active {
        color: #c4b5fd !important;
        background: rgba(124, 58, 237, 0.15) !important;
        .nav-child-dot { background: #a78bfa; }
      }
    }

    .nav-child-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: rgba(255,255,255,0.25);
      flex-shrink: 0;
    }

    .sidebar-footer {
      padding: 12px 16px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }

    .sidebar-footer-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 6px;
      background: rgba(124, 58, 237, 0.15);
      border: 1px solid rgba(124, 58, 237, 0.25);

      mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
        color: #a78bfa;
      }

      span {
        font-size: 0.7rem;
        font-weight: 600;
        color: #a78bfa;
        letter-spacing: 0.03em;
      }
    }
  `]
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Input() isMobile = false;
  @Input() isTablet = false;
  @Output() closeRequest = new EventEmitter<void>();

  private _expanded = signal<Set<string>>(new Set(['Increment Management']));

  // Icon-only mode: tablet (collapsed) but sidebar NOT open on mobile
  isIconOnly = () => this.isTablet && !this.isMobile;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    {
      label: 'Increment Management', icon: 'trending_up',
      children: [
        { label: 'Increment Cycles', icon: 'loop', route: '/increment/cycles' },
        { label: 'Excel Upload', icon: 'upload_file', route: '/increment/upload' },
        { label: 'Employee List', icon: 'people', route: '/increment/employees' },
        { label: 'Letter Generation', icon: 'description', route: '/increment/letters' },
        { label: 'Annexure Generation', icon: 'attach_file', route: '/increment/annexure' },
        { label: 'Approval Workflow', icon: 'approval', route: '/approvals' },
      ]
    },
    { label: 'Salary Structure', icon: 'account_balance_wallet', route: '/salary-structure' },
    { label: 'Employees', icon: 'people_alt', route: '/employees' },
    { label: 'Documents', icon: 'folder_open', route: '/documents' },
    { label: 'Approvals', icon: 'check_circle', route: '/approvals' },
    { label: 'Templates', icon: 'article', route: '/templates' },
    { label: 'Reports', icon: 'bar_chart', route: '/reports' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ];

  isExpanded(label: string): boolean {
    return this._expanded().has(label);
  }

  toggleGroup(label: string): void {
    this._expanded.update(set => {
      const next = new Set(set);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

  onNavClick() {
    // Close sidebar on mobile after nav
    if (this.isMobile) this.closeRequest.emit();
  }
}
