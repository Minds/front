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
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { FeedsService } from '../../services/feeds.service';

@Component({
  selector: 'm-seeLatestPostsButton',
  templateUrl: './see-latest-posts-button.component.html',
  styleUrls: ['./see-latest-posts-button.component.ng.scss'],
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
export class SeeLatestPostsButtonComponent implements OnInit, OnDestroy {
  /**
   * Specify the polling interval
   */
  @Input() pollingInterval: number = 30000; // 30 seconds by default

  /**
   * The count that the upstream can send
   */
  @Input() count: number = 0;

  @Output('click')
  onClickEmitter = new EventEmitter();

  @Output('poll')
  onPollEmitter = new EventEmitter();

  @HostBinding('class.m-seeLatestPostButton--visible')
  visible: boolean = false;

  /**
   * The polling subscription
   */
  pollingSubscription: Subscription;

  constructor(@Inject(PLATFORM_ID) private platformId) {}

  ngOnInit(): void {
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

  /**
   * returns the localized button title
   */
  get title(): string {
    return $localize`:@@MINDS__NEWSFEED__SEE_LATEST_TITLE: See
      ${this.count > 99 ? '+99' : this.count}:count: latest posts`;
  }

  /**
   * called when the see more button is clicked
   */
  async onClick(): Promise<void> {
    this.onClickEmitter.emit();
  }

  /**
   * starts watching for new posts
   */
  private startPolling(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Already polling
    if (this.pollingSubscription) return;

    this.pollingSubscription = interval(this.pollingInterval).subscribe(() => {
      this.onPollEmitter.emit();
    });
  }

  /**
   * Stops the polling (removes subscription)
   */
  private stopPolling(): void {
    this.pollingSubscription?.unsubscribe();
  }

  @HostListener('window:focus')
  onWindowFocus(): void {
    // Trigger re-poll when browser window back open
    this.onPollEmitter.emit();

    this.startPolling();
  }

  @HostListener('window:blur')
  onWindowBlur(): void {
    this.stopPolling();
  }
}
