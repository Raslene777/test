import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stock-card">
      <div class="symbol">{{ symbol() }}</div>
      <div class="price">\${{ price() }}</div>
      <div class="change" [class.positive]="change() > 0" [class.negative]="change() < 0">
        {{ change() > 0 ? '+' : '' }}{{ change() }}%
      </div>
    </div>
  `,
  styles: [`
    .stock-card {
      padding: 16px;
      background: rgba(12,17,50,0.6);
      border: 1px solid rgba(100,140,255,0.15);
      border-radius: 12px;
    }

    .symbol {
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
    }

    .price {
      font-size: 1.4rem;
      font-weight: 800;
      color: #6b8fff;
      margin-bottom: 4px;
    }

    .change {
      font-size: 0.85rem;
      font-weight: 600;
    }

    .positive {
      color: #22c55e;
    }

    .negative {
      color: #ef4444;
    }
  `]
})
export class StockCardComponent {
  symbol = input.required<string>();
  price = input.required<number>();
  change = input.required<number>();
}
