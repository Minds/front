import { Component, HostBinding, Input } from '@angular/core';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Session } from '../../../../services/session';
import {
  ActivityEntity,
  ActivityService,
} from '../../activity/activity.service';

/**
 * Displays a stripped-down activity (e.g. without toolbar action buttons or comments) within an activity, with the quoted content on top.
 */
@Component({
  selector: 'm-activityV2__quote',
  templateUrl: 'quote.component.html',
  styleUrls: ['quote.component.ng.scss'],
  providers: [ActivityService],
})
export class ActivityV2QuoteComponent {
  @HostBinding('class.m-activity__quote--minimalMode')
  get minimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
  }

  @HostBinding('class.m-activity__quote--supermindReply')
  isSupermindReply: boolean;

  @Input('entity') set entity(entity: ActivityEntity) {
    this.service.setEntity(entity.remind_object);
    this.service.isNsfwConsented$.next(true); // Parent entity should have done this

    this.quotedEntity = entity.remind_object;

    const currentUser = this.session.getLoggedInUser();
    const iconTime: number =
      currentUser && currentUser.guid === entity.ownerObj.guid
        ? currentUser.icontime
        : this.quotedEntity.ownerObj.icontime;

    this.avatarUrl =
      this.configs.get('cdn_url') +
      'icon/' +
      this.quotedEntity.ownerObj.guid +
      '/medium/' +
      iconTime;
  }

  /**
   * Whether or not autoplay is allowed (this is used for single entity view, media modal and media view)
   */
  @Input() autoplayVideo: boolean = false;

  @Input() parentService: ActivityService;

  avatarUrl: string;
  quotedEntity;

  constructor(
    public service: ActivityService,
    public session: Session,
    private configs: ConfigsService
  ) {}

  ngOnInit() {
    const opts = {
      ...this.parentService.displayOptions,
      permalinkBelowContent: false,
      showPostMenu: false,
      showOwnerBlocK: true,
      isQuote: true,
    };

    this.service.displayOptions = opts;
  }
}
