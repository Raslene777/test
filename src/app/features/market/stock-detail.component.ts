import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { WebsocketService, MarketUpdate } from '../../core/websocket.service';
import { CurrencyPipe } from '../../shared/currency.pipe';
import { PriceBadgeComponent } from '../../shared/price-badge.component';

@Component({
  selector: 'app-stock-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, PriceBadgeComponent],
  template: `
    <div class="stock-detail">
      @if (stockData(); as stock) {
        <div class="header">
          <h1>{{ stock.symbol }}</h1>
          <div class="price-info">
            <div class="current-price">{{ stock.price | currency }}</div>
            <app-price-badge [value]="stock.change" suffix="%" />
          </div>
        </div>

        <div class="chart-placeholder">
          <p>📈 Price chart will be displayed here</p>
        </div>

        <div class="stats">
          <div class="stat">
            <span class="label">Volume</span>
            <span class="value">{{ (stock.volume / 1000000).toFixed(2) }}M</span>
          </div>
          <div class="stat">
            <span class="label">Last Updated</span>
            <span class="value">{{ formatTime(stock.timestamp) }}</span>
          </div>
        </div>
      } @else {
        <p class="loading">Loading stock data...</p>
      }
    </div>
  `,
  styles: [`
    .stock-detail {
      padding: 120px 48px 48px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 16px;
    }

    .price-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .current-price {
      font-size: 2.2rem;
      font-weight: 800;
      color: #6b8fff;
    }

    .chart-placeholder {
      background: rgba(12,17,50,0.6);
      border: 1px solid rgba(100,140,255,0.15);
      border-radius: 16px;
      padding: 80px;
      text-align: center;
      margin-bottom: 32px;
    }

    .chart-placeholder p {
      font-size: 1.5rem;
      color: rgba(170,185,240,0.38);
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .stat {
      background: rgba(12,17,50,0.6);
      border: 1px solid rgba(100,140,255,0.15);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .label {
      font-size: 0.75rem;
      color: rgba(170,185,240,0.58);
      font-weight: 500;
    }

    .value {
      font-size: 1.3rem;
      font-weight: 700;
      color: #fff;
    }

    .loading {
      text-align: center;
      color: rgba(170,185,240,0.58);
      padding: 60px;
      font-size: 1rem;
    }
  `]
})
export class StockDetailComponent implements OnInit {
  stockData = signal<MarketUpdate | null>(null);
  symbol = '';

  constructor(
    private route: ActivatedRoute,
    private wsService: WebsocketService
  ) {}

  ngOnInit(): void {
    this.symbol = this.route.snapshot.paramMap.get('symbol') || '';

    if (this.symbol) {
      this.wsService.subscribeToSymbol(this.symbol).subscribe(data => {
        this.stockData.set(data);
      });
    }
  }

  formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString();
  }
}
