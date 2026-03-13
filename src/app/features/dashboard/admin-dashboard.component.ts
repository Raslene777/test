import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Admin Dashboard</h1>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Users</div>
          <div class="stat-value">1,234</div>
          <div class="stat-meta">+45 this week</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Active Traders</div>
          <div class="stat-value">856</div>
          <div class="stat-meta">69% online</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Total Volume</div>
          <div class="stat-value">$12.5M</div>
          <div class="stat-meta">Last 24h</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">System Status</div>
          <div class="stat-value status-indicator">
            <span class="status-dot active"></span> Operational
          </div>
          <div class="stat-meta">All systems normal</div>
        </div>
      </div>

      <div class="section">
        <h2>System Overview</h2>
        <p class="placeholder">Admin controls and system metrics will appear here</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 120px 48px 48px;
    }

    h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 32px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: rgba(12,17,50,0.6);
      border: 1px solid rgba(100,140,255,0.15);
      border-radius: 16px;
      padding: 24px;
      transition: all 0.3s;
    }

    .stat-card:hover {
      border-color: rgba(100,140,255,0.3);
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(61,90,255,0.12);
    }

    .stat-label {
      font-size: 0.8rem;
      color: rgba(170,185,240,0.58);
      margin-bottom: 8px;
      font-weight: 500;
    }

    .stat-value {
      font-size: 1.8rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 12px;
    }

    .stat-meta {
      font-size: 0.75rem;
      color: rgba(120,140,200,0.38);
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.2rem;
    }

    .status-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #666;
    }

    .status-dot.active {
      background: #22c55e;
      box-shadow: 0 0 12px #22c55e;
    }

    .section {
      background: rgba(12,17,50,0.4);
      border: 1px solid rgba(100,140,255,0.12);
      border-radius: 16px;
      padding: 32px;
    }

    h2 {
      font-size: 1.3rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 20px;
    }

    .placeholder {
      color: rgba(170,185,240,0.58);
      font-size: 0.9rem;
      text-align: center;
      padding: 40px;
    }
  `]
})
export class AdminDashboardComponent {}
