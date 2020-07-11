import { Component, ElementRef, ViewChild } from '@angular/core';
import { BlogsEditService } from '../../blog-edit.service';

@Component({
  selector: 'm-blogEditor__tags',
  template: `
    <div class="m-blogTags__container">
      <div
        class="m-blogTags__selectedContainer"
        data-cy="data-minds-blog-editor-tags-container"
      >
        <span
          *ngFor="let tag of service.tags$ | async"
          (click)="service.removeTag(tag)"
          class="m-blogTags__selectedTag"
        >
          #{{ tag }}
          <i class="material-icons">close</i>
        </span>
      </div>
      <label class="m-blogTags__inputLabel" i18n="noun|@@BLOG_EDITOR_TAGS__TAG"
        >Tag</label
      >
      <input
        #input
        (keydown)="onKeydown($event)"
        class="m-blogTags__input"
        type="text"
        placeholder="#hashtag"
        i18n-placeholder="@@BLOG_EDITOR_TAGS__HASHTAG"
        maxlength="64"
        data-cy="data-minds-blog-editor-tags-input"
      />
    </div>
  `,
})
export class BlogEditorTagsComponent {
  @ViewChild('input') input: ElementRef;

  constructor(public service: BlogsEditService) {}

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.service.pushTag((event.target as HTMLInputElement).value);
      this.input.nativeElement.value = '';
    }
  }
}
