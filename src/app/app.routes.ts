import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';
import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { TraderDashboardComponent } from './features/dashboard/trader-dashboard.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard.component';
import { MarketListComponent } from './features/market/market-list.component';
import { OverviewComponent } from './features/market/overview.component';
import { StockDetailComponent } from './features/market/stock-detail.component';
import { TradePanelComponent } from './features/trading/trade-panel.component';
import { PortfolioOverviewComponent } from './features/portfolio/portfolio-overview.component';
import { UserManagementComponent } from './features/admin/user-management.component';
import { MarketControlComponent } from './features/admin/market-control.component';
import {AboutUsComponent} from "./features/AboutUs/aboutus.component";
import { PredictorComponent } from './features/Simulator/predictor.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'market/overview', component: OverviewComponent },
  { path: 'about/company', component: AboutUsComponent },
  { path: 'simulator', component: PredictorComponent },
  {
    path: 'dashboard',
    component: TraderDashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'market',
    component: MarketListComponent,
    canActivate: [authGuard]
  },

  {
    path: 'market/:symbol',
    component: StockDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'trading',
    component: TradePanelComponent,
    canActivate: [authGuard]
  },
  {
    path: 'portfolio',
    component: PortfolioOverviewComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['admin'])],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'market-control', component: MarketControlComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
