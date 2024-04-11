import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiscoveryTag } from '../../../modules/discovery/tags/tags.service';

@Component({
  selector: 'm-tagSelector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.ng.scss'],
})
export class TagSelectorComponent {
  public _tags: Array<DiscoveryTag>;
  @Input() set tags(value: Array<DiscoveryTag>) {
    this._tags = value;
  }

  @Output('onAdd') onAddEmitter: EventEmitter<DiscoveryTag> =
    new EventEmitter<DiscoveryTag>();

  @Output('onRemove') onRemoveEmitter: EventEmitter<DiscoveryTag> =
    new EventEmitter<DiscoveryTag>();

  async addTag(tag): Promise<void> {
    tag.selected = true;
    this._tags[this.getIndex(tag)] = tag;
    this.onAddEmitter.emit(tag);
  }

  async removeTag(tag): Promise<void> {
    tag.selected = false;
    this._tags[this.getIndex(tag)] = tag;
    this.onRemoveEmitter.emit(tag);
  }

  getIcon(tag: DiscoveryTag): string {
    if (!tag.selected) {
      return 'add';
    } else {
      return 'check';
    }
  }

  getIndex(tag: DiscoveryTag): number {
    return this._tags.findIndex((i) => i.value === tag.value);
  }
}
