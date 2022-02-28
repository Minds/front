import { Component, Input } from '@angular/core';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Session } from '../../../../services/session';
import {
  ActivityEntity,
  ActivityService,
} from '../../activity/activity.service';

@Component({
  selector: 'm-activityV2__remind',
  templateUrl: 'remind.component.html',
  styleUrls: ['remind.component.ng.scss'],
  providers: [ActivityService],
})
export class ActivityV2RemindComponent {
  @Input('entity') set entity(entity: ActivityEntity) {
    console.log('ojm remind entity', entity);
    this.service.setEntity(entity.remind_object);
    this.service.isNsfwConsented$.next(true); // Parent entity should have done this

    this.remindObj = entity.remind_object;

    const currentUser = this.session.getLoggedInUser();
    const iconTime: number =
      currentUser && currentUser.guid === entity.ownerObj.guid
        ? currentUser.icontime
        : this.remindObj.ownerObj.icontime;

    this.avatarUrl =
      this.configs.get('cdn_url') +
      'icon/' +
      this.remindObj.ownerObj.guid +
      '/medium/' +
      iconTime;
  }

  /**
   * Whether or not autoplay is allowed (this is used for single entity view, media modal and media view)
   */
  @Input() autoplayVideo: boolean = false;

  @Input() parentService: ActivityService;

  avatarUrl: string;
  remindObj;

  constructor(
    public service: ActivityService,
    public session: Session,
    private configs: ConfigsService
  ) {}

  ngOnInit() {
    this.service.displayOptions = this.parentService.displayOptions;
  }
}
