import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FeaturesService } from '../../../../services/features.service';
import { MindsUser } from '../../../../interfaces/entities';
import { ChannelEditService } from './edit.service';

/**
 * Edit modal component
 */
@Component({
  selector: 'm-channel__edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'edit.component.html',
  providers: [ChannelEditService],
})
export class ChannelEditComponent {
  /**
   * Sets the channel to be edited
   * @param channel
   */
  @Input('channel') set data(channel: MindsUser) {
    this.service.setChannel(channel);
  }

  /**
   * Modal options
   *
   * @param onSave
   * @param onDismissIntent
   */
  set opts({ onSave, onDismissIntent }) {
    this.onSave = onSave || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  /**
   * Modal save handler
   */
  onSave: (any) => any = () => {};

  /**
   * Modal dismiss intent handler
   */
  onDismissIntent: () => void = () => {};

  /**
   * Constructor
   * @param service
   * @param features
   */
  constructor(
    public service: ChannelEditService,
    protected features: FeaturesService
  ) {}

  /**
   * Gets Pro settings URL
   * @param channel
   */
  getProSettingsRouterLink(channel: MindsUser): Array<any> {
    if (!channel) {
      return [];
    }

    if (!this.features.has('navigation')) {
      return ['/pro', channel.username, 'settings'];
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
