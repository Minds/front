import { Injectable, Injector, OnDestroy } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { ChannelEditModalService } from '../edit/edit-modal.service';
import { Session } from '../../../../services/session';
import { Subscription } from 'rxjs';
import { UserAvatarService } from '../../../../common/services/user-avatar.service';

@Injectable()
export class ChannelEditIntentService implements OnDestroy {
  /**
   * Open modal subscription
   */
  protected modalSubscription: Subscription;

  /**
   * Constructor
   * @param service
   * @param editModal
   * @param session
   * @param injector
   */
  constructor(
    public service: ChannelsV2Service,
    protected editModal: ChannelEditModalService,
    protected session: Session,
    protected injector: Injector,
    private userAvatar: UserAvatarService
  ) {}

  /**
   * Destroys edit modal if button is destroyed
   */
  ngOnDestroy(): void {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  /**
   * Opens edit modal
   */
  edit(): void {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }

    this.modalSubscription = this.editModal
      .setInjector(this.injector)
      .present(this.service.channel$.getValue())
      .subscribe(channel => {
        if (channel) {
          this.userAvatar.src$.next(channel.avatar_url.large);
          this.service.load(channel);
          this.session.inject(channel);
        }
      });
  }
}
