import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '../../shared/currency.pipe';
import { PriceBadgeComponent } from '../../shared/price-badge.component';

@Component({
  selector: 'app-portfolio-overview',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, PriceBadgeComponent],
  template: `
    <div class="portfolio">
      <h1>Portfolio</h1>

      <div class="summary">
        <div class="summary-card">
          <div class="label">Total Value</div>
          <div class="value">{{ 125430.50 | currency }}</div>
          <app-price-badge [value]="2.5" prefix="+" suffix="%" />
        </div>

        <div class="summary-card">
          <div class="label">Total Gain/Loss</div>
          <div class="value positive">{{ 5430.50 | currency }}</div>
          <app-price-badge [value]="4.5" prefix="+" suffix="%" />
        </div>

        <div class="summary-card">
          <div class="label">Cash</div>
          <div class="value">{{ 45230.00 | currency }}</div>
        </div>
      </div>

      <div class="holdings">
        <h2>Holdings</h2>
        <p class="placeholder">Portfolio holdings will be displayed here</p>
      </div>
    </div>
  `,
  styles: [`
    .portfolio {
      padding: 120px 48px 48px;
    }

    h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 32px;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .summary-card {
      background: rgba(12,17,50,0.6);
      border: 1px solid rgba(100,140,255,0.15);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .label {
      font-size: 0.8rem;
      color: rgba(170,185,240,0.58);
      font-weight: 500;
    }

    .value {
      font-size: 1.8rem;
      font-weight: 800;
      color: #fff;
    }

    .value.positive {
      color: #22c55e;
    }

    .holdings {
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
      text-align: center;
      color: rgba(170,185,240,0.58);
      padding: 40px;
    }
  `]
})
export class PortfolioOverviewComponent {}
