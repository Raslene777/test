import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, TableColumn } from '../../shared/table.component';

@Component({
  selector: 'app-open-orders',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <div class="open-orders">
      <h3>Open Orders</h3>
      <app-table [columns]="columns" [data]="orders" />
    </div>
  `,
  styles: [`
    .open-orders {
      background: rgba(12,17,50,0.6);
      border: 1px solid rgba(100,140,255,0.15);
      border-radius: 16px;
      padding: 24px;
    }

    h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 20px;
    }
  `]
})
export class OpenOrdersComponent {
  columns: TableColumn[] = [
    { key: 'symbol', label: 'Symbol' },
    { key: 'type', label: 'Type' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'price', label: 'Price' },
    { key: 'status', label: 'Status' }
  ];

  orders: any[] = [];
}
