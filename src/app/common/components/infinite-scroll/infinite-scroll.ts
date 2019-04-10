import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { ScrollService } from '../../../services/ux/scroll';

export type ScrollOrientation = 'vertical' | 'horizontal';

@Component({
  selector: 'infinite-scroll',
  template: `
    <div class="mdl-spinner mdl-js-spinner is-active" [mdl] [hidden]="!inProgress"></div>
    <div class="m-infinite-scroll-manual mdl-color--blue-grey-200 mdl-color-text--blue-grey-500"
         [hidden]="inProgress || !moreData"
         (click)="manualLoad()"
         *ngIf="!hideManual">
       <ng-container i18n="@@COMMON__INFINITE_SCROLL__LOAD_MORE" *ngIf="!iconOnly">Click to load more</ng-container>

       <i class="material-icons" *ngIf="iconOnly && orientation == 'vertical'">keyboard_arrow_down</i>
       <i class="material-icons" *ngIf="iconOnly && orientation == 'horizontal'">keyboard_arrow_right</i>
    </div>
    <div class="m-infinite-scroll-manual mdl-color--blue-grey-200 mdl-color-text--blue-grey-500"
         [hidden]="moreData"
         *ngIf="!hideManual">
      <ng-container i18n="@@COMMON__INFINITE_SCROLL__NOTHING_MORE">Nothing more to load</ng-container>
    </div>
  `
})


export class InfiniteScroll {
  @Input() on: any;
  @Input() scrollSource: any; // if not provided, it defaults to window
  @Input() orientation: ScrollOrientation = 'vertical';
  @Input() iconOnly: boolean = false;

  @Output('load') loadHandler: EventEmitter<any> = new EventEmitter(true);
  @Input() distance: any;
  @Input() inProgress: boolean = false;
  @Input() moreData: boolean = true;
  @Input() hideManual: boolean = false;

  element: any;

  _content: any;
  _listener;

  private scroll: ScrollService;

  constructor(_element: ElementRef) {
    this.element = _element.nativeElement;
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.scroll = new ScrollService();
    if (this.scrollSource) {
      this.scroll.setScrollSource(this.scrollSource);
    }
    this._listener = this.scroll.listen((e) => {
      if (this.moreData) {
        switch (this.orientation) {
          case 'vertical':
            if (
              this.element.offsetTop
              - this.element.clientHeight
              - this.scroll.view.clientHeight
              <= this.scroll.view.scrollTop
            ) {
              this.loadHandler.next(true);
            }
            break;
          case 'horizontal':
            if (
              this.element.offsetLeft
              - this.element.clientWidth
              - this.scroll.view.clientWidth
              <= this.scroll.view.scrollLeft
            ) {
              this.loadHandler.next(true);
            }
            break;
        }
      }
    }, 100);
  }

  manualLoad() {
    this.loadHandler.next(true);
  }

  ngOnDestroy() {
    if (this._listener)
      this.scroll.unListen(this._listener);
  }

}
