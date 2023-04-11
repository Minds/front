import { ClientMetaDirective } from '../../../common/directives/client-meta.directive';
import { Component, Optional, SkipSelf } from '@angular/core';
import noOp from '../../../helpers/no-op';

/**
 * Displays channel recommendations as a modal
 *
 * See it during the onboarding v4 flow
 */
@Component({
  selector: 'm-channelRecommendationModal',
  templateUrl: './channel-recommendation-modal.component.html',
  styleUrls: ['./channel-recommendation-modal.component.ng.scss'],
})
export class ChannelRecommendationModalComponent {
  public titleText: string = $localize`:@@COMMON__SUBSCRIBE:Subscribe`;

  public bodyText: string = $localize`:@@CONNECT_TWITTER_MODAL__CONNECT_YOUR_ACCOUNT_WITH_TWITTER:Connect your Minds account with Twitter.`;

  /** @type { boolean } whether onboarding users are required to make subscriptions before moving on */
  public isMandatory: boolean = false;

  /**
   * Called on continue click
   */
  protected onContinue: () => void = noOp;

  /**
   * Called on skip click
   */
  protected onSkip: () => void = noOp;
  /**
   * Set modal data
   * @param {{ function }} onContinue - function to be called on Continue button click.
   * @param {{ function }} onSkip - function to be called on Skip button click.
   * @param {{ boolean }} isMandatory - whether the user must subscribe is allowed to skip making selections during onboarding
   * @returns { void }
   */
  setModalData({ onContinue, onSkip, isMandatory = false }): void {
    this.onContinue = onContinue || noOp;
    this.onSkip = onSkip || noOp;
    this.isMandatory = isMandatory;
  }

  getModalOptions() {
    return {
      canDismiss: async () => {
        return !this.isMandatory;
      },
    };
  }

  constructor(
    @Optional() @SkipSelf() protected parentClientMeta: ClientMetaDirective // ojm needed?
  ) {}

  /**
   * Keep track of subscriptions?
   * ojm todo
   */
  onSubscribed(user): void {
    // if (this.listSize$.getValue() === 4) {
    //   this.listSize$.next(5);
    // }
    // if (this.recommendations$.getValue().length <= 4) {
    //   return;
    // }
    // this.recommendations$.next(
    //   this.recommendations$.getValue().filter(u => u.guid !== user.guid)
    // );
  }
}
