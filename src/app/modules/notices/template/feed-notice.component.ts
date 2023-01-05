import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { IntersectionObserverService } from '../../../common/services/interception-observer.service';
import { AnalyticsService } from '../../../services/analytics';

/**
 * Feeds notices component. To use, provide content via ng-content.
 * Automatic styling inline with the component will be applied for:
 * - (span) .m-feedNotice__title
 * - (p) .m-feedNotice__body
 * - (m-button) .m-feedNotice__buttonPrimary
 * - (m-button) .m-feedNotice__buttonSecondary
 */
@Component({
  selector: 'm-feedNotice',
  templateUrl: 'feed-notice.component.html',
  styleUrls: ['feed-notice.component.ng.scss'],
})
export class FeedNoticeComponent implements OnInit, OnDestroy {
  // emits on feed notice entering and leaving the viewport.
  private intersectionObserverSubscription: Subscription;

  constructor(
    private el: ElementRef,
    private analytics: AnalyticsService,
    private intersectionObserver: IntersectionObserverService
  ) {}

  ngOnInit(): void {
    this.setupInterceptionObserver();
  }

  ngOnDestroy(): void {
    this.intersectionObserverSubscription?.unsubscribe();
  }

  // Whether component is dismissible or not (shows close button).
  @Input() dismissible: boolean = true;

  // Icon to be shown.
  @Input() icon: string = 'info';

  // id to append to data-ref attribute so we can report
  // to analytics which notice has been interacted with.
  @Input() dataRefId: string = 'unknown';

  // Fired on dismiss click.
  @Output() dismissClick: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );

  /**
   * Setup InterceptionObserver to watch for feed notice entering
   * and leaving the viewport - once one has entered for more than a
   * second, calls to log a view event in analytics.
   * @returns { void }
   */
  private setupInterceptionObserver(): void {
    if (this.intersectionObserverSubscription) {
      console.warn('Attempted to re-register FeedNotice InterceptionObserver');
      return;
    }

    this.intersectionObserverSubscription = this.intersectionObserver
      .createAndObserve(this.el)
      .pipe(debounceTime(1000), filter(Boolean))
      .subscribe((isVisible: boolean) => {
        this.analytics.trackView(`feed-notice-${this.dataRefId}`);
      });
  }
}
