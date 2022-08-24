import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ResizedEvent } from '../../../common/directives/resized.directive';
import { StorageV2 } from '../../../services/storage/v2';
import { IFeedItem } from '../feed/feed.component';

// a wrapper component used by virtualized list to hold all components of the feed in one
@Component({
  selector: 'm-feedItem',
  template: `
    <div
      style="min-height: 1px; overflow: hidden"
      [style.aspect-ratio]="ratio$ | async"
      [attr.feed-item-id]="feedItem.id"
      (mResized)="resizeDebouncer$.next($event)"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class NewsfeedFeedItemComponent implements OnInit, OnDestroy {
  @Input()
  feedItem: IFeedItem;
  height$ = new BehaviorSubject<number | undefined>(undefined);
  ratio$ = new BehaviorSubject<number | undefined>(undefined);
  resizeDebouncerSubscription: Subscription;
  resizeDebouncer$: BehaviorSubject<ResizedEvent> = new BehaviorSubject(
    undefined
  );

  constructor(protected storage: StorageV2) {
    this.resizeDebouncerSubscription = this.resizeDebouncer$
      /** debounce this event to allow rendering to finish */
      .pipe(debounceTime(1500))
      .subscribe(event => {
        if (!event) return;

        this.storage.memory.setFeedItemRatio(
          this.feedItem.id,
          event.newRect.width / event.newRect.height
        );
      });
  }

  ngOnInit(): void {
    const ratio = this.storage.memory.getFeedItemRatio(this.feedItem.id);

    if (typeof ratio === 'number') {
      this.ratio$.next(ratio);
    }
  }

  ngOnDestroy(): void {
    this.resizeDebouncerSubscription?.unsubscribe();
  }
}
