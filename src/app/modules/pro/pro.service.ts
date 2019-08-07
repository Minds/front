import { Injectable } from '@angular/core';
import { Client } from '../../services/api/client';

@Injectable()
export class ProService {
  constructor(
    protected client: Client,
  ) { }

  async isActive(): Promise<boolean> {
    const result: any = await this.client.get('api/v2/pro');

    if (!result || typeof result.isActive === 'undefined') {
      throw new Error('Unable to check your Pro status');
    }

    return Boolean(result.isActive);
  }

  async enable(): Promise<boolean> {
    // TODO: Payments
    await this.client.post('api/v2/pro');
    return true;
  }

  async disable(): Promise<boolean> {
    await this.client.delete('api/v2/pro');
    return true;
  }

  async get(): Promise<{ isActive, settings }> {
    const { isActive, settings } = await this.client.get('api/v2/pro/settings', {}, {cache: false}) as any;

    if (settings) {
      if (settings.tag_list) {
        settings.tag_list = settings.tag_list.map(({ tag, label }) => {
          const formattedTag = `#${tag}`;

          return { tag: formattedTag, label };
        });
      }

      if (!settings.scheme) {
        settings.scheme = 'light';
      }
    }

    return { isActive, settings };
  }

  async set(settings): Promise<boolean> {
    await this.client.post('api/v2/pro/settings', settings);
    return true;
  }
}
