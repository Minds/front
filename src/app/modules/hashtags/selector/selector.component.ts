import { Component, EventEmitter, Output } from '@angular/core';

export type Tag = { value: string, index?: number, length?: number };

@Component({
  selector: 'm-hashtags-selector',
  templateUrl: 'selector.component.html',
})
export class HashtagsSelectorComponent {
  tags: Tag[] = [];

  tagsValues: string[] = [];

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
        length: match.length
      });
    }

    this.tags = tags;

    this.extractValues();
  }

  get enabled() {
    return this.tags.length > 0;
  }

  setTags(tags: string[]) {
    const removed: Tag[] = [];
    const added: Tag[] = [];

    // get removed elements
    let difference = this.tags.filter((item) => tags.indexOf(item.value) === -1);

    for (let tag of difference) {
      removed.push(tag);
      this.tags.splice(this.tags.indexOf(tag), 1);
    }

    if (removed.length > 0) {
      removed.sort((a: Tag, b: Tag) => a.index - b.index);
      this.tagsRemoved.emit(removed);
    }

    // get added elements
    let difference2 = tags.filter((item) => this.tags.findIndex((i) => i.value === item) === -1);

    for (let tag of difference2) {
      this.tags.push({value: tag});
      added.push({ value: tag });
    }

    if (added.length > 0) {
      this.tagsAdded.emit(added);
    }

    this.extractValues();

    this.tagsChange.emit(this.tagsValues);
  }

  private extractValues() {
    this.tagsValues = this.tags.map((item) => item.value);
  }
}
