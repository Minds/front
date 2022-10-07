import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { interval, Subscription } from 'rxjs';

/**
 * Generalized see latest button that puts responsibility for handling of
 * updates on the parent component. If using FeedsService feeds, consider
 * whether you should use the SeeLatestPostsButtonComponent instead.
 *
 * @example usage:
 * <m-seeLatestButton
 *  [count]="count$ | async"
 *  (poll)="count()"
 *  (click)="onSeeLatestClick($event)"
 * ></m-seeLatestButton>
 */
@Component({
  selector: 'm-seeLatestButton',
  templateUrl: './see-latest-button.component.html',
  styleUrls: ['./see-latest-button.component.ng.scss'],
  animations: [
    trigger('slideIn', [
      state(
        'shown',
        style({
          transform: 'translateY(0px)',
        })
      ),
      state(
        'hidden',
        style({
          transform: 'translateY(-150px)',
        })
      ),
      transition('* => shown', [
        animate(
          '300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          style({
            transform: 'translateY(0px)',
          })
        ),
      ]),
      transition('* => dismissed', [
        animate(
          '450ms ease',
          style({
            transform: 'translateY(-150px)',
          })
        ),
      ]),
    ]),
  ],
})
export class SeeLatestButtonComponent implements OnInit, OnDestroy {
  /**
   * Latest count value. - this should equal the difference between the amount of
   * posts when the items were first loaded, and the amount now available from the server.
   */
  @Input() newCount: number;

  // Interval for polling.
  @Input() pollingInterval: number = 30000;

  // Outputs in intervals based on the pollingInterval. Should call a function that polls the server.
  @Output('poll') onPollEmitter: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  // Called on See Latest click. Should call to refresh the feed or update content.
  @Output('click') onClickEmitter: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  // Subscription to interval.
  private intervalSubscription: Subscription;

  constructor(@Inject(PLATFORM_ID) private platformId) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // setup interval subscription - will emit to `onPollEmitter` every `pollingInterval`.
    this.intervalSubscription = interval(this.pollingInterval).subscribe(
      interval => {
        this.onPollEmitter.emit();
      }
    );
  }

  ngOnDestroy(): void {
    this.intervalSubscription?.unsubscribe();
  }

  /**
   * Get title text for button.
   * @returns { string } the localized button title.
   */
  get title(): string {
    return $localize`:@@MINDS__NEWSFEED__SEE_LATEST_TITLE: See ${
      this.newCount > 99 ? '+99' : this.newCount
    }:count: latest`;
  }

  /**
   * Called when the see more button is clicked.
   * @returns { void }
   */
  public onClick(): void {
    this.onClickEmitter.emit();
  }
}
