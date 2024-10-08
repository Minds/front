import { ClientMetaDirective } from '../../../common/directives/client-meta.directive';
import { Component, Input, Optional, SkipSelf } from '@angular/core';
import noOp from '../../../helpers/no-op';
import { PublisherType } from '../../../common/components/publisher-search-modal/publisher-search-modal.component';
import { OnboardingV4Service } from '../../onboarding-v4/onboarding-v4.service';

/**
 * Displays channel/group recommendations as a modal
 *
 * See it during the onboarding v4 flow
 */
@Component({
  selector: 'm-publisherRecommendationsModal',
  templateUrl: './publisher-recommendations-modal.component.html',
  styleUrls: ['./publisher-recommendations-modal.component.ng.scss'],
})
export class PublisherRecommendationsModalComponent {
  protected subscriptionCount = 0;

  protected publisherType: PublisherType = 'user';
  /**
   * Called on continue click
   */
  protected onContinue: () => void = noOp;

  /**
   * Called on skip click
   */
  protected onSkip: () => void = noOp;

  constructor(
    protected onboardingV4Service: OnboardingV4Service,
    @Optional() @SkipSelf() protected parentClientMeta: ClientMetaDirective
  ) {}

  /**
   * Set modal data
   * @param {{ function }} onContinue - function to be called on Continue button click.
   * @param {{ function }} onSkip - function to be called on Skip button click.
   * @param { PublisherType } publisherType - whether we want channel/group recs
   * @returns { void }
   */
  setModalData({ onContinue, onSkip, publisherType }): void {
    this.onContinue = onContinue || noOp;
    this.onSkip = onSkip || noOp;
    this.publisherType = publisherType;
  }
}
