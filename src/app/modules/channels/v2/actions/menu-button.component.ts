import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Menu (meatball) button (non-owner)
 */
@Component({
  selector: 'm-channelActions__menuButton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'menu-button.component.html',
})
export class ChannelActionsMenuButtonComponent {}
