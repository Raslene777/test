import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NumericOnlyDirective } from '../../shared/numeric-only.directive';

@Component({
  selector: 'app-buy-sell-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NumericOnlyDirective],
  template: `
    <div class="buy-sell-form">
      <div class="tabs">
        <button
          class="tab"
          [class.active]="activeTab() === 'buy'"
          (click)="activeTab.set('buy')">
          Buy
        </button>
        <button
          class="tab"
          [class.active]="activeTab() === 'sell'"
          (click)="activeTab.set('sell')">
          Sell
        </button>
      </div>

      <form>
        <div class="form-group">
          <label>Quantity</label>
          <input type="text" appNumericOnly placeholder="0" />
        </div>

        <div class="form-group">
          <label>Price</label>
          <input type="text" appNumericOnly placeholder="0.00" />
        </div>

        <button type="submit" class="submit-btn" [class.buy]="activeTab() === 'buy'" [class.sell]="activeTab() === 'sell'">
          {{ activeTab() === 'buy' ? 'Place Buy Order' : 'Place Sell Order' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .buy-sell-form {
      background: rgba(12,17,50,0.6);
      border: 1px solid rgba(100,140,255,0.15);
      border-radius: 16px;
      padding: 24px;
    }

    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
    }

    .tab {
      flex: 1;
      padding: 10px;
      background: none;
      border: 1px solid rgba(100,140,255,0.15);
      border-radius: 10px;
      color: rgba(170,185,240,0.58);
      font-family: inherit;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab.active {
      background: rgba(61,90,255,0.12);
      border-color: rgba(100,140,255,0.3);
      color: #fff;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #dde6ff;
    }

    input {
      padding: 12px 16px;
      background: rgba(10,14,40,0.6);
      border: 1px solid rgba(100,140,255,0.15);
      border-radius: 10px;
      color: #fff;
      font-size: 0.9rem;
      font-family: inherit;
    }

    input:focus {
      outline: none;
      border-color: rgba(100,140,255,0.4);
    }

    .submit-btn {
      padding: 14px;
      border: none;
      border-radius: 10px;
      color: #fff;
      font-size: 0.95rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s;
    }

    .submit-btn.buy {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);
    }

    .submit-btn.sell {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);
    }

    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 28px rgba(61,90,255,0.4);
    }
  `]
})
export class BuySellFormComponent {
  activeTab = signal<'buy' | 'sell'>('buy');
}
