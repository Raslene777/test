import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trade-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="trade-panel">
      <h2>Trade Panel</h2>
      <p class="placeholder">Trading interface will be displayed here</p>
    </div>
  `,
  styles: [`
    .trade-panel {
      padding: 120px 48px 48px;
    }

    h2 {
      font-size: 2rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 24px;
    }

    .placeholder {
      background: rgba(12,17,50,0.6);
      border: 1px solid rgba(100,140,255,0.15);
      border-radius: 16px;
      padding: 60px;
      text-align: center;
      color: rgba(170,185,240,0.58);
    }
  `]
})
export class TradePanelComponent {}
