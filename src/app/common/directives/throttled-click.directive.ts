/**
 * Adapted from Cory Rylan's debounce click directive at:
 * https://coryrylan.com/blog/creating-a-custom-debounce-click-directive-in-angular
 */
import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

/**
 * Directive to throttle and output a singular click event.
 */
@Directive({
  selector: '[throttledClick]',
})
export class ThrottledClickDirective implements OnInit {
  /** Time to throttle. */
  @Input() throttleTime: number = 600;

  /** Event emitter for the throttled click. */
  @Output() throttledClick: EventEmitter<MouseEvent> = new EventEmitter<
    MouseEvent
  >();

  /** Subject to hold clicks. */
  private readonly clicks: Subject<MouseEvent> = new Subject<MouseEvent>();

  /** Subscription to click subject. */
  private clickSubscription: Subscription;

  ngOnInit(): void {
    this.clickSubscription = this.clicks
      .pipe(throttleTime(this.throttleTime))
      .subscribe((e: MouseEvent) => this.throttledClick.emit(e));
  }

  ngOnDestroy(): void {
    this.clickSubscription?.unsubscribe();
  }

  /**
   * Handler for click events.
   * @param { MouseEvent } event - The click event.
   * @returns { void }
   */
  @HostListener('click', ['$event'])
  protected clickEvent(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}
