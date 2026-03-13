import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed()">
      <div class="sidebar-content">
        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="sidebar-link">
            <span class="icon">📊</span>
            @if (!collapsed()) {
              <span>Dashboard</span>
            }
          </a>
          <a routerLink="/market" routerLinkActive="active" class="sidebar-link">
            <span class="icon">📈</span>
            @if (!collapsed()) {
              <span>Market</span>
            }
          </a>
          <a routerLink="/trading" routerLinkActive="active" class="sidebar-link">
            <span class="icon">💹</span>
            @if (!collapsed()) {
              <span>Trading</span>
            }
          </a>
          <a routerLink="/portfolio" routerLinkActive="active" class="sidebar-link">
            <span class="icon">💼</span>
            @if (!collapsed()) {
              <span>Portfolio</span>
            }
          </a>
        </nav>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0;
      top: 100px;
      bottom: 0;
      width: 240px;
      background: rgba(10,14,40,0.6);
      backdrop-filter: blur(20px);
      border-right: 1px solid rgba(100,140,255,0.12);
      padding: 24px 16px;
      transition: width 0.3s;
      z-index: 50;
    }

    .sidebar.collapsed {
      width: 80px;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      color: rgba(170,185,240,0.58);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s;
      border: 1px solid transparent;
    }

    .sidebar-link:hover {
      background: rgba(100,140,255,0.08);
      border-color: rgba(100,140,255,0.15);
      color: #dde6ff;
    }

    .sidebar-link.active {
      background: rgba(61,90,255,0.12);
      border-color: rgba(100,140,255,0.25);
      color: #fff;
    }

    .icon {
      font-size: 1.2rem;
      flex-shrink: 0;
    }
  `]
})
export class SidebarComponent {
  collapsed = input(false);
}
