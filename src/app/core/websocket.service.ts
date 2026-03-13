import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface MarketUpdate {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private marketUpdates = new BehaviorSubject<MarketUpdate[]>([]);
  public marketUpdates$ = this.marketUpdates.asObservable();
  private isConnected = false;

  connect(): void {
    if (this.isConnected) return;

    this.isConnected = true;
    this.simulateMarketData();
  }

  disconnect(): void {
    this.isConnected = false;
  }

  private simulateMarketData(): void {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

    setInterval(() => {
      if (!this.isConnected) return;

      const updates = symbols.map(symbol => ({
        symbol,
        price: 100 + Math.random() * 400,
        change: (Math.random() - 0.5) * 10,
        volume: Math.floor(Math.random() * 10000000),
        timestamp: Date.now()
      }));

      this.marketUpdates.next(updates);
    }, 2000);
  }

  subscribeToSymbol(symbol: string): Observable<MarketUpdate> {
    return new Observable(observer => {
      const interval = setInterval(() => {
        observer.next({
          symbol,
          price: 100 + Math.random() * 400,
          change: (Math.random() - 0.5) * 10,
          volume: Math.floor(Math.random() * 10000000),
          timestamp: Date.now()
        });
      }, 1000);

      return () => clearInterval(interval);
    });
  }
}
