import { Component, Input } from '@angular/core';
import { Session } from '../../../services/session';
import { AttachmentService } from '../../../services/attachment';

@Component({
  selector: 'm-blog--tile',
  templateUrl: 'tile.component.html',
})

export class BlogTileComponent {

  entity;
  minds = window.Minds;

  constructor(
    public session: Session,
    public attachment: AttachmentService
  ) {}

  @Input('entity') set setEntity(entity : any) {
    if (!entity.thumbnail_src || !entity.header_bg)
      entity.thumbnail_src = this.minds.cdn_assets_url + 'assets/logos/placeholder-bulb.jpg';
    this.entity = entity;
  }
}
