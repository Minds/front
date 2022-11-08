import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AbstractSubscriberComponent } from '../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { AnalyticsService } from '../../../services/analytics';
import { Storage } from '../../../services/storage';
import { IsCommentingService } from '../../comments/poster/is-commenting.service';
import { ExperimentsService } from '../../experiments/experiments.service';

const SUPERMIND_BANNER_POPUP_STORAGE_KEY = 'supermind-banner-popup';

/**
 * Handles whether and when to show the supermind banner popup
 */
@Injectable()
export class SupermindBannerPopupService extends AbstractSubscriberComponent
  implements OnDestroy {
  /**
   * The entity that will be used to populate the supermind composer
   * when the supermind button is pressed
   *
   * Can be an activity or a user
   */
  entity$ = new BehaviorSubject(null);

  /**
   * Whether the popup is visible
   */
  visible$ = new BehaviorSubject(false);

  /**
   * Becomes true when a supermind is posted via supermind button
   */
  supermindPosted$ = new BehaviorSubject(false);

  private visibilityTimeout;

  ojmKey; //temp

  constructor(
    private storage: Storage,
    private experiments: ExperimentsService,
    private isCommenting: IsCommentingService,
    private analytics: AnalyticsService
  ) {
    super();

    const ojmRandom = Math.floor(Math.random() * (999 - 100 + 1) + 100);
    this.ojmKey = `supermind-banner-popup-${ojmRandom}`;

    console.log('ojm SVC constructor key:', this.ojmKey);
  }

  public experimentEnabled(): boolean {
    return true;
    // ojm uncomment
    // return this.experiments.hasVariation(
    //   'front-5813-supermind-comment-prompt',
    //   true
    // );
  }

  /**
   * We only want to see the popup if it hasn't been seen this session
   */
  public hasBeenSeen(): boolean {
    // ojm switch ojmKey
    const seen = !!this.storage.get(this.ojmKey);
    // const seen = !!this.storage.get(SUPERMIND_BANNER_POPUP_STORAGE_KEY);
    // ojm test
    console.log('ojm SVC hasBeenSeen():', seen, this.ojmKey);
    // return false; // ojm remove
    return seen;
  }

  /**
   * Sets whether the popup has been seen already
   */
  public setSeen(): void {
    console.log('ojm SVC setSeen()', this.ojmKey);
    // ojm switch ojmKey
    this.storage.set(this.ojmKey, true);
    // this.storage.set(SUPERMIND_BANNER_POPUP_STORAGE_KEY, true);

    this.analytics.trackView(SUPERMIND_BANNER_POPUP_STORAGE_KEY, [
      this.analytics.buildEntityContext(this.entity$.getValue()),
    ]);
  }

  /**
   * We want to make the popup visible in x milliseconds
   */
  // ojm put back to 5000
  public startTimer(ms: number = 5000): void {
    console.log('ojm SVC startTimer');

    this.visibilityTimeout = setTimeout(() => {
      console.log('ojm SVC BEEEEEEP! visible$ TRUE');
      this.visible$.next(true);
    }, ms);
  }

  /**
   * Stop the visibility timer
   */
  public cancelTimer(): void {
    console.log('ojm SVC cancelTimer');
    if (this.visibilityTimeout) {
      clearTimeout(this.visibilityTimeout);
    }
  }

  ngOnDestroy(): void {
    console.log('ojm SVC onDestory');

    this.cancelTimer();
  }
}
