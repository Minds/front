import { Component } from '@angular/core';
import { GroupService } from '../group.service';
import { GroupAccessType } from '../group.types';

/**
 * Displays on group page, either in the sidebar
 * or in the header, depending on screen size.
 * Contains info about the group (e.g. description)
 */
@Component({
  selector: 'm-group__about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.ng.scss'],
})
export class GroupAboutComponent {
  constructor(protected service: GroupService) {}

  // Allows us to use enum in template
  public groupAccessType: typeof GroupAccessType = GroupAccessType;
}
