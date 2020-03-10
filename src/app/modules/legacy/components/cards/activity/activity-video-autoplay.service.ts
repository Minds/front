import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { ScrollService } from '../../../../../services/ux/scroll';

@Injectable()
export class ActivityAVideoAutoplayService implements OnDestroy {
  protected element: HTMLElement;

  protected entity;

  protected visibility$: Subscription;

  protected visibilitySubject: Subject<boolean> = new Subject();

  protected scroll$: Subscription;

  protected visible: boolean = false;

  protected onViewFn: (entity) => void;

  protected onStopViewingFn: (entity) => void;

  protected enabled: boolean = true;

  constructor(protected scroll: ScrollService) {
    this.init();
  }

  setElementRef(elementRef: ElementRef | null) {
    this.element = (elementRef && elementRef.nativeElement) || void 0;
    return this;
  }

  setEntity(entity) {
    this.entity = entity || void 0;
    return this;
  }

  onView(fn: (entity) => void) {
    this.onViewFn = fn;
    return this;
  }

  onStopViewing(fn: (entity) => void) {
    this.onStopViewingFn = fn;
    return this;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    return this;
  }

  init() {
    this.visibility$ = this.visibilitySubject.subscribe(() => {
      if (this.entity && this.visible) {
        if (this.onViewFn) {
          console.warn('viewing activity uwu');
          this.onViewFn(this.entity);
        } else {
          console.warn('Missing onView handler for Activity');
        }
      } else {
        if (this.onStopViewingFn) {
          this.onStopViewingFn(this.entity);
        } else {
          console.warn('Missing onStopViewingFn handler for Activity');
        }
      }
    });

    this.scroll$ = this.scroll.listenForView().subscribe(() => {
      this.checkVisibility();
    });
  }

  checkVisibility() {
    if (!this.element) {
      console.warn('Missing element ref');
      return;
    }

    if (!this.element.offsetHeight || !this.enabled) {
      return;
    }

    // top of the element
    const top = this.element.offsetTop;
    // bottom of the element
    const bottom = top + this.element.offsetHeight;
    // top of viewport
    const vpTop = this.scroll.view.scrollTop;
    // bottom of viewport
    const vpBottom = vpTop + this.scroll.view.clientHeight;
    // it's either the height of the viewport or the height of the element + the viewport's (in case the element's not 100% on screen)
    const totalH = Math.max(bottom, vpBottom) - Math.min(top, vpTop);
    const vpComp = totalH - this.scroll.view.clientHeight;
    // the part of the component (in pixels) that's IN the viewport
    const vpEl = this.element.offsetHeight - vpComp;
    // if vpEl is negative, we set it to 0 (it's not in the screen), otherwise, return the percentage of the component that's visible
    const visible =
      vpEl <= 0 ? 0 : Math.min(vpEl / this.element.offsetHeight, 1.0);
    console.warn('visible: ', visible);

    if (visible === 1 && !this.visible) {
      this.visible = true;
      this.visibilitySubject.next(this.visible);
    } else if (visible !== 1 && this.visible) {
      this.visible = false;
      this.visibilitySubject.next(this.visible);
    }
  }

  ngOnDestroy() {
    this.scroll.unListen(this.scroll$);

    if (this.visibility$) {
      this.visibility$.unsubscribe();
    }
  }
}
