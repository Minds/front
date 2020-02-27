import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MindsUser } from '../../../interfaces/entities';
import { Session } from '../../../services/session';
import { Tag } from '../../hashtags/types/tag';
import { Client } from '../../../services/api/client';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-channel__sidebarv2',
  templateUrl: 'sidebar-v2.component.html',
})
export class ChannelSidebarV2Component {
  readonly cdnAssetsUrl;

  @Input() user: MindsUser;
  @Input() editing: boolean = false;
  @Output() changeEditing = new EventEmitter<boolean>();

  constructor(
    public client: Client,
    public session: Session,
    private configs: ConfigsService
  ) {
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url');
  }

  isOwner() {
    return this.session.getLoggedInUser().guid === this.user.guid;
  }
}
