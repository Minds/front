import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediumFadeAnimation } from '../../../../../animations';

import {
  ActivityService,
  ActivityEntity,
} from '../../../activity/activity.service';
import { ActivityModalService } from '../modal.service';
import { Session } from '../../../../../services/session';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { Subscription } from 'rxjs';

/**
 * In the modal's full screen mode, additional information about the post
 * is displayed as an overlay on mouseover (or tap, on tablet).
 *
 * The overlay includes the post owner's avatar/username, a title, and a button to exit fullscreen.
 */
@Component({
  selector: 'm-activity__modalTitleOverlay',
  templateUrl: './title-overlay.component.html',
  styleUrls: ['./title-overlay.component.ng.scss'],
  animations: [MediumFadeAnimation],
})
export class ActivityModalTitleOverlayComponent implements OnInit, OnDestroy {
  fullscreenHovering: boolean = false; // For fullscreen button animation
  tabletOverlayTimeout: any = null;
  entitySubscription: Subscription;
  entity: ActivityEntity;

  constructor(
    public service: ActivityModalService,
    public activityService: ActivityService,
    private session: Session,
    private configs: ConfigsService
  ) {}

  ngOnInit() {
    this.entitySubscription = this.activityService.entity$.subscribe(
      (entity: ActivityEntity) => {
        this.entity = entity;
      }
    );
  }
  ngOnDestroy(): void {
    if (this.entitySubscription) {
      this.entitySubscription.unsubscribe();
    }
  }

  get title(): string {
    return this.entity.title || `${this.entity.ownerObj.name}'s post`;
  }

  get avatarUrl(): string {
    const currentUser = this.session.getLoggedInUser();
    const iconTime: number =
      currentUser && currentUser.guid === this.entity.ownerObj.guid
        ? currentUser.icontime
        : this.entity.ownerObj.icontime;
    return (
      this.configs.get('cdn_url') +
      'icon/' +
      this.entity.ownerObj.guid +
      '/medium/' +
      iconTime
    );
  }
}
