import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="modal-overlay" (click)="onClose()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ title() }}</h3>
            <button class="close-btn" (click)="onClose()">✕</button>
          </div>
          <div class="modal-body">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s;
    }

    .modal-content {
      background: rgba(12,17,50,0.95);
      border: 1px solid rgba(100,140,255,0.2);
      border-radius: 20px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow: auto;
      box-shadow: 0 20px 80px rgba(0,0,0,0.5);
      animation: slideUp 0.3s;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid rgba(100,140,255,0.12);
    }

    .modal-header h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: #fff;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      color: rgba(170,185,240,0.58);
      font-size: 1.5rem;
      cursor: pointer;
      transition: color 0.2s;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      color: #fff;
    }

    .modal-body {
      padding: 24px;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ModalComponent {
  isOpen = input(false);
  title = input('');
  close = output<void>();

  onClose(): void {
    this.close.emit();
  }
}
