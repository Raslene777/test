import { signal } from '@angular/core';

export interface Order {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  status: 'pending' | 'filled' | 'cancelled';
}

export interface TradingState {
  openOrders: Order[];
  orderHistory: Order[];
}

export const tradingState = signal<TradingState>({
  openOrders: [],
  orderHistory: []
});
