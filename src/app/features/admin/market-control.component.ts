import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-market-control',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="market-control">
      <h1>Market Control</h1>
      <p class="placeholder">Market administration controls will be displayed here</p>
    </div>
  `,
  styles: [`
    .market-control {
      padding: 120px 48px 48px;
    }

    h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 32px;
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
export class MarketControlComponent {}
