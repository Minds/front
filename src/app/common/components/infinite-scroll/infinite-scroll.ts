import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  GlobalScrollService,
  ScrollSubscription,
} from '../../../services/ux/global-scroll.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'infinite-scroll',
  template: `
    <m-loadingSpinner [inProgress]="inProgress"></m-loadingSpinner>

    <ng-container *ngIf="!iconOnly && !hideManual">
      <m-button
        *ngIf="!inProgress"
        [disabled]="!moreData"
        (onAction)="manualLoad()"
      >
        <ng-container
          i18n="@@COMMON__INFINITE_SCROLL__LOAD_MORE"
          *ngIf="moreData"
          >Load more</ng-container
        >

        <ng-container
          i18n="@@COMMON__INFINITE_SCROLL__NOTHING_MORE"
          *ngIf="!moreData"
          >Nothing more to load</ng-container
        >
      </m-button>
    </ng-container>

    <ng-container *ngIf="iconOnly && moreData && !inProgress">
      <i class="material-icons" *ngIf="iconOnly" (click)="manualLoad()"
        >keyboard_arrow_down</i
      >
    </ng-container>
  `,
  styleUrls: ['./infinite-scroll.ng.scss'],
})
export class InfiniteScroll {
  @Input() on: any;
  @Input() scrollSource: any; // if not provided, it defaults to window
  @Input() iconOnly: boolean = false;

  @Output('load') loadHandler: EventEmitter<any> = new EventEmitter(true);
  /**
   * The distance from the bottom of the scroll within which the loadNext event should fire
   * either a percentage of the total scroll height '25%' or a fixed number
   */
  @Input() distance: string | number = '25%';
  @Input() inProgress: boolean = false;
  @Input() moreData: boolean = true;
  @Input() hideManual: boolean = false;

  element: any;

  _content: any;
  subscription: [ScrollSubscription, Subscription];

  constructor(_element: ElementRef, private scroll: GlobalScrollService) {
    this.element = _element.nativeElement;
  }

  ngOnInit() {
    this.init();
  }

  init() {
    if (!this.scrollSource) {
      this.scrollSource = document;
    }
    this.subscription = this.scroll.listen(
      this.scrollSource,
      ((subscription, e) => {
        if (this.moreData) {
          let clientHeight, scrollTop;
          if (this.scrollSource === document) {
            clientHeight = document.body.clientHeight;
            scrollTop = document.body.scrollTop;
          } else {
            clientHeight = subscription.element.clientHeight;
            scrollTop = subscription.element.scrollTop;
          }

          const endOfScroller = scrollTop + clientHeight;
          const endOfInfiniteScrollComponent =
            this.element.offsetTop + this.element.clientHeight;

          let threshold = clientHeight;
          switch (typeof this.distance) {
            case 'string':
              if (this.distance.includes('%')) {
                let percent = Number(this.distance.replace(/%/g, ''));
                if (!Number.isNaN(percent)) {
                  threshold = (endOfScroller * percent) / 100;
                } else {
                  console.error('[InfiniteScroll] distance invalid');
                }
              }
              break;
            case 'number':
              threshold = this.distance;
              break;
            default:
          }

          if (endOfInfiniteScrollComponent - endOfScroller <= threshold) {
            this.loadHandler.next(true);
          }
        }
      }).bind(this),
      undefined,
      100
    );
  }

  manualLoad() {
    this.loadHandler.next(true);
  }

  ngOnDestroy() {
    if (this.subscription)
      this.scroll.unListen(this.subscription[0], this.subscription[1]);
  }
}
