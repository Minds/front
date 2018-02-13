import { Component, EventEmitter, ElementRef, Inject } from '@angular/core';

import { Material as MaterialService } from '../../../services/ui';
import { ScrollService } from '../../../services/ux/scroll';

@Component({
  selector: 'infinite-scroll',
  inputs: ['distance', 'on', 'inProgress', 'moreData', 'hideManual'],
  outputs: ['loadHandler: load'],
  template: `
    <div class="mdl-spinner mdl-js-spinner is-active" [mdl] [hidden]="!inProgress"></div>
    <div class="m-infinite-scroll-manual mdl-color--blue-grey-200 mdl-color-text--blue-grey-500"
      [hidden]="inProgress || !moreData"
      (click)="manualLoad()"
      *ngIf="!hideManual">
      <ng-container i18n="@@COMMON__INFINITE_SCROLL__LOAD_MORE">Click to load more</ng-container>
    </div>
    <div class="m-infinite-scroll-manual mdl-color--blue-grey-200 mdl-color-text--blue-grey-500"
      [hidden]="moreData"
      *ngIf="!hideManual">
      <ng-container i18n="@@COMMON__INFINITE_SCROLL__NOTHING_MORE">Nothing more to load</ng-container>
    </div>
  `
})


export class InfiniteScroll {

  element: any;
  loadHandler: EventEmitter<any> = new EventEmitter(true);
  distance: any;
  inProgress: boolean = false;
  moreData: boolean = true;
  hideManual: boolean = false;
  _content: any;
  _listener;
  on: any;

  constructor(_element: ElementRef, public scroll: ScrollService) {
    this.element = _element.nativeElement;
    this.init();
  }

  init() {
    this._listener = this.scroll.listen((e) => {
      if (
        this.element.offsetTop
        - this.element.clientHeight
        - this.scroll.view.clientHeight
        <= this.scroll.view.scrollTop && this.moreData
      ) {
        this.loadHandler.next(true);
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
