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

  constructor(
    private storage: Storage,
    private experiments: ExperimentsService,
    private isCommenting: IsCommentingService,
    private analytics: AnalyticsService
  ) {
    super();
  }

  public experimentEnabled(): boolean {
    return this.experiments.hasVariation(
      'front-5813-supermind-comment-prompt',
      true
    );
  }

  /**
   * We only want to see the popup if it hasn't been seen this session
   */
  public hasBeenSeen(): boolean {
    const seen = !!this.storage.get(SUPERMIND_BANNER_POPUP_STORAGE_KEY);
    return seen;
  }

  /**
   * Sets whether the popup has been seen already
   */
  public setSeen(): void {
    this.storage.set(SUPERMIND_BANNER_POPUP_STORAGE_KEY, true);

    this.analytics.trackView(SUPERMIND_BANNER_POPUP_STORAGE_KEY, [
      this.analytics.buildEntityContext(this.entity$.getValue()),
    ]);
  }

  /**
   * We want to make the popup visible in x milliseconds
   */
  public startTimer(ms: number = 5000): void {
    if (this.visibilityTimeout) {
      return;
    }

    this.visibilityTimeout = setTimeout(() => {
      this.visible$.next(true);
    }, ms);
  }

  /**
   * Stop the visibility timer
   */
  public cancelTimer(): void {
    if (this.visibilityTimeout) {
      clearTimeout(this.visibilityTimeout);
    }
  }

  ngOnDestroy(): void {
    this.cancelTimer();
  }
}
