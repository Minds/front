import { Component, ElementRef, EventEmitter, Input, OnInit } from '@angular/core';
import { Session } from '../../../services/session';
import { Client } from '../../../services/api/client';
import { Tag } from '../types/tag';
import { TopbarHashtagsService } from '../service/topbar.service';

@Component({
  selector: 'm-form-tags-input',
  host: {
    '(click)': 'focus()'
  },
  outputs: ['change: tagsChange'],
  template: `
    <div class="m-form-tags-input-tags-tag"
      *ngFor="let tag of tags; let i = index"
      (click)="toggleTag(tag)">
      <span>#{{tag.value}}</span>
      <div class="m-layout--spacer"></div>
      <i class="material-icons selected m-form-tags-input-tags--check" [class.selected]="tag.selected">check</i>
    </div>

    <div class="m-form-tags-input-tags-tag">
      <span>#</span>
      <input
        type="text"
        name="input-tags"
        [(ngModel)]="input"
        (keydown)="keyUp($event)"
        (blur)="blur($event)"
        placeholder="Enter a hashtag..."
      >
    </div>
  `
})

export class TagsInput implements OnInit {

  error: string = '';
  inProgress: boolean = false;

  input: string = '';
  placeholder: string = '+';
  tags: Array<Tag> = [];
  suggestedTags: Array<Tag> = [];
  change: EventEmitter<any> = new EventEmitter();

  constructor(
    public client: Client,
    public session: Session,
    private element: ElementRef,
    private service: TopbarHashtagsService,
  ) {
  }

  async ngOnInit() {
    await this.getTopHashtags();
  }

  @Input('tags') set _tags(tags: Array<Tag>) {
    this.tags = this.suggestedTags.slice(0); // Reset
    if (Array.isArray(tags)) {
      this.merge(tags);
    }
  }

  merge(tags) {
    for (let tag of tags) {
      let i = this.tags.findIndex((item) => item.value === tag.value);
      if (i > -1) {
        tag.selected = true;
        this.tags[i] = tag;
      } else {
        this.tags.push(tag);
      }
    }
  }

  keyUp(e) {

    switch (e.keyCode) {
      case 32: //space
      case 9: //tab
      case 13: //enter
      case 188: //comma
        this.push();
        break;
      case 8: //backspace
        //remove the last tag if we don't have an input
        if (!this.input) {
          this.pop();
        }
        break;
    }

    if (e.keyCode === 13) {
      e.preventDefault();
    }

    this.emitChanges();
  }

  emitChanges() {
    this.change.next(this.tags.filter(item => item.selected));
  }

  blur(e) {
    this.push();
  }

  /**
   * Only called by clicking on topTags
   */
  toggleTag(tag: Tag) {
    let i = this.tags.findIndex(item => item.value === tag.value);

    if (i > -1) {
      this.tags[i].selected = !tag.selected;
    } else {
      tag.selected = true;
      this.tags.push(tag);
    }

    this.emitChanges();
  }

  removeTag(index: number) {
    //    this.tags.splice(index, 1);
    //  this.emitChanges();
  }

  focus() {
    const input = this.element.nativeElement.querySelector('input[name=input-tags]');
    if (input)
      input.focus();
  }

  push() {
    let input = this.input;

    // sanitize tag
    input = this.service.cleanupHashtag(input)

    if (!input) {
      return;
    }

    this.tags.push({ value: input, selected: true });
    this.input = '';
  }

  pop() {
    this.tags.pop();
  }

  async getTopHashtags() {
    try {
      let tags = [];
      const response: any = await this.client.get('api/v2/hashtags/suggested/user');

      for (let tag of response.tags) {
        tags.push({ value: tag.value, selected: false });
      }
      this.suggestedTags = tags;
      this.merge(tags);
    } catch (e) {
      console.error(e);
    }
  }

}
