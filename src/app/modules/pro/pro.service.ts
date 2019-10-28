import { Injectable } from '@angular/core';
import { Client } from '../../services/api/client';

@Injectable()
export class ProService {
  public readonly ratios = ['16:9', '16:10', '4:3', '1:1'];

  constructor(protected client: Client) {}

  async isActive(): Promise<boolean> {
    const result: any = await this.client.get('api/v2/pro');

    if (!result || typeof result.isActive === 'undefined') {
      throw new Error('Unable to check your Pro status');
    }

    return Boolean(result.isActive);
  }

  async disable(): Promise<boolean> {
    await this.client.delete('api/v2/pro');
    return true;
  }

  async get(remoteUser: string | null = null): Promise<{ isActive; settings }> {
    const endpoint = ['api/v2/pro/settings'];

    if (remoteUser) {
      endpoint.push(remoteUser);
    }

    const { isActive, settings } = (await this.client.get(
      endpoint.join('/'),
      {},
      { cache: false }
    )) as any;

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

      if (!settings.ratio) {
        settings.ratio = this.ratios[0];
      }
    }

    return { isActive, settings };
  }

  async set(settings, remoteUser: string | null = null): Promise<boolean> {
    const endpoint = ['api/v2/pro/settings'];

    if (remoteUser) {
      endpoint.push(remoteUser);
    }

    await this.client.post(endpoint.join('/'), settings);
    return true;
  }
}
