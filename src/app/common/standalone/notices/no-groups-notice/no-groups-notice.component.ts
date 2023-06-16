import { Component } from '@angular/core';
import { FindGroupsButtonsComponent } from '../../groups/find-groups-buttons/find-groups-buttons.component';
import { NoticesModule } from '../../../../modules/notices/notices.module';

/**
 * Feed notice directing users to join groups
 */
@Component({
  standalone: true,
  selector: 'm-feedNotice--noGroups',
  templateUrl: './no-groups-notice.component.html',
  styleUrls: ['./no-groups-notice.component.ng.scss'],
  imports: [FindGroupsButtonsComponent, NoticesModule],
})
export class NoGroupsNoticeComponent {}
