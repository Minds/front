import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelEditIntentService } from '../services/edit-intent.service';

/**
 * Edit channel button (for channel owners).
 * Click it to open the edit accordion modal
 */
@Component({
  selector: 'm-channelActions__edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'edit.component.html',
  providers: [ChannelEditIntentService],
})
export class ChannelActionsEditComponent {
  /**
   * Constructor
   * @param channelEditIntent
   */
  constructor(public channelEditIntent: ChannelEditIntentService) {}
}
