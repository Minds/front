import { Component } from '@angular/core';
import { BlogsEditService } from '../blog-edit.service';
import { SiteService } from '../../../../common/services/site.service';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-blogEditor__metadata',
  template: `
    <div class="m-blogMeta__container">
      <div class="m-blogMeta__field">
        <div class="m-blogMeta__labelContainer">
          <label i18n="@@BLOGS__EDIT__URL_SLUG" class="m-blogMeta__label"
            >URL Slug</label
          >
          <span>
            <em
              >{{ site.baseUrl
              }}{{ session.getLoggedInUser().username }}/blog/<strong>{{
                editService.urlSlug$ | async
              }}</strong
              >-xxxx
            </em>
          </span>
        </div>
        <input
          class="m-blogMeta__input"
          type="text"
          [ngModel]="editService.urlSlug$ | async"
          (ngModelChange)="editService.urlSlug$.next($event)"
        />
      </div>

      <div class="m-blogMeta__field">
        <div class="m-blogMeta__labelContainer">
          <label i18n="@@BLOGS__EDIT__META_TITLE" class="m-blogMeta__label"
            >Meta Title</label
          >
        </div>
        <input
          class="m-blogMeta__input"
          type="text"
          [ngModel]="editService.title$ | async"
          (ngModelChange)="editService.title$.next($event)"
        />
      </div>

      <div class="m-blogMeta__field">
        <div class="m-blogMeta__labelContainer">
          <label i18n="@@BLOGS__EDIT__META_AUTHOR" class="m-blogMeta__label"
            >Meta Author</label
          >
        </div>
        <input
          class="m-blogMeta__input"
          type="text"
          [ngModel]="editService.author$ | async"
          (ngModelChange)="editService.author$.next($event)"
        />
      </div>

      <div class="m-blogMeta__field">
        <div class="m-blogMeta__labelContainer">
          <label
            i18n="@@BLOGS__EDIT__META_DESCRIPTION"
            class="m-blogMeta__label"
            >Meta Description</label
          >
        </div>
        <textarea
          class="m-blogMeta__textArea"
          [ngModel]="editService.metaDescription$ | async"
          (ngModelChange)="editService.metaDescription$.next($event)"
        ></textarea>
      </div>
    </div>
  `,
})
export class BlogEditorMetaComponent {
  constructor(
    public editService: BlogsEditService,
    public site: SiteService,
    public session: Session
  ) {}
}
