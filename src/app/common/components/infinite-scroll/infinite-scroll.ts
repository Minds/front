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
  @Input() distance: any;
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

          if (
            this.element.offsetTop - this.element.clientHeight - clientHeight <=
            scrollTop
          ) {
            this.loadHandler.next(true);
          }
        }
      }).bind(this),
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
