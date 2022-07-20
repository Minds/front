import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { Session } from '../../../../services/session';
import { MindsUser } from '../../../../interfaces/entities';

/**
 * Settings page with a link to allow users to
 * leave the settings page and go to their channel,
 * with the channel editor modal open
 */
@Component({
  selector: 'm-settingsV2__profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2ProfileComponent implements OnInit {
  user: MindsUser;
  url: string;

  constructor(protected cd: ChangeDetectorRef, private session: Session) {}

  ngOnInit() {
    this.user = this.session.getLoggedInUser();

    this.url = `/${this.user.username}/`;
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
