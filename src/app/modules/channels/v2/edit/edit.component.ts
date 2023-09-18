import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MindsUser } from '../../../../interfaces/entities';
import { ChannelEditService } from './edit.service';

/**
 * Edit modal component
 * Container for vertical accordion modal with various panes for editing one's channel
 */
@Component({
  selector: 'm-channel__edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'edit.component.html',
  providers: [ChannelEditService],
})
export class ChannelEditComponent {
  /**
   * Modal save handler
   */
  onSave: (any) => any = () => {};

  /**
   * Modal dismiss intent handler
   */
  onDismissIntent: () => void = () => {};

  /**
   * Which pane index to open the modal on
   */
  initialPane: number = 0;

  /**
   * Constructor
   * @param service
   */
  constructor(public service: ChannelEditService) {}

  /**
   * Modal options
   *
   * @param onSave
   * @param onDismissIntent
   * @param channel
   */
  setModalData({ onSave, onDismissIntent, channel, initialPane }) {
    this.onSave = onSave || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});
    this.service.setChannel(channel);
    this.initialPane = initialPane;
  }

  /**
   * Gets Pro settings URL
   * @param channel
   */
  getProSettingsRouterLink(channel: MindsUser): Array<any> {
    if (!channel) {
      return [];
    }

    return ['/settings/pro_canary', channel.username];
  }

  /**
   * Saves the updated user info
   */
  async onSubmit(): Promise<void> {
    const channel = await this.service.save();

    if (channel) {
      this.onSave(channel);
    }
  }
}
