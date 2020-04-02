import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { ChannelMode, MindsUser } from '../../../interfaces/entities';
import { Client } from '../../../services/api';

@Component({
  selector: 'm-channel-mode-selector',
  templateUrl: './channel-mode-selector.component.html',
})
export class ChannelModeSelectorComponent implements AfterViewInit {
  @ViewChild('channelModeDropdown', { static: false })
  channelModeDropdown: DropdownComponent;
  @Input() public enabled = true;
  @Input() public user: MindsUser;
  public channelModes = ChannelMode;

  constructor(public client: Client) {}

  /**
   * Pass the enabled flag down to the ViewChild to control the dropdown functions
   * Only owners can change their channel mode
   */
  public ngAfterViewInit() {
    this.channelModeDropdown.enabled = this.enabled;
  }

  /**
   * @param mode ChannelMode
   * Sets the channel mode on the user object and calls the api
   */
  public setChannelMode(mode: ChannelMode) {
    if (!this.enabled) {
      return;
    }
    this.user.mode = mode;
    this.channelModeDropdown.close();
    this.update();
  }

  /**
   * Sends the current user to the update endpoint
   */
  async update() {
    try {
      await this.client.post('api/v1/channel/info', this.user);
    } catch (ex) {
      console.error(ex);
    }
  }
}
