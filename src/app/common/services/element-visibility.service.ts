import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

import { ScrollService } from '../../services/ux/scroll';

@Injectable()
export class ElementVisibilityService implements OnDestroy {
  protected element: HTMLElement;

  protected entity;

  protected visibilitySubscription: Subscription;

  protected visibility$: Subject<boolean> = new Subject();

  protected scrollSubscription: Subscription;

  protected visible: boolean = false;

  protected onViewFn: (entity?) => void;

  protected enabled: boolean = true;

  protected offset: number = 0;

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

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    return this;
  }

  setOffset(offset: number) {
    this.offset = offset;
    return this;
  }

  init() {
    this.visibilitySubscription = this.visibility$
      //.pipe(debounceTime(300))
      .subscribe(() => {
        if (this.visible) {
          this.scroll.unListen(this.scrollSubscription);

          if (this.onViewFn) {
            this.onViewFn(this.entity);
          } else {
            console.warn('Missing onView handler for Activity');
          }
        }
      });

    this.scrollSubscription = this.scroll.listenForView().subscribe(() => {
      this.checkVisibility();
    });
  }

  checkVisibility(): void {
    if (!this.element) {
      // console.warn('Missing element ref');
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
    // it's either the height of the viewport or the height of the element + the viewport's (in case the element's not 100% on screen
    const totalH = Math.max(bottom, vpBottom) - Math.min(top, vpTop);
    const vpComp = totalH - this.scroll.view.clientHeight;
    // the part of the component (in pixels) that's ON the screen
    const vpEl = this.element.offsetHeight - vpComp + this.offset;

    // if vpEl is negative, we set it to 0 (it's not in the screen), otherwise, return the percentage of the component that's visible
    const visible = vpEl <= 0 ? 0 : vpEl / this.element.offsetHeight;

    if (visible > 0 && !this.visible) {
      this.visible = true;
      this.visibility$.next(this.visible);
    } else {
      this.visible = false;
    }
  }

  ngOnDestroy() {
    this.scroll.unListen(this.scrollSubscription);

    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
  }
}
