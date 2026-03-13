import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceBadgeComponent } from '../../shared/price-badge.component';
import { CurrencyPipe } from '../../shared/currency.pipe';

@Component({
  selector: 'app-trader-dashboard',
  standalone: true,
  imports: [CommonModule, PriceBadgeComponent, CurrencyPipe],
  template: `
    <div class="dashboard">
      <h1>Trader Dashboard</h1>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Portfolio Value</div>
          <div class="stat-value">{{ 125430.50 | currency }}</div>
          <app-price-badge [value]="2.5" prefix="+" suffix="%" />
        </div>

        <div class="stat-card">
          <div class="stat-label">Today's P&L</div>
          <div class="stat-value positive">{{ 1250.30 | currency }}</div>
          <app-price-badge [value]="1.2" prefix="+" suffix="%" />
        </div>

        <div class="stat-card">
          <div class="stat-label">Open Positions</div>
          <div class="stat-value">12</div>
          <div class="stat-meta">Active trades</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Buying Power</div>
          <div class="stat-value">{{ 45230.00 | currency }}</div>
          <div class="stat-meta">Available</div>
        </div>
      </div>

      <div class="section">
        <h2>Recent Activity</h2>
        <p class="placeholder">Trading activity and recent transactions will appear here</p>
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

    .stat-value.positive {
      color: #22c55e;
    }

    .stat-meta {
      font-size: 0.75rem;
      color: rgba(120,140,200,0.38);
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
export class TraderDashboardComponent {}
