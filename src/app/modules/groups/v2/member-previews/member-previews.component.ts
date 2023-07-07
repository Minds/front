import { Component } from '@angular/core';
import { GroupService } from '../group.service';

@Component({
  selector: 'm-group__memberPreviews',
  templateUrl: './member-previews.component.html',
  styleUrls: ['./member-previews.component.ng.scss'],
})
export class GroupMemberPreviewsComponent {
  constructor(protected service: GroupService) {}
}
