import {
  Component,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { ChannelMode, MindsUser } from '../../../interfaces/entities';
import { Client } from '../../../services/api';

@Component({
  selector: 'm-channel-mode-selector',
  templateUrl: './channel-mode-selector.component.html',
})
export class ChannelModeSelectorComponent {
  @ViewChild('channelModeDropdown', { static: false })
  channelModeDropdown: DropdownComponent;
  @Input() public enabled = true;
  @Input() public user: MindsUser;
  @Output() public channelModeSelected = new EventEmitter<ChannelMode>();

  public channelModes = ChannelMode;

  constructor(public client: Client) {}

  /**
   * @param mode ChannelMode
   * Sets the channel mode on the user object and calls the api
   */
  public setChannelMode(mode: ChannelMode) {
    if (!this.enabled) {
      return;
    }

    this.channelModeDropdown.close();
    this.channelModeSelected.emit(mode);
  }
}
