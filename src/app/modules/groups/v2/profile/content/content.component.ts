import { Component } from '@angular/core';
import { Session } from '../../../../../services/session';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { GroupContentService } from './content.service';
import { GroupV2Service } from '../../services/group-v2.service';

@Component({
  selector: 'm-group__content',
  templateUrl: 'content.component.html',
  providers: [GroupContentService],
})
export class GroupContentComponent {
  /**
   * Assets CDN URL
   */
  readonly cdnAssetsUrl: string;

  /**
   * Constructor
   * @param service
   * @param content
   * @param session
   * @param configs
   */
  constructor(
    public service: GroupV2Service,
    public content: GroupContentService,
    public session: Session,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }
}
