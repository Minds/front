import { Component } from '@angular/core';
import { ChannelEditIntentService } from '../../services/edit-intent.service';

@Component({
  selector: 'm-channel__addLinksTrigger',
  templateUrl: './add-links-trigger.component.html',
  styleUrls: ['./add-links-trigger.component.ng.scss'],
})
export class ChannelAddLinksTriggerComponent {
  constructor(protected channelEditIntent: ChannelEditIntentService) {}

  /**
   * Open the channel edit modal to the social links pane
   */
  protected onClick() {
    this.channelEditIntent.edit(3);
  }
}
