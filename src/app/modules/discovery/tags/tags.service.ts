import { Injectable } from '@angular/core';
import { Client } from '../../../services/api';
import { BehaviorSubject } from 'rxjs';

export type DiscoveryTag = any;

@Injectable()
export class DiscoveryTagsService {
  tags$: BehaviorSubject<DiscoveryTag[]> = new BehaviorSubject([]);
  trending$: BehaviorSubject<DiscoveryTag[]> = new BehaviorSubject([]);
  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private client: Client) {}

  async loadTags(refresh = false) {
    this.inProgress$.next(true);
    if (refresh) {
      this.tags$.next([]);
      this.trending$.next(null);
    }
    const response: any = await this.client.get('api/v3/discovery/tags');
    this.inProgress$.next(false);
    this.tags$.next(response.tags);
    this.trending$.next(response.trending);
  }
}
