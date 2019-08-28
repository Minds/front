import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AttachmentService } from '../../../services/attachment';

@Component({
  selector: 'm-newsfeed__tiles',
  templateUrl: 'tiles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsfeedTilesComponent {
  @Input() entities: any[] = [];

  constructor(public attachment: AttachmentService) {}

  getThumbnailSrc(entity: any) {
    let src: string = '';

    if (entity && entity.thumbnail_src) {
      src = entity.thumbnail_src;
    } else if (
      entity &&
      entity.custom_data &&
      entity.custom_data[0] &&
      entity.custom_data[0].src
    ) {
      src = entity.custom_data[0].src;
    } else if (
      entity &&
      entity.custom_data &&
      entity.custom_data.thumbnail_src
    ) {
      src = entity.custom_data.thumbnail_src;
    }

    return src || '';
  }

  isUnlisted(entity: any) {
    return entity && (entity.access_id === '0' || entity.access_id === 0);
  }
}
