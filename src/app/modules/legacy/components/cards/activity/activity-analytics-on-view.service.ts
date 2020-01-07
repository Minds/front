import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

import { ScrollService } from '../../../../../services/ux/scroll';

@Injectable()
export class ActivityAnalyticsOnViewService implements OnDestroy {
  protected element: HTMLElement;

  protected entity;

  protected visibility$: Subscription;

  protected visibilitySubject: Subject<boolean> = new Subject();

  protected scroll$: Subscription;

  protected visible: boolean = false;

  protected onViewFn: (entity) => void;

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

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    return this;
  }

  init() {
    this.visibility$ = this.visibilitySubject
      //.pipe(debounceTime(300))
      .subscribe(() => {
        if (this.entity && this.visible) {
          this.scroll.unListen(this.scroll$);

          if (this.onViewFn) {
            this.onViewFn(this.entity);
          } else {
            console.warn('Missing onView handler for Activity');
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

    const top = this.element.offsetTop;
    const bottom = top + this.element.offsetHeight;
    const vpTop = this.scroll.view.scrollTop;
    const vpBottom = vpTop + this.scroll.view.clientHeight;
    const totalH = Math.max(bottom, vpBottom) - Math.min(top, vpTop);
    const vpComp = totalH - this.scroll.view.clientHeight;
    const vpEl = this.element.offsetHeight - vpComp;
    const visible = vpEl <= 0 ? 0 : vpEl / this.element.offsetHeight;

    if (visible > 0 && !this.visible) {
      this.visible = true;
      this.visibilitySubject.next(this.visible);
    } else {
      this.visible = false;
    }
  }

  ngOnDestroy() {
    this.scroll.unListen(this.scroll$);

    if (this.visibility$) {
      this.visibility$.unsubscribe();
    }
  }
}
