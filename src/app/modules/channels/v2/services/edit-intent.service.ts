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
  async edit(initialPane: number = 0): Promise<void> {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }

    const editedChannel = await this.editModal.present(
      this.service.channel$.getValue(),
      initialPane,
      this.injector
    );

    if (editedChannel) {
      this.userAvatar.src$.next(editedChannel.avatar_url.large);
      this.service.load(editedChannel);
      this.session.inject(editedChannel);
    }
  }
}
