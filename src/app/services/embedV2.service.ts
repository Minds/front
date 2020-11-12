import { Injectable } from '@angular/core';
import { ConfigsService } from '../common/services/configs.service';

@Injectable()
export class EmbedServiceV2 {
  readonly siteUrl: string;

  constructor(configs: ConfigsService) {
    this.siteUrl = configs.get('site_url');
  }

  getIframeFromObject(object: any): string {
    if (typeof object !== 'object') {
      return '';
    }

    let embeddable = ['object:video'];

    if (embeddable.indexOf(`${object.type}:${object.subtype}`) > -1) {
      return this.getIframe(object.guid);
    }

    if (object.custom_type === 'video') {
      return this.getIframe(object.custom_data.guid);
    }

    return '';
  }

  getIframe(guid: string, opts: any = {}): string {
    if (!guid) {
      return '';
    }

    let width = opts.width || 640,
      height = opts.height || 320;

    return `<iframe src="${this.getUrl(
      guid
    )}" width="${width}" height="${height}" frameborder="0" allowfullscreen="1"></iframe>`;
  }

  getUrl(guid: string): string {
    return `${this.siteUrl}embed/${guid}`;
  }
}
