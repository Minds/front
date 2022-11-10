import { Component, HostBinding, Injector, Input } from '@angular/core';
import { Session } from '../../../services/session';
import { AuthModalService } from '../../auth/modal/auth-modal.service';
import { ComposerModalService } from '../../composer/components/modal/modal.service';
import { ComposerService } from '../../composer/services/composer.service';
import { SupermindExperimentService } from '../../experiments/sub-services/supermind-experiment.service';

@Component({
  selector: 'm-supermind__button',
  templateUrl: './supermind-button.component.html',
  styleUrls: ['./supermind-button.component.ng.scss'],
})
export class SupermindButtonComponent {
  /**
   * Determines if you can show the supermind button
   */
  canShow: boolean;

  /**
   * The entity to focus the supermind button on
   * Can be User or Activity
   */
  @Input() entity: any;

  /**
   *
   */
  @HostBinding('class.iconOnly')
  @Input()
  iconOnly = false;

  /**
   * The size of the button
   */
  @Input() size = 'xsmall';

  /**
   *
   * @param composerModalService
   * @param composerService
   * @param supermindExperiment
   * @param injector
   */
  constructor(
    private session: Session,
    private authModal: AuthModalService,
    private composerModalService: ComposerModalService,
    private composerService: ComposerService,
    private supermindExperiment: SupermindExperimentService,
    private injector: Injector
  ) {}

  ngOnInit() {
    this.canShow = this.supermindExperiment.isActive();
  }

  /**
   * Open the composer with prefilled supermind data
   * @param { MouseEvent } e - mouse event.
   * @returns { Promise<void> }
   */
  async onClick(e: MouseEvent): Promise<void> {
    if (!this.session.getLoggedInUser()) {
      await this.authModal.open({ formDisplay: 'register' });
      return;
    }

    let receiverGuid: string;

    if (this.entity.type === 'user') {
      receiverGuid = this.entity.username;
    } else {
      receiverGuid = this.entity.ownerObj.username;
      this.composerService.remind$.next(this.entity);
    }

    this.composerService.supermindRequest$.next({
      receiver_guid: receiverGuid,
      reply_type: 0,
      payment_options: {
        payment_type: 0,
        amount: 10,
      },
      twitter_required: false,
      terms_agreed: false,
      refund_policy_agreed: false,
    });

    this.composerModalService.setInjector(this.injector).present();
  }
}
