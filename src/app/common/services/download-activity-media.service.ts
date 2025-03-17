import { Injectable } from '@angular/core';
import { Client } from '../../services/api';
import { ConfigsService } from './configs.service';
import { ToasterService } from './toaster.service';
import { blobDownload } from '../../utils/blob-download';

@Injectable()
export class DownloadActivityMediaService {
  entity: any;

  readonly siteUrl: string;

  constructor(
    public client: Client,
    protected toasterService: ToasterService,
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
     * Only download images
     * TODO: enable videos
     */
    if (this.entity.content_type === 'video') {
      this.toasterService.inform('Downloading video, please wait...');
      src = `${this.siteUrl}api/v3/media/video/download/${this.entity.entity_guid}`;
      try {
        const link = document.createElement('a');
        // Browsers that support HTML5 download attribute
        if (link.download !== undefined) {
          link.setAttribute('href', src);
          link.setAttribute('download', entity.guid + '.mp4');
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (err) {
        console.error(err);
        this.toasterService.error('There was an error download the video.');
      }
      return;
    } else if (
      this.entity.content_type === 'image' &&
      this.entity.custom_data &&
      this.entity.custom_data[0]
    ) {
      src = this.entity.custom_data[0].src;
    } else {
      console.error('This activity content type cannot be downloaded');
      return;
    }
    window.open(`${src}?download=true`, '_blank');
  }
}
