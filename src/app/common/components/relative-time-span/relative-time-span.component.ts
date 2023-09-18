import { isPlatformServer } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  last,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { FriendlyDateDiffPipe } from '../../pipes/friendlydatediff';

// component compatible entity.
export type TimestampedEntity = {
  time_created: number;
};

/**
 * Shows create date of activity entity in "relative time ago" format,
 * in a span element e.g. "30s ago".
 * Time will only update when the host is on screen.
 */
@Component({
  selector: 'm-relativeTimeSpan',
  template: `
    <span
      class="m-relativeTime__span"
      [title]="entity.time_created * 1000 | date: 'medium'"
      #relativeTimeSpan
      *mIfBrowser
    >
      {{ pauseableRelativeTimeAgo$ | async }}
    </span>
  `,
  providers: [FriendlyDateDiffPipe],
})
export class RelativeTimeSpanComponent {
  // activity entity to get time from.
  @Input('entity') entity: TimestampedEntity;

  // Reference to hosts span element.
  @ViewChild('relativeTimeSpan') relativeTimeSpan: ElementRef;

  /**
   * Relative time ago - e.g. 42 seconds ago.
   * Emits every second.
   */
  private relativeTimeAgo$: Observable<string> = interval(1000).pipe(
    // first emission before first interval
    startWith(0),
    // map through date transform pipe programmatically.
    map(() => this.datePipe.transform(this.entity.time_created, '', false)),
    distinctUntilChanged()
  );

  // set an initial value for the pauseable timer to match relativeTimeAgo$.
  public pauseableRelativeTimeAgo$: Observable<any> = this.relativeTimeAgo$;

  // holds true if span component is being intersected.
  private readonly isIntersecting$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  // intersection observer to monitor intersection with viewport.
  private intersectionObserver: IntersectionObserver;

  constructor(
    public datePipe: FriendlyDateDiffPipe,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  ngAfterViewInit(): void {
    try {
      this.setupIntersectionObserver();
      this.setupPauseableRelativeTime();
    } catch (e) {
      // do nothing.
    }

    // this.pauseableRelativeTimeAgo$.subscribe(val => {console.log("val", val)})
  }

  /**
   * Pauseable wrapper around relativeTime.
   * @returns { void }
   */
  setupPauseableRelativeTime(): void {
    this.pauseableRelativeTimeAgo$ = this.isIntersecting$.pipe(
      // If not intersecting, output last emitted value, else, output live observable.
      switchMap(value =>
        !value ? this.relativeTimeAgo$.pipe(last()) : this.relativeTimeAgo$
      )
    );
  }

  /**
   * Setup an interception observer to report when
   * relativeTime span element enters the DOM and update local
   * isIntersecting$ state accordingly.
   * @returns { void }
   */
  setupIntersectionObserver(): void {
    // Will not work on SSR
    if (isPlatformServer(this.platformId)) {
      return;
    }

    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    this.intersectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          this.isIntersecting$.next(entry.isIntersecting);
        });
      },
      options
    );

    this.intersectionObserver.observe(this.relativeTimeSpan.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}
