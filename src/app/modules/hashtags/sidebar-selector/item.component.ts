import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { TopbarHashtagsService } from '../service/topbar.service';
import { Tag } from '../types/tag';
import { findLastIndex } from '../../../utils/array-utils';

export type SideBarSelectorChange = { type: string; value?: any };

@Component({
  selector: 'm-hashtagsSidebarSelector__item',
  templateUrl: 'item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarSelectorItemComponent {
  @Input() disabled: boolean;
  @Input() preferred: boolean = true;
  @Input() currentHashtag: string;
  @Input() hashtag;
  @Output('hashtagVisibilityChange')
  hashtagVisibilityChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output('toggleHashtag') toggleHashtagEmitter: EventEmitter<
    any
  > = new EventEmitter<any>();

  constructor(
    protected topbarHashtagsService: TopbarHashtagsService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {}

  hashtagVisibilityChange(hashtag) {
    this.hashtagVisibilityChangeEmitter.next(hashtag);
  }

  async toggleHashtag(hashtag) {
    this.toggleHashtagEmitter.next(hashtag);
  }

  detectChanges() {
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }
}
