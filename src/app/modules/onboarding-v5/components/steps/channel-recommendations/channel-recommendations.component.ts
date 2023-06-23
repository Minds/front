import { Component, Input } from '@angular/core';
import { ComponentOnboardingV5OnboardingStep } from '../../../../../../graphql/generated.strapi';
import { OnboardingV5Service } from '../../../services/onboarding-v5.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { PublisherType } from '../../../../../common/components/publisher-search-modal/publisher-search-modal.component';

/**
 * Recommendations content panel for onboarding v5.
 * Can display either channels OR groups depending on the publisherType input.
 */
@Component({
  selector: 'm-onboardingV5__channelRecommendationsContent',
  templateUrl: './channel-recommendations.component.html',
  styleUrls: [
    'channel-recommendations.component.ng.scss',
    '../../../stylesheets/onboarding-v5-common.ng.scss',
  ],
})
export class OnboardingV5ChannelRecommendationsContentComponent {
  /** Threshold for minimum subscriptions. */
  private readonly MIN_SUBSCRIPTION_THRESHOLD = 1;

  /** Title for section. */
  @Input() public readonly title: string;

  /** Description for section. */
  @Input() public readonly description: string;

  /** Data from CMS. */
  @Input() public readonly data: ComponentOnboardingV5OnboardingStep;

  /** Publisher type to get recommendations for. */
  @Input() public readonly publisherType: PublisherType = 'user';

  /** Whether recommendations have been loaded. */
  public loaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /** Count of subscriptions. */
  private subscriptionsCount$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(0);

  /** Whether step can be considered completed. */
  public hasCompletedStep$: Observable<boolean> = this.subscriptionsCount$.pipe(
    map((count: number): boolean => count >= this.MIN_SUBSCRIPTION_THRESHOLD)
  );

  constructor(private service: OnboardingV5Service) {}

  /**
   * Handles action button click.
   * @returns { void }
   */
  public onActionButtonClick(): void {
    this.service.continue();
  }

  /**
   * Handles skip button click.
   * @returns { void }
   */
  public onSkipButtonClick(): void {
    this.service.continue();
  }

  /**
   * Increments subscription count on subscribed.
   * @returns { void }
   */
  public onSubscribed() {
    const count: number = this.subscriptionsCount$.getValue();
    this.subscriptionsCount$.next(count + 1);
  }

  /**
   * Decrements subscription count on subscribed.
   * @returns { void }
   */
  public onUnsubscribed() {
    const count: number = this.subscriptionsCount$.getValue();

    // if a user reloads it is possible to get into a state where
    // some already subscribed channels are shown - thus unsubscription would
    // take this into negative values.
    if (count >= 0) {
      this.subscriptionsCount$.next(count - 1);
    }
  }

  /**
   * Fires on loaded.
   * @param { boolean } value - loaded.
   * @returns { void }
   */
  public onLoaded(value: boolean): void {
    this.loaded$.next(value);
  }
}
