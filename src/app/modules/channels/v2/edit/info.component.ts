import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelEditService } from './edit.service';

/**
 * About Info accordion pane component
 */
@Component({
  selector: 'm-channelEdit__info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'info.component.html',
})
export class ChannelEditInfoComponent {
  constructor(public service: ChannelEditService) {}
}
