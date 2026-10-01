import { Component, inject, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, MatIconModule, MatButtonModule,
    MatMenuModule, MatBadgeModule, MatTooltipModule,
  ],
  template: `
    <header class="app-header">
      <!-- Hamburger (mobile + tablet) -->
      <button class="hamburger-btn" (click)="toggleSidebar.emit()" matTooltip="Menu">
        <mat-icon>{{ sidebarOpen ? 'menu_open' : 'menu' }}</mat-icon>
      </button>

      <!-- Logo on mobile -->
      <div class="mobile-logo">
        <div class="mobile-logo-icon"><mat-icon>auto_awesome</mat-icon></div>
        <span class="mobile-logo-name">HRGenie</span>
      </div>

      <!-- Search (hidden on mobile) -->
      <div class="header-search">
        <mat-icon class="search-icon">search</mat-icon>
        <input
          class="search-input"
          placeholder="Search employees, documents, or actions..."
          readonly
        />
        <kbd class="search-kbd">Ctrl + K</kbd>
      </div>

      <!-- Right Actions -->
      <div class="header-actions">
        <!-- Notifications -->
        <button
          mat-icon-button
          class="header-icon-btn"
          [matMenuTriggerFor]="notifMenu"
          matTooltip="Notifications"
        >
          <span
            [matBadge]="notifService.unreadCount() > 0 ? notifService.unreadCount() : null"
            matBadgeColor="warn"
            matBadgeSize="small"
            matBadgeOverlap="true"
          >
            <mat-icon>notifications_outlined</mat-icon>
          </span>
        </button>

        <!-- Notification Menu -->
        <mat-menu #notifMenu="matMenu" class="notif-menu" xPosition="before">
          <div class="notif-header" (click)="$event.stopPropagation()">
            <span class="notif-title">Notifications</span>
            <button mat-button class="notif-mark-all" (click)="notifService.markAllRead()">
              Mark all read
            </button>
          </div>
          @for (n of notifService.notifications(); track n.id) {
            <div class="notif-item" [class.notif-unread]="!n.read" (click)="notifService.markAsRead(n.id)">
              <div class="notif-dot" [class]="'notif-dot--' + n.type"></div>
              <div class="notif-content">
                <p class="notif-item-title">{{ n.title }}</p>
                <p class="notif-item-msg">{{ n.message }}</p>
                <span class="notif-time">{{ n.createdAt }}</span>
              </div>
            </div>
          }
        </mat-menu>

        <!-- Divider (hidden on mobile) -->
        <div class="header-divider"></div>

        <!-- User -->
        <button
          mat-button
          class="user-btn"
          [matMenuTriggerFor]="userMenu"
        >
          <div class="user-avatar">{{ userInitials() }}</div>
          <div class="user-info">
            <span class="user-name">{{ authService.user()?.name }}</span>
            <span class="user-role">{{ authService.user()?.role }}</span>
          </div>
          <mat-icon class="user-chevron">expand_more</mat-icon>
        </button>

        <!-- User Menu -->
        <mat-menu #userMenu="matMenu" xPosition="before">
          <button mat-menu-item>
            <mat-icon>person</mat-icon>
            <span>My Profile</span>
          </button>
          <button mat-menu-item>
            <mat-icon>manage_accounts</mat-icon>
            <span>Account Settings</span>
          </button>
          <button mat-menu-item>
            <mat-icon>logout</mat-icon>
            <span>Sign Out</span>
          </button>
        </mat-menu>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      height: var(--header-height);
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      padding: 0 20px;
      gap: 12px;
      position: sticky;
      top: 0;
      z-index: 50;
      flex-shrink: 0;
    }

    /* Hamburger — visible on tablet + mobile */
    .hamburger-btn {
      display: none;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border: none;
      background: transparent;
      border-radius: 8px;
      cursor: pointer;
      color: var(--color-text-secondary);
      flex-shrink: 0;

      mat-icon { font-size: 22px; width: 22px; height: 22px; }
      &:hover { background: #f3f4f6; }

      @media (max-width: 1023px) { display: flex; }
    }

    /* Mobile logo */
    .mobile-logo {
      display: none;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;

      @media (max-width: 767px) { display: flex; }
    }

    .mobile-logo-icon {
      width: 28px; height: 28px;
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      border-radius: 7px;
      display: flex; align-items: center; justify-content: center;
      mat-icon { color: white; font-size: 16px; width: 16px; height: 16px; }
    }

    .mobile-logo-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    /* Search */
    .header-search {
      flex: 1;
      max-width: 440px;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f8f9fc;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      padding: 0 12px;
      height: 38px;
      cursor: pointer;
      transition: border-color 0.15s;

      &:hover { border-color: #c4b5fd; }

      /* Hide on mobile */
      @media (max-width: 767px) { display: none; }
      /* Shrink on tablet */
      @media (max-width: 1023px) { max-width: 240px; }
    }

    .search-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--color-text-muted);
    }

    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      font-family: inherit;
      cursor: pointer;
      min-width: 0;

      &::placeholder { color: var(--color-text-muted); }
    }

    .search-kbd {
      background: var(--color-border);
      color: var(--color-text-muted);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-family: inherit;
      font-weight: 500;
      white-space: nowrap;

      @media (max-width: 1023px) { display: none; }
    }

    /* Right actions */
    .header-actions {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .header-icon-btn {
      width: 38px !important;
      height: 38px !important;
      color: var(--color-text-secondary) !important;

      mat-icon { font-size: 20px; width: 20px; height: 20px; }
      &:hover { background: #f3f4f6 !important; }
    }

    .header-divider {
      width: 1px;
      height: 28px;
      background: var(--color-border);
      margin: 0 4px;

      @media (max-width: 767px) { display: none; }
    }

    .user-btn {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      padding: 4px 6px !important;
      border-radius: 8px !important;
      height: auto !important;
      min-height: 40px !important;

      &:hover { background: #f8f9fc !important; }
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.78rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1px;

      @media (max-width: 767px) { display: none; }
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-primary);
      line-height: 1.2;
    }

    .user-role {
      font-size: 0.7rem;
      color: var(--color-text-muted);
      line-height: 1.2;
    }

    .user-chevron {
      font-size: 16px !important;
      width: 16px !important;
      height: 16px !important;
      color: var(--color-text-muted) !important;

      @media (max-width: 767px) { display: none !important; }
    }

    /* Notification Menu Styles */
    .notif-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px 8px;
      border-bottom: 1px solid var(--color-border);
    }

    .notif-title { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); }

    .notif-mark-all {
      font-size: 0.75rem !important;
      color: var(--color-primary) !important;
      padding: 0 4px !important;
      min-width: auto !important;
      height: auto !important;
    }

    .notif-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px 16px;
      cursor: pointer;
      transition: background 0.1s;
      min-width: 280px;
      max-width: 340px;

      @media (max-width: 479px) { min-width: 260px; max-width: 300px; }

      &:hover { background: #f8f9fc; }
      &.notif-unread { background: #faf5ff; }
    }

    .notif-dot {
      width: 8px; height: 8px; border-radius: 50%;
      margin-top: 5px; flex-shrink: 0;

      &--info { background: #3b82f6; }
      &--success { background: #10b981; }
      &--warning { background: #f59e0b; }
      &--error { background: #ef4444; }
    }

    .notif-content { flex: 1; min-width: 0; }
    .notif-item-title { font-size: 0.8rem; font-weight: 600; color: var(--color-text-primary); margin: 0 0 2px; }
    .notif-item-msg { font-size: 0.75rem; color: var(--color-text-secondary); margin: 0 0 4px; line-height: 1.4; }
    .notif-time { font-size: 0.7rem; color: var(--color-text-muted); }
  `]
})
export class HeaderComponent {
  @Input() sidebarOpen = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  readonly authService = inject(AuthService);
  readonly notifService = inject(NotificationService);

  userInitials = () => {
    const name = this.authService.user()?.name ?? '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
}
