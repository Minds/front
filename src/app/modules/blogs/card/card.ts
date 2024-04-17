import { Component } from '@angular/core';
import { Session } from '../../../services/session';
import { AttachmentService } from '../../../services/attachment';
import { ACCESS } from '../../../services/list-options';
import { ExperimentsService } from '../../experiments/experiments.service';

/**
 * Presents a small preview of a blog
 * Used in boosted blogs in the newsfeed sidebar, for example
 */
@Component({
  selector: 'minds-card-blog',
  inputs: ['_blog : object'],
  templateUrl: 'card.html',
  styleUrls: ['card.ng.scss'],
})
export class BlogCard {
  minds;
  blog;
  access = ACCESS;

  constructor(
    public session: Session,
    public attachment: AttachmentService
  ) {}

  set _blog(value: any) {
    if (!value.thumbnail_src || !value.header_bg)
      value.thumbnail_src = 'assets/videos/earth-1/earth-1.png';
    this.blog = value;
  }
}
