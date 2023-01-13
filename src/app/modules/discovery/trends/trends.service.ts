import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Client } from '../../../services/api';
import { BehaviorSubject } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { DiscoveryService } from '../discovery.service';

export type DiscoveryTrend = any;

@Injectable()
export class DiscoveryTrendsService {
  isPlusPage$ = this.discoveryService.isPlusPage$;
  trends$: BehaviorSubject<DiscoveryTrend[]> = new BehaviorSubject([]);
  hero$: BehaviorSubject<DiscoveryTrend> = new BehaviorSubject(null);
  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private client: Client,
    @Inject(PLATFORM_ID) private platformId: Object,
    private discoveryService: DiscoveryService
  ) {}

  async loadTrends(): Promise<void> {
    this.inProgress$.next(true);

    if (isPlatformServer(this.platformId)) return;

    this.trends$.next([]);
    this.hero$.next(null);
    this.error$.next('');
    try {
      const response: any = await this.client.get('api/v3/discovery/trends', {
        plus: this.discoveryService.isPlusPage$.value,
      });
      this.trends$.next(response.trends);
      this.hero$.next(response.hero);
    } catch (err) {
      this.error$.next(err.error.errorId);
    } finally {
      this.inProgress$.next(false);
    }
  }
}
