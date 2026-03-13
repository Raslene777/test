import { signal } from '@angular/core';
import { MarketUpdate } from '../core/websocket.service';

export interface MarketState {
  selectedSymbol: string | null;
  marketData: MarketUpdate[];
  isConnected: boolean;
}

export const marketState = signal<MarketState>({
  selectedSymbol: null,
  marketData: [],
  isConnected: false
});
