import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { ConfigsService } from '../../../../common/services/configs.service';

/**
 * Toolbar at top of channel banner, with options that change
 * depending on context of channel ownership (edit, boost, pro, dropdown with add'l options)
 */
@Component({
  selector: 'm-channel__actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'actions.component.html',
  styleUrls: ['actions.component.ng.scss'],
})
export class ChannelActionsComponent {
  /**
   * If global model is on, the post notification bell will always show
   */
  isGlobalMode: boolean;

  /**
   * Constructor
   * @param service
   */
  constructor(
    public service: ChannelsV2Service,
    private config: ConfigsService
  ) {}

  ngOnInit() {
    this.isGlobalMode = this.config.get('tenant')?.global_mode;
  }
}
