import { Component } from '@angular/core';
import { FeedNoticeService } from '../../services/feed-notice.service';

/**
 * Feed notice directing users to join groups
 */
@Component({
  selector: 'm-feedNotice--noGroups',
  templateUrl: './no-groups-notice.component.html',
  styleUrls: ['./no-groups-notice.component.ng.scss'],
})
export class NoGroupsNoticeComponent {}
