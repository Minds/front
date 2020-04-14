import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Message button (non-owner)
 */
@Component({
  selector: 'm-channelActions__message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'message.component.html',
})
export class ChannelActionsMessageComponent {
  message(): void {}
}
