import { Injectable } from '@angular/core';
import { ConfigsService } from './configs.service';

@Injectable()
export class MediaProxyService {
  readonly cdnUrl: string;
  constructor(configs: ConfigsService) {
    this.cdnUrl = configs.get('cdn_url');
  }

  proxy(url, size = 1920) {
    if (!url || typeof url !== 'string') {
      return url;
    }

    const encodedUrl = encodeURIComponent(url);

    return `${this.cdnUrl}api/v2/media/proxy?size=${size}&src=${encodedUrl}`;
  }
}
