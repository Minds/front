import { Component } from '@angular/core';
import { CommonModule } from '../../../common.module';
import { Router, RouterLink, RouterModule } from '@angular/router';

/**
 * Buttons that allow users to create/discover groups
 *
 * See them on the /groups/memberships page, at the
 * top of the list of the groups that you've joined
 */
@Component({
  standalone: true,
  selector: 'm-findGroupsButtons',
  imports: [CommonModule, RouterLink],
  templateUrl: './find-groups-buttons.component.html',
  styleUrls: ['./find-groups-buttons.component.ng.scss'],
})
export class FindGroupsButtonsComponent {
  constructor(private router: Router) {}

  onClickCreate($event): void {
    this.router.navigate['/groups/create'];
  }
  onClickDiscover($event): void {
    this.router.navigate['/discovery/suggestions/group'];
  }
}
