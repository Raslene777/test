import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/navbar.component';
import { forkJoin } from 'rxjs';
interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

interface GlobalData {
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_change_percentage_24h_usd: number;
  active_cryptocurrencies: number;
  markets: number;
}

interface GlobalResponse {
  data: GlobalData;
}

@Component({
  selector: 'app-market-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  isLoading = signal(true);
  error = signal<string | null>(null);
  now = signal(new Date());

  global = signal<GlobalData | null>(null);
  coins = signal<CoinMarket[]>([]);

  trending = computed(() => this.coins().slice(0, 10));

  topGainers = computed(() =>
    [...this.coins()]
      .filter(c => typeof c.price_change_percentage_24h === 'number')
      .sort(
        (a, b) =>
          (b.price_change_percentage_24h || 0) -
          (a.price_change_percentage_24h || 0)
      )
      .slice(0, 6)
  );

  primaryAsset = computed(() => this.trending()[0] || null);

  primaryCandidates = computed(() => this.trending().slice(0, 4));

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    const mockGlobal: GlobalData = {
      total_market_cap: { usd: 2_450_000_000_000 },
      total_volume: { usd: 125_000_000_000 },
      market_cap_change_percentage_24h_usd: 2.34,
      active_cryptocurrencies: 13450,
      markets: 742
    };

    const mockCoins: CoinMarket[] = [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image: '',
        current_price: 67250,
        market_cap: 1_320_000_000_000,
        total_volume: 38_000_000_000,
        price_change_percentage_24h: 2.8
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        image: '',
        current_price: 3520,
        market_cap: 420_000_000_000,
        total_volume: 18_000_000_000,
        price_change_percentage_24h: 1.9
      },
      {
        id: 'solana',
        symbol: 'sol',
        name: 'Solana',
        image: '',
        current_price: 145,
        market_cap: 62_000_000_000,
        total_volume: 3_200_000_000,
        price_change_percentage_24h: 4.5
      },
      {
        id: 'bnb',
        symbol: 'bnb',
        name: 'BNB',
        image: '',
        current_price: 590,
        market_cap: 90_000_000_000,
        total_volume: 1_800_000_000,
        price_change_percentage_24h: -0.8
      },
      {
        id: 'xrp',
        symbol: 'xrp',
        name: 'XRP',
        image: '',
        current_price: 0.62,
        market_cap: 34_000_000_000,
        total_volume: 1_200_000_000,
        price_change_percentage_24h: 3.1
      }
    ];

    this.global.set(mockGlobal);
    this.coins.set(mockCoins);

    this.isLoading.set(false);
  }

  volumeToCapRatio(): number {
    const g = this.global();
    if (!g || !g.total_market_cap?.usd || !g.total_volume?.usd) {
      return 0;
    }
    return (g.total_volume.usd / g.total_market_cap.usd) * 100;
  }

  greedScore(): number {
    const change = this.global()?.market_cap_change_percentage_24h_usd ?? 0;
    const clamped = Math.max(-10, Math.min(10, change));
    return ((clamped + 10) / 20) * 100;
  }

  greedLabel(): string {
    const score = this.greedScore();
    if (score < 25) return 'Extreme Fear';
    if (score < 45) return 'Fear';
    if (score < 55) return 'Neutral';
    if (score < 75) return 'Greed';
    return 'Extreme Greed';
  }

  avgChange(list: CoinMarket[]): number {
    if (!list.length) return 0;
    const sum = list.reduce(
      (acc, c) => acc + (c.price_change_percentage_24h || 0),
      0
    );
    return sum / list.length;
  }

  sumVolume(list: CoinMarket[]): number {
    return list.reduce((acc, c) => acc + (c.total_volume || 0), 0);
  }
}

