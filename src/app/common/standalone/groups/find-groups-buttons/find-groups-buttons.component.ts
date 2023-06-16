import { Component } from '@angular/core';
import { CommonModule } from '../../../common.module';
import isMobile from '../../../../helpers/is-mobile';

/**
 * Buttons that allow users to create/discover groups
 *
 * See them on the /groups/memberships page, at the
 * top of the list of the groups that you've joined
 */
@Component({
  standalone: true,
  selector: 'm-findGroupsButtons',
  imports: [CommonModule],
  templateUrl: './find-groups-buttons.component.html',
  styleUrls: ['./find-groups-buttons.component.ng.scss'],
})
export class FindGroupsButtonsComponent {}
