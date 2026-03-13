import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <table class="custom-table">
        <thead>
          <tr>
            @for (column of columns(); track column.key) {
              <th>{{ column.label }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of data(); track $index) {
            <tr>
              @for (column of columns(); track column.key) {
                <td>{{ row[column.key] }}</td>
              }
            </tr>
          }
          @empty {
            <tr>
              <td [attr.colspan]="columns().length" class="empty-state">
                No data available
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-container {
      overflow-x: auto;
      border: 1px solid rgba(100,140,255,0.12);
      border-radius: 12px;
      background: rgba(10,14,40,0.4);
    }

    .custom-table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background: rgba(61,90,255,0.08);
      border-bottom: 1px solid rgba(100,140,255,0.15);
    }

    th {
      padding: 14px 16px;
      text-align: left;
      font-size: 0.8rem;
      font-weight: 600;
      color: #dde6ff;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    td {
      padding: 12px 16px;
      font-size: 0.85rem;
      color: rgba(170,185,240,0.78);
      border-bottom: 1px solid rgba(100,140,255,0.08);
    }

    tbody tr {
      transition: background 0.2s;
    }

    tbody tr:hover {
      background: rgba(100,140,255,0.05);
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: rgba(120,140,200,0.38);
      font-style: italic;
    }
  `]
})
export class TableComponent {
  columns = input.required<TableColumn[]>();
  data = input.required<any[]>();
}
