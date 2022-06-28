import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { WireModalService } from '../../../wire/wire-modal.service';
import { ProChannelService } from '../channel.service';
import { MindsUser } from '../../../../interfaces/entities';
import { WireEventType, WireEvent } from '../../../wire/v2/wire-v2.service';
import { Session } from '../../../../services/session';
import { AuthModalService } from '../../../auth/modal/auth-modal.service';
import { FormToastService } from '../../../../common/services/form-toast.service';

@Component({
  selector: 'm-pro__joinButton',
  templateUrl: 'join-button.component.html',
  styleUrls: ['join-button.component.ng.scss'],
})
export class JoinButtonComponent {
  constructor(
    private session: Session,
    public service: ProChannelService,
    private authModal: AuthModalService,
    private wireModal: WireModalService,
    private toaster: FormToastService
  ) {}

  onClick() {
    if (!this.session.isLoggedIn()) {
      this.authorize();
    } else {
      this.join();
    }
  }

  /**
   * Even though the pay modal has a built-in auth trigger,
   * we complete the auth modal separately here so we can subscribe
   * new/existing users to channels that haven't set up support tiers
   */
  async authorize(): Promise<void> {
    const user = await this.authModal.open();
    if (user) {
      this.subscribe();
      this.join();
    }
  }

  /**
   * Joining a support tier membership means you
   * will be subscribed to the channel (if you aren't already)
   */
  async join(): Promise<void> {
    if (this.service.lowestSupportTier$.getValue()) {
      const channel: MindsUser = this.service.currentChannel;

      const wireEvent: WireEvent = await this.wireModal.present(channel, {
        supportTier: this.service.lowestSupportTier$.getValue(),
      });
      if (wireEvent.type === WireEventType.Completed) {
        this.subscribe();
        this.service.userIsMember$.next(true);
      }
    } else {
      this.subscribe();
      this.toaster.success(
        `You've subscribed to ${this.service.currentChannel.name}`
      );
    }
  }

  subscribe(): void {
    this.service.subscribe();
  }
}
