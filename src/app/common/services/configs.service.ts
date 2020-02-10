import { Client } from '../api/client.service';
import { Injectable, Inject, Optional } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class ConfigsService {
  private configs = {};

  constructor(
    private client: Client,
    @Inject('QUERY_STRING') private queryString: string
  ) {}

  async loadFromRemote() {
    try {
      this.configs = await this.client.get(
        `api/v1/minds/config${this.queryString}`
      );
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
