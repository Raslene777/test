import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-price-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="price-badge" [class]="colorClass()">
      {{ prefix() }}{{ value() }}{{ suffix() }}
    </span>
  `,
  styles: [`
    .price-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      border: 1px solid;
    }

    .positive {
      background: rgba(34, 197, 94, 0.1);
      border-color: rgba(34, 197, 94, 0.3);
      color: #22c55e;
    }

    .negative {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.3);
      color: #ef4444;
    }

    .neutral {
      background: rgba(100,140,255,0.08);
      border-color: rgba(100,140,255,0.15);
      color: #dde6ff;
    }
  `]
})
export class PriceBadgeComponent {
  value = input.required<number>();
  prefix = input('');
  suffix = input('');

  colorClass = computed(() => {
    const val = this.value();
    if (val > 0) return 'positive';
    if (val < 0) return 'negative';
    return 'neutral';
  });
}
