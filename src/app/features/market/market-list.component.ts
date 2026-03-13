import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WebsocketService, MarketUpdate } from '../../core/websocket.service';
import { CurrencyPipe } from '../../shared/currency.pipe';
import { PriceBadgeComponent } from '../../shared/price-badge.component';

@Component({
  selector: 'app-market-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, PriceBadgeComponent],
  template: `
    <div class="market-list">
      <h1>Market Overview</h1>

      <div class="market-grid">
        @for (stock of markets(); track stock.symbol) {
          <a [routerLink]="['/market', stock.symbol]" class="market-card">
            <div class="symbol">{{ stock.symbol }}</div>
            <div class="price">{{ stock.price | currency }}</div>
            <app-price-badge [value]="stock.change" suffix="%" />
            <div class="volume">Vol: {{ (stock.volume / 1000000).toFixed(2) }}M</div>
          </a>
        } @empty {
          <p class="empty">Connecting to market data...</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .market-list {
      padding: 120px 48px 48px;
    }

    h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 32px;
    }

    .market-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .market-card {
      background: rgba(12,17,50,0.6);
      border: 1px solid rgba(100,140,255,0.15);
      border-radius: 16px;
      padding: 24px;
      text-decoration: none;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .market-card:hover {
      border-color: rgba(100,140,255,0.3);
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(61,90,255,0.15);
    }

    .symbol {
      font-size: 1.2rem;
      font-weight: 700;
      color: #fff;
    }

    .price {
      font-size: 1.6rem;
      font-weight: 800;
      color: #6b8fff;
    }

    .volume {
      font-size: 0.75rem;
      color: rgba(120,140,200,0.38);
    }

    .empty {
      grid-column: 1 / -1;
      text-align: center;
      color: rgba(170,185,240,0.58);
      padding: 60px;
      font-size: 1rem;
    }
  `]
})
export class MarketListComponent implements OnInit {
  markets = signal<MarketUpdate[]>([]);

  constructor(private wsService: WebsocketService) {}

  ngOnInit(): void {
    this.wsService.connect();
    this.wsService.marketUpdates$.subscribe(updates => {
      this.markets.set(updates);
    });
  }
}
