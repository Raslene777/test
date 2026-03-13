import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pnl-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pnl-widget">
      <h3>P&L Overview</h3>
      <p class="placeholder">Profit & Loss chart will be displayed here</p>
    </div>
  `,
  styles: [`
    .pnl-widget {
      background: rgba(12,17,50,0.6);
      border: 1px solid rgba(100,140,255,0.15);
      border-radius: 16px;
      padding: 24px;
    }

    h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 16px;
    }

    .placeholder {
      text-align: center;
      color: rgba(170,185,240,0.58);
      padding: 60px;
    }
  `]
})
export class PnlWidgetComponent {}
