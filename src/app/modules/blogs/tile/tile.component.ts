import { Component, Input } from '@angular/core';
import { Session } from '../../../services/session';
import { AttachmentService } from '../../../services/attachment';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-blog--tile',
  templateUrl: 'tile.component.html',
})
export class BlogTileComponent {
  entity;

  constructor(
    public session: Session,
    public attachment: AttachmentService,
    private configs: ConfigsService
  ) {}

  @Input('entity') set setEntity(entity: any) {
    if (!entity.thumbnail_src || !entity.header_bg)
      entity.thumbnail_src =
        this.configs.get('cdn_assets_url') +
        'assets/logos/placeholder-bulb.jpg';
    this.entity = entity;
  }
}
