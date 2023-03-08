import {
  Directive,
  ContentChild,
  ElementRef,
  Input,
  HostBinding,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { PageLayoutService } from './page-layout.service';

@Directive({
  selector: '[m-pageLayout__container]',
})
export class PageLayoutContainerDirective {
  constructor(private service: PageLayoutService) {}
}

@Directive({
  selector: '[m-pageLayout__pane]',
})
export class PageLayoutPaneDirective implements OnInit, OnDestroy {
  @Input('m-pageLayout__pane')
  pane: 'left' | 'main' | 'right';

  @HostBinding('class.m-pageLayout__pane--left')
  get isLeft(): boolean {
    return this.pane === 'left';
  }

  @HostBinding('class.m-pageLayout__pane--main')
  get isMain(): boolean {
    return this.pane === 'main';
  }

  @HostBinding('class.m-pageLayout__pane--right')
  get isRight() {
    return this.pane === 'right';
  }

  constructor(private service: PageLayoutService) {}

  ngOnInit() {
    switch (this.pane) {
      case 'left':
        break;
      case 'main':
        break;
      case 'right':
        this.service.hasRightPane$.next(true);
        break;
    }
  }

  ngOnDestroy() {
    switch (this.pane) {
      case 'left':
        break;
      case 'main':
        break;
      case 'right':
        this.service.hasRightPane$.next(false);
        break;
    }
  }
}
