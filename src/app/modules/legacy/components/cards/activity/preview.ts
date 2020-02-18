import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
} from '@angular/core';

import { Client } from '../../../../../services/api';
import { Session } from '../../../../../services/session';

import { AttachmentService } from '../../../../../services/attachment';
import { ActivityService } from '../../../../../common/services/activity.service';
import { ConfigsService } from '../../../../../common/services/configs.service';

@Component({
  moduleId: module.id,
  selector: 'minds-activity-preview',
  inputs: ['object'],
  templateUrl: 'activity.html',
  host: {
    class: 'mdl-shadow--8dp',
  },
  providers: [ActivityService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityPreview {
  readonly cdnUrl: string;
  readonly cdnAssetsUrl: string;
  readonly siteUrl: string;

  activity: any;
  hideTabs: boolean;

  editing: boolean = false;
  commentsToggle: boolean = false;
  showBoostOptions: boolean = false;
  translateToggle: any;
  translateEvent: any;
  childEventsEmitter: EventEmitter<any> = new EventEmitter();
  isTranslatable: boolean = false;
  menuOptions: any = [];
  canDelete: boolean = false;

  constructor(
    public session: Session,
    public client: Client,
    public attachment: AttachmentService,
    configs: ConfigsService
  ) {
    this.hideTabs = true;
    this.cdnUrl = configs.get('cdn_url');
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.siteUrl = configs.get('site_url');
  }

  set object(value: any) {
    this.activity = value;
    if (this.activity.mature) {
      this.activity.mature_visibility = true;
    }
  }

  getOwnerIconTime() {
    let session = this.session.getLoggedInUser();
    if (session && session.guid === this.activity.ownerObj.guid) {
      return session.icontime;
    } else {
      return this.activity.ownerObj.icontime;
    }
  }

  toDate(timestamp) {
    return new Date(timestamp * 1000);
  }

  propagateTranslation(e?) {
    return;
  }

  isUnlisted(entity: any) {
    return false;
  }

  isPending(activity) {
    return false;
  }

  isScheduled(time_created) {
    return false;
  }

  save() {
    /* NOOP */
  }

  openComments() {
    /* NOOP */
  }

  showBoost() {
    /* NOOP */
  }

  showWire() {
    /* NOOP */
  }

  togglePin() {
    /* NOOP */
  }

  menuOptionSelected(e?) {
    /* NOOP */
  }
}
