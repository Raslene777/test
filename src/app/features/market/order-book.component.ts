import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-book',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-book">
      <h3>Order Book</h3>
      <p class="placeholder">Order book data will be displayed here</p>
    </div>
  `,
  styles: [`
    .order-book {
      background: rgba(12,17,50,0.6);
      border: 1px solid rgba(100,140,255,0.15);
      border-radius: 12px;
      padding: 24px;
    }

    h3 {
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 16px;
    }

    .placeholder {
      color: rgba(170,185,240,0.58);
      text-align: center;
      padding: 40px;
    }
  `]
})
export class OrderBookComponent {}
