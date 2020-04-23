import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnDestroy,
} from '@angular/core';
import { ChannelEditModalService } from '../edit/edit-modal.service';
import { Subscription } from 'rxjs';
import { ChannelsV2Service } from '../channels-v2.service';
import { Session } from '../../../../services/session';

/**
 * Edit channel button (owner)
 */
@Component({
  selector: 'm-channelActions__edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'edit.component.html',
})
export class ChannelActionsEditComponent implements OnDestroy {
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
    protected injector: Injector
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
          this.service.load(channel);
          this.session.inject(channel);
        }
      });
  }
}
