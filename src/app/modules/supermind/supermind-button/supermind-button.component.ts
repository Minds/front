import {
  Component,
  EventEmitter,
  HostBinding,
  Injector,
  Input,
  Output,
} from '@angular/core';
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
   * Auto-populate composer with this body text
   */
  @Input() message: string;

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
   * Fires when a supermind activity is posted via the supermind button
   */
  @Output() onSupermindPosted: EventEmitter<any> = new EventEmitter();

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

    // Don't pre-populate composer with own username
    // if button was clicked from user's own post
    const loggedInUsername = this.session.getLoggedInUser().username;

    if (receiverGuid === loggedInUsername) {
      receiverGuid = '';
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

    // Pre-populate composer with comment text when supermind button
    // is clicked from the 'upgradeComment' supermind banner popup
    if (this.message) {
      this.composerService.message$.next(this.message);
    }

    this.presentComposerModal();
  }

  async presentComposerModal(): Promise<void> {
    try {
      await this.composerModalService
        .setInjector(this.injector)
        .onPost(activity => {
          this.onSupermindPosted.emit(true);
        })
        .present();
    } catch (err) {
      console.error(err);
    }
  }
}
