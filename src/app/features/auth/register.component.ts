import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">🪙</div>
          <h2>Create Account</h2>
          <p>Start trading with GoblinBroker today</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label>Name</label>
            <input
              type="text"
              [(ngModel)]="name"
              name="name"
              placeholder="John Doe"
              required
            />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" class="btn-primary" [disabled]="loading()">
            {{ loading() ? 'Creating account...' : 'Sign Up' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Login</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .auth-card {
      width: 100%;
      max-width: 420px;
      background: rgba(12,17,50,0.85);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(100,140,255,0.2);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo {
      width: 60px;
      height: 60px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, #3d5aff, #6c3fff);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      box-shadow: 0 8px 24px rgba(61,90,255,0.4);
    }

    h2 {
      font-size: 1.8rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 8px;
    }

    .auth-header p {
      color: rgba(170,185,240,0.58);
      font-size: 0.9rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-size: 0.85rem;
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
      transition: border-color 0.2s;
    }

    input:focus {
      outline: none;
      border-color: rgba(100,140,255,0.4);
    }

    input::placeholder {
      color: rgba(120,140,200,0.38);
    }

    .btn-primary {
      padding: 14px;
      background: linear-gradient(135deg, #3d5aff, #6c3fff);
      border: none;
      border-radius: 10px;
      color: #fff;
      font-size: 0.95rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 20px rgba(61,90,255,0.4);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 28px rgba(61,90,255,0.5);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-footer {
      margin-top: 24px;
      text-align: center;
      font-size: 0.85rem;
      color: rgba(170,185,240,0.58);
    }

    .auth-footer a {
      color: #6b8fff;
      text-decoration: none;
      font-weight: 600;
    }

    .auth-footer a:hover {
      color: #a5bcff;
    }
  `]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  loading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  onSubmit(): void {
    if (!this.name || !this.email || !this.password) {
      this.toastService.error('Please fill in all fields');
      return;
    }

    this.loading.set(true);

    this.authService.register(this.email, this.password, this.name).subscribe({
      next: () => {
        this.toastService.success('Account created successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.toastService.error('Registration failed. Please try again.');
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}
