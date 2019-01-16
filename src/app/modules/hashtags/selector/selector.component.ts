import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from '../types/tag';

@Component({
  selector: 'm-hashtags-selector',
  templateUrl: 'selector.component.html',
})
export class HashtagsSelectorComponent {
  @Input() alignLeft: boolean = false;
  tags: Tag[] = [];

  tagsValues: Tag[] = [];

  @Output('tagsChange') tagsChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output('tagsAdded') tagsAdded: EventEmitter<Tag[]> = new EventEmitter<Tag[]>();
  @Output('tagsRemoved') tagsRemoved: EventEmitter<Tag[]> = new EventEmitter<Tag[]>();

  parseTags(message) {
    const regex = /(^|\s||)#(\w+)/gim;
    let tags = [];

    let match;

    while ((match = regex.exec(message)) !== null) {
      tags.push({
        value: match[2],
        index: match.index,
        length: match.length,
        checked: true,
      });
    }

    this.tags = tags;

    this.extractValues();
  }

  get enabled() {
    return this.tags.length > 0;
  }

  // Set the tags from the upstream
  @Input('tags') set _tags(tags) {
    let different = false;
    if (tags.length !== this.tags.length) {
      different = true;
    } else {
      for (let i = 0; i < tags.length; ++i) {
        if (this.tags[i].value !== tags[i]) {
          different = true;
          break;
        }
      }
    }
    if (!different)
      return;

    this.tags = tags.map(tag => {
      return { value: tag, selected: true };
    });
    this.tagsValues = this.tags.slice(0);
  }

  setTags(tags: Tag[]) {
    const removed: Tag[] = [];
    const added: Tag[] = [];

    // get removed elements
    let difference = this.tags.filter((item) => tags.findIndex((i) => i.value === item.value) === -1);

    for (let tag of difference) {
      removed.push(tag);
      this.tags.splice(this.tags.indexOf(tag), 1);
    }

    if (removed.length > 0) {
      removed.sort((a: Tag, b: Tag) => a.index - b.index);
      this.tagsRemoved.emit(removed);
    }

    // get added elements
    let difference2 = tags.filter((item) => this.tags.findIndex((i) => i.value === item.value) === -1);

    for (let tag of difference2) {
      this.tags.push(tag);
      added.push(tag);
    }

    if (added.length > 0) {
      this.tagsAdded.emit(added);
    }

    this.extractValues();

    this.tagsChange.emit(this.tags.map((item) => item.value));
  }

  private extractValues() {
    this.tagsValues = this.tags.slice(0);
    // this.tagsValues = this.tags.map((item) => item.value);
  }
}
