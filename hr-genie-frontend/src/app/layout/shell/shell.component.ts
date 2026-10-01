import { Component, signal, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent],
  template: `
    <!-- Mobile overlay backdrop -->
    <div
      class="sidebar-overlay"
      [class.active]="sidebarOpen()"
      (click)="closeSidebar()"
    ></div>

    <div class="app-shell">
      <app-sidebar
        [isOpen]="sidebarOpen()"
        [isMobile]="isMobile()"
        [isTablet]="isTablet()"
        (closeRequest)="closeSidebar()"
      />
      <div class="app-main" [class.sidebar-collapsed]="isTablet() && !isMobile()">
        <app-header
          [sidebarOpen]="sidebarOpen()"
          (toggleSidebar)="toggleSidebar()"
        />
        <main class="app-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      min-height: 100vh;
      background: var(--color-surface-secondary);
    }

    .app-main {
      flex: 1;
      margin-left: var(--sidebar-width);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      min-width: 0;
      transition: margin-left 0.25s ease;

      /* Tablet: icon-only sidebar = 64px */
      @media (max-width: 1023px) {
        margin-left: 64px;
      }

      /* Mobile: no sidebar margin */
      @media (max-width: 767px) {
        margin-left: 0;
      }
    }

    .app-content {
      flex: 1;
      overflow-x: hidden;
    }

    .sidebar-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 99;
      backdrop-filter: blur(1px);

      @media (max-width: 767px) {
        &.active { display: block; }
      }
    }
  `]
})
export class ShellComponent {
  sidebarOpen = signal(false);
  isMobile = signal(false);
  isTablet = signal(false);

  constructor() {
    this.checkBreakpoint();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkBreakpoint();
    // Auto-close mobile sidebar on resize to desktop
    if (!this.isMobile()) this.sidebarOpen.set(false);
  }

  private checkBreakpoint() {
    const w = window.innerWidth;
    this.isMobile.set(w <= 767);
    this.isTablet.set(w > 767 && w <= 1023);
  }

  toggleSidebar() { this.sidebarOpen.update(v => !v); }
  closeSidebar()  { this.sidebarOpen.set(false); }
}
