import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-depth-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="depth-chart">
      <h3>Market Depth</h3>
      <p class="placeholder">Depth chart visualization will be displayed here</p>
    </div>
  `,
  styles: [`
    .depth-chart {
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
export class DepthChartComponent {}
