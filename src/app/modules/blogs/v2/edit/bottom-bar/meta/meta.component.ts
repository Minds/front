/**
 * Meta sub-component panel for v2 blogs in edit mode.
 * Users can edit url slug and meta title/author/description
 */
import { Component } from '@angular/core';
import { BlogsEditService } from '../../blog-edit.service';
import { SiteService } from '../../../../../../common/services/site.service';
import { Session } from '../../../../../../services/session';

@Component({
  selector: 'm-blogEditor__metadata',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.ng.scss'],
})
export class BlogEditorMetaComponent {
  constructor(
    public editService: BlogsEditService,
    public site: SiteService,
    public session: Session
  ) {}
}
