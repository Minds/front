import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ProChannelService } from '../channel.service';
import { Router } from '@angular/router';
import { MindsUser, Tag } from '../../../../interfaces/entities';

@Component({
  selector: 'm-pro--channel--categories',
  templateUrl: 'categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProCategoriesComponent {
  @Input() set selectedHashtag(value: string) {
    this.selectTag(value, false);
  }

  @Input() showAllTag: boolean = true;

  @Output() onSelectTag: EventEmitter<string | null> = new EventEmitter<
    string | null
  >();

  get channel(): MindsUser {
    return this.channelService.currentChannel;
  }

  constructor(
    protected channelService: ProChannelService,
    protected router: Router,
    protected cd: ChangeDetectorRef
  ) {}

  selectTag(clickedTag: Tag | string, triggerEvent: boolean = true) {
    if (typeof clickedTag !== 'string') {
      clickedTag = clickedTag.tag;
    }
    for (let tag of this.channel.pro_settings.tag_list) {
      tag.selected = tag.tag == clickedTag;
    }

    this.detectChanges();

    if (triggerEvent) {
      this.onSelectTag.emit(clickedTag !== 'all' ? clickedTag : null);
    }
  }

  get tags() {
    const tags = this.channel.pro_settings.tag_list.concat([]);

    if (this.showAllTag) {
      tags.unshift({ label: 'All', tag: 'all', selected: false });
    }

    return tags;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
