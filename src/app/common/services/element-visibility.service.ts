import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { debounceTime, throttleTime } from 'rxjs/operators';
import { Observable, Subject, Subscription, firstValueFrom } from 'rxjs';

import { ScrollService } from '../../services/ux/scroll';
import { IntersectionObserverService } from './intersection-observer.service';
@Injectable()
export class ElementVisibilityService implements OnDestroy {
  /** The element that we are trying to observe the visibility of */
  protected elementRef: ElementRef;

  /** The intercept observable */
  protected observable: Observable<boolean>;

  /** The subscription that listens to the observanle */
  protected intersectionSubscription: Subscription;

  /** The entity that is attached to the element */
  protected entity;

  /** True/False - if the element is current visible */
  protected isVisible: boolean = false;

  /** Callback function that is called when the element is in  view */
  protected onViewFn: (entity?) => void;

  constructor(
    protected intersectionObserverService: IntersectionObserverService
  ) {}

  /**
   * The element ref that that wish to listen to the visibility of
   */
  public setElementRef(
    elementRef: ElementRef | null
  ): ElementVisibilityService {
    this.elementRef = elementRef;

    this.observable = this.intersectionObserverService.createAndObserve(
      this.elementRef,
      {
        threshold: 0.25, // 25% of the element must be viewed for us to consider
      }
    );

    this.intersectionSubscription = this.observable
      .pipe(debounceTime(1500), throttleTime(300))
      .subscribe((isVisible) => {
        this.isVisible = isVisible;

        if (isVisible) {
          // Don't listen anymore
          this.intersectionSubscription.unsubscribe();

          // Fire the callback
          if (this.onViewFn) {
            this.onViewFn(this.entity);
          } else {
            console.warn('Missing onView handler for Activity');
          }
        }
      });

    return this;
  }

  /**
   * Set the entity that will be passed back with the onView callback
   */
  public setEntity(entity): ElementVisibilityService {
    this.entity = entity || void 0;
    return this;
  }

  /**
   * Callback function for when the element has been viewed
   */
  public onView(fn: (entity) => void) {
    this.onViewFn = fn;
    return this;
  }

  ngOnDestroy() {
    this.intersectionSubscription?.unsubscribe();
  }
}
