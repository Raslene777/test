import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="nav-wrap">
      <nav>
        <a class="nav-logo" routerLink="/">
          <div class="logo-icon"></div>
          OrionTrade
        </a>

        <ul class="nav-links">
          <li class="nav-item">
            <a routerLink="/market" routerLinkActive="active">Market</a>
            <div class="dropdown">
              <a routerLink="/market/overview">Overview</a>
              <a routerLink="/market/stocks">Stocks</a>
              <a routerLink="/market/crypto">Crypto</a>
              <a routerLink="/market/etf">ETFs</a>
              <a routerLink="/market/forex">Forex</a>
            </div>
          </li>

          <li class="nav-item">
            <a routerLink="/trading" routerLinkActive="active">Trading</a>
            <div class="dropdown">
              <a routerLink="/trading/how-it-works">How it works</a>
              <a routerLink="/trading/features">Features</a>
              <a routerLink="/trading/security">Security</a>
              <a routerLink="/trading/api">API</a>
            </div>
          </li>

          <li class="nav-item">
            <a routerLink="/portfolio" routerLinkActive="active">Portfolio</a>
            <div class="dropdown">
              <a routerLink="/portfolio/analytics">Analytics</a>
              <a routerLink="/portfolio/risk">Risk Management</a>
              <a routerLink="/portfolio/reports">Reports</a>
              <a routerLink="/portfolio/mobile">Mobile App</a>
            </div>
          </li>
          <li class="nav-item simulator">
            <a routerLink="/simulator" routerLinkActive="Simulator">Simulator</a>
          </li>

          <li class="nav-item">
            <a routerLink="/aboutnavbar" routerLinkActive="active">About us</a>
            <div class="dropdown">
              <a routerLink="/about/company">Company</a>
              <a routerLink="/about/security">Security</a>
              <a routerLink="/about/pricing">Pricing</a>
              <a routerLink="/about/contact">Contact</a>
            </div>
          </li>

          @if (authService.hasRole('admin')) {
            <li><a routerLink="/admin" routerLinkActive="active">Admin</a></li>
          }
        </ul>

        <div class="nav-actions">
          @if (!authService.isAuthenticated()) {
            <button class="btn-ghost" routerLink="/login">Log in</button>
            <button class="btn-signin" routerLink="/register">Sign in</button>
          } @else {
            <button class="btn-ghost" (click)="logout()">Logout</button>
          }
        </div>
      </nav>
    </div>
  `,
  styles: [
    `
      .nav-wrap {
        position: fixed;
        top: 18px;
        left: 0;
        right: 0;
        z-index: 100;
        display: flex;
        justify-content: center;
        padding: 0 24px;
      }

      nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 1100px;
        height: 58px;
        padding: 0 22px;
        background: rgba(10, 14, 40, 0.62);
        backdrop-filter: blur(17px) saturate(160%);
        border: 1px solid rgba(100, 140, 255, 0.22);
        border-radius: 18px;
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.055);
      }

      .nav-logo {
        font-size: 1.05rem;
        font-weight: 800;
        color: #dde6ff;
        display: flex;
        align-items: center;
        gap: 9px;
        letter-spacing: -0.02em;
        text-decoration: none;
      }
      .simulator {
        border: 1px solid rgba(100, 140, 255, 0.8);
        border-radius: 18px;
        
      }

      .logo-icon {
        width: 50px;
        height: 50px;
        border-radius: 8px;
        background: url('../../assets/logo.svg') no-repeat center;
        background-size: contain;
      }

      .nav-links {
        display: flex;
        gap: 6px;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .nav-item {
        position: relative;
      }

      .nav-links > li > a {
        display: block;
        color: rgba(170, 185, 240, 0.58);
        text-decoration: none;
        font-size: 0.82rem;
        font-weight: 500;
        padding: 6px 14px;
        border-radius: 10px;
        border: 1px solid transparent;
        transition: all 0.25s;
      }

      .nav-links > li > a:hover,
      .nav-links > li > a.active {
        color: #dde6ff;
        border-color: rgba(100, 140, 255, 0.22);
        background: rgba(100, 140, 255, 0.08);
        box-shadow: 0 0 14px rgba(100, 140, 255, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.04);
      }

      .dropdown {
        position: absolute;
        top: 120%;
        left: 0;
        min-width: 190px;
        padding: 10px;
        background: rgba(12, 18, 50, 0.92);
        backdrop-filter: blur(18px);
        border: 1px solid rgba(100, 140, 255, 0.18);
        border-radius: 14px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
        display: flex;
        flex-direction: column;
        gap: 4px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(8px);
        transition: all 0.25s ease;
      }

      .dropdown a {
        color: rgba(170, 185, 240, 0.65);
        text-decoration: none;
        font-size: 0.78rem;
        padding: 8px 12px;
        border-radius: 8px;
        transition: all 0.2s;
      }

      .dropdown a:hover {
        background: rgba(100, 140, 255, 0.12);
        color: #dde6ff;
      }

      .nav-item:hover .dropdown {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .nav-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .btn-ghost {
        background: none;
        border: 1px solid rgba(255, 255, 255, 0.07);
        color: rgba(170, 185, 240, 0.58);
        padding: 7px 18px;
        border-radius: 10px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-ghost:hover {
        color: #dde6ff;
        border-color: rgba(100, 140, 255, 0.22);
        background: rgba(100, 140, 255, 0.07);
      }

      .btn-signin {
        background: linear-gradient(135deg, #3d5aff, #6c3fff);
        border: none;
        color: #fff;
        padding: 8px 20px;
        border-radius: 10px;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 18px rgba(61, 90, 255, 0.4);
        transition: all 0.2s;
      }

      .btn-signin:hover {
        opacity: 0.9;
        transform: translateY(-1px);
        box-shadow: 0 6px 28px rgba(61, 90, 255, 0.55);
      }

      @media (max-width: 900px) {
        .nav-wrap {
          padding: 0 12px;
        }

        .nav-links {
          display: none;
        }
      }
    `,
  ],
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}
  logout(): void {
    this.authService.logout();
  }
}