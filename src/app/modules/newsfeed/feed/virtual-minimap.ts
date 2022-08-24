import { Component, HostListener, Input } from '@angular/core';
import { IFeedItem, FeedItemType } from './feed.component';

@Component({
  selector: 'm-virtualMinimap',
  template: `
    <div style="position: fixed; left: 0; top: 0; z-index: 99999">
      <div
        [ngStyle]="{
          height: '3.12px',
          width: '12.4px',
          backgroundColor: 'white'
        }"
      ></div>
      <ng-container
        *ngFor="
          let item of scroll?.wrapGroupDimensions?.maxChildSizePerWrapGroup
        "
      >
        <div
          *ngIf="item"
          style="width: 12.4px; margin-bottom: 1px;"
          [ngStyle]="{
            height: item.childHeight / 50,
            backgroundColor: getBackgroundColor(
              item.items[0],
              scroll.viewPortItems
            )
          }"
        ></div>
      </ng-container>

      <div
        style="position: absolute; left: 0; width: 12.4px; height: calc(100vh / 50); background-color: rgba(0, 0, 0, 0.4)"
        [ngStyle]="{
          top: windowScrollOffset / 50
        }"
      ></div>
    </div>
  `,
})
export class VirtualMinimapComponent {
  getBackgroundColor(feedItem: IFeedItem, viewportItems: IFeedItem[]) {
    const isActive = viewportItems.includes(feedItem);
    switch (feedItem?.type) {
      case FeedItemType.activity:
        return '#4caf50' + (isActive ? '' : '99');
      case FeedItemType.channelRecommendations:
        return '#e91e63' + (isActive ? '' : '99');
      case FeedItemType.featuredContent:
        return '#2196f3' + (isActive ? '' : '99');
      case FeedItemType.feedNotice:
        return '#ffeb3b' + (isActive ? '' : '99');
      case FeedItemType.topHighlights:
        return '#673ab7' + (isActive ? '' : '99');
      default:
        return 'grey';
    }
  }

  @Input()
  scroll: any;

  windowScrollOffset = 0;

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll() {
    this.windowScrollOffset = window.pageYOffset;
  }
}
