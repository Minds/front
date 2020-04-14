import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Edit channel button (owner)
 */
@Component({
  selector: 'm-channelActions__edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'edit.component.html',
})
export class ChannelActionsEditComponent {
  edit(): void {}
}
