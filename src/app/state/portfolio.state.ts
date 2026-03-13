import { signal } from '@angular/core';

export interface Holding {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface PortfolioState {
  holdings: Holding[];
  totalValue: number;
  cash: number;
  totalGainLoss: number;
}

export const portfolioState = signal<PortfolioState>({
  holdings: [],
  totalValue: 0,
  cash: 0,
  totalGainLoss: 0
});
