import { Client } from '../api/client.service';
import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ConfigsService {
  private configs = {};
  public isReady$ = new Subject();

  constructor(
    private client: Client,
    @Inject('QUERY_STRING') private queryString: string
  ) {}

  async loadFromRemote() {
    try {
      this.configs = await this.client.get(
        `api/v1/minds/config${this.queryString}`
      );
      this.isReady$.next(true);
    } catch (err) {
      console.error(err);
    }
  }

  get(key) {
    return this.configs[key] || null;
  }

  set(key, value): void {
    this.configs[key] = value;
  }
}
