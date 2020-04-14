import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Wire (pay) button (non-owner)
 */
@Component({
  selector: 'm-channelActions__wire',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'wire.component.html',
})
export class ChannelActionsWireComponent {
  wire(): void {}
}
