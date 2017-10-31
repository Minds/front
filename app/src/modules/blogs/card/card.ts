import { Component } from '@angular/core';
import { SessionFactory } from '../../../services/session';
import { AttachmentService } from '../../../services/attachment';
import { ACCESS } from '../../../services/list-options';


@Component({
  moduleId: module.id,
  selector: 'minds-card-blog',

  inputs: ['_blog : object'],
  templateUrl: 'card.html'
})

export class BlogCard {

  minds;
  blog;
  session = SessionFactory.build();
  access = ACCESS;

  constructor(public attachment: AttachmentService) {
    this.minds = window.Minds;
  }

  set _blog(value: any) {
    if (!value.thumbnail_src || !value.header_bg)
      value.thumbnail_src = 'assets/videos/earth-1/earth-1.png';
    this.blog = value;
  }

}
