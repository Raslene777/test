import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, TableColumn } from '../../shared/table.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <div class="user-management">
      <h1>User Management</h1>
      <app-table [columns]="columns" [data]="users" />
    </div>
  `,
  styles: [`
    .user-management {
      padding: 120px 48px 48px;
    }

    h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 32px;
    }
  `]
})
export class UserManagementComponent {
  columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' }
  ];

  users: any[] = [];
}
