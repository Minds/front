import { Client } from '../api/client.service';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class ConfigsService {
  private configs = {};

  constructor(
    private client: Client,
    @Inject('REQUEST_URL') @Optional() private requestUrl: string
  ) {}

  async loadFromRemote() {
    const url = isPlatformServer(PLATFORM_ID)
      ? this.requestUrl
      : window.location;

    console.log({ isPlatformServer: isPlatformServer(PLATFORM_ID), url });

    try {
      this.configs = await this.client.get('api/v1/minds/config');
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
