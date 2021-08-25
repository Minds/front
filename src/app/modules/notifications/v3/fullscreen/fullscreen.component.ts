import { Component } from '@angular/core';
import { Session } from '../../../../services/session';
import { NotificationsV3Service } from '../notifications-v3.service';

/**
 * Fullscreen wrapper for m-notifications__list
 * Uses column layout with right sidebar.
 */
@Component({
  selector: 'm-notifications__list--fullscreen',
  templateUrl: 'fullscreen.component.html',
  styleUrls: ['./fullscreen.component.ng.scss'],
  providers: [NotificationsV3Service],
})
export class NotificationsV3ListFullscreenComponent {
  constructor(public session: Session) {}
}
