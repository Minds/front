import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupV2Service } from '../../services/group-v2.service';

@Component({
  selector: 'm-group__feed',
  templateUrl: 'feed.component.html',
})
export class GroupFeedComponent {
  /**
   * Constructor
   * @param service
   * @param route
   */
  constructor(
    public service: GroupV2Service,
    protected route: ActivatedRoute
  ) {}
}
