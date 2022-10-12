import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigsService } from '../../../common/services/configs.service';

/**
 * Informational modal to teach users how superminds work
 *
 * Two panes are available - one for replies and one for requests
 *
 * Once dismissed, it won't be seen again by that user.
 */
@Component({
  selector: 'm-supermindOnboardingModal',
  templateUrl: './onboarding-modal.component.html',
  styleUrls: ['./onboarding-modal.component.ng.scss'],
})
export class SupermindOnboardingModalComponent {
  siteUrl: string;

  contentType: 'request' | 'reply';

  constructor(configs: ConfigsService) {
    this.siteUrl = configs.get('site_url');
  }

  onClickTermsLink($event: PointerEvent) {
    const termsPath = 'p/monetization-terms';
    window.open(`${this.siteUrl}${termsPath}`, '_blank');
  }

  onClickContinue($event: PointerEvent) {
    this.onComplete();
  }

  onComplete: () => void = () => {};

  /**
   * Modal options
   * @param contentType
   * @param { Function } onComplete - set on complete callback
   */
  setModalData({ contentType, onComplete }) {
    this.contentType = contentType;
    this.onComplete = onComplete || (() => {});
  }
}
