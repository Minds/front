import { Component } from '@angular/core';
import { GroupService } from '../group.service';
import { Subscription } from 'rxjs';
/**
 * Wrapper around group profile feed component
 */
@Component({
  selector: 'm-group__feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.ng.scss'],
})
export class GroupFeedComponent {
  groupGuidSubscription: Subscription;

  constructor(protected service: GroupService) {}
}
