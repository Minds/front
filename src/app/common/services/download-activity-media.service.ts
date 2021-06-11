import { Injectable } from '@angular/core';
import { Client } from '../../services/api';
import { ConfigsService } from './configs.service';
import { FormToastService } from './form-toast.service';

@Injectable()
export class DownloadActivityMediaService {
  entity: any;

  readonly siteUrl: string;

  constructor(
    public client: Client,
    protected toasterService: FormToastService,
    configs: ConfigsService
  ) {
    this.siteUrl = configs.get('site_url');
  }

  async download(entity: any) {
    if (!entity) {
      console.error('Entity required for download');
      return;
    }

    this.entity =
      entity.activity_type === 'quote' ? entity.remind_object : entity;

    let src;

    /**
     * Only download images and videos
     */
    if (this.entity.content_type === 'video') {
      try {
        const response: any = await this.client.get(
          `api/v3/media/video/download-url/${this.entity.guid}`
        );
        src = response.url;
        window.open(src, '_blank');
      } catch (e) {
        console.error(e);
      }
    } else if (
      this.entity.content_type === 'image' &&
      this.entity.custom_data &&
      this.entity.custom_data[0]
    ) {
      src = this.entity.custom_data[0].src;
      window.open(`${src}?download=true`, '_blank');
    } else {
      console.error('This activity content type cannot be downloaded');
      return;
    }
  }
}
