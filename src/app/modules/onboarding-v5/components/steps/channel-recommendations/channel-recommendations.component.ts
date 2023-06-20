import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComponentOnboardingV5OnboardingStep } from '../../../../../../graphql/generated.strapi';
import { OnboardingV5Service } from '../../../services/onboarding-v5.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { PublisherType } from '../../../../../common/components/publisher-search-modal/publisher-search-modal.component';

@Component({
  selector: 'm-onboardingV5__channelRecommendationsContent',
  templateUrl: './channel-recommendations.component.html',
  styleUrls: [
    'channel-recommendations.component.ng.scss',
    '../../../stylesheets/onboarding-v5-common.ng.scss',
  ],
})
export class OnboardingV5ChannelRecommendationsContentComponent {
  private readonly MIN_SUBSCRIPTION_THRESHOLD = 1;

  @Input() public readonly title: string;
  @Input() public readonly description: string;
  @Input() public readonly data: ComponentOnboardingV5OnboardingStep;
  @Input() public readonly publisherType: PublisherType = 'user';

  public formGroup: FormGroup;

  public loaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private subscriptionsCount$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(0);

  public hasCompletedStep$: Observable<boolean> = this.subscriptionsCount$.pipe(
    map((count: number): boolean => count >= this.MIN_SUBSCRIPTION_THRESHOLD)
  );

  constructor(private service: OnboardingV5Service) {}

  public onActionButtonClick(): void {
    this.service.continue();
  }

  public onSkipButtonClick(): void {
    this.service.continue();
  }

  public onSubscribed() {
    const count: number = this.subscriptionsCount$.getValue();
    this.subscriptionsCount$.next(count + 1);
  }

  public onUnsubscribed() {
    const count: number = this.subscriptionsCount$.getValue();
    this.subscriptionsCount$.next(count - 1);
  }

  public onLoaded(value: boolean) {
    this.loaded$.next(value);
  }
}
