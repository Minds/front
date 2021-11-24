import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '../../../../services/storage';

const TOP_FEED_PROMPT_STORAGE_KEY = 'top-feed:recommended';
const TOP_FEED_PROMPT_DURATION = 3000;

@Component({
  selector: 'm-feedTypePopover',
  templateUrl: './feed-type-popover.component.html',
  styleUrls: ['./feed-type-popover.component.ng.scss'],
})
export class FeedTypePopoverComponent implements OnInit {
  @Input() type: 'top' | 'latest' = 'latest';
  shown: boolean = false;
  shouldShowTooltip$ = new BehaviorSubject<boolean>(true);

  // Here we are using offset modifier, but more options
  // are available at https://popper.js.org/docs/v2
  popperModifiers: any = {
    name: 'offset',
    options: {
      offset: [10, 10],
    },
  };

  constructor(private storage: Storage) {}

  ngOnInit(): void {
    const topFeedRecommended = this.storage.get(TOP_FEED_PROMPT_STORAGE_KEY);

    if (!topFeedRecommended) {
      this.recommendTopFeed();
    }
  }

  /**
   * recommends top feed by showing a tooltip
   **/
  private recommendTopFeed() {
    this.shouldShowTooltip$.next(true);
    this.storage.set(TOP_FEED_PROMPT_STORAGE_KEY, true);

    setTimeout(
      () => this.shouldShowTooltip$.next(false),
      TOP_FEED_PROMPT_DURATION
    );
  }

  /**
   * change feed type
   **/
  @Output() changeType = new EventEmitter<'top' | 'latest'>();

  onChangeType(type: 'top' | 'latest'): void {
    this.changeType.emit(type);
  }
}
