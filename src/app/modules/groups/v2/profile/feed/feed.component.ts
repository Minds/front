import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupV2Service } from '../../services/group-v2.service';

@Component({
  selector: 'm-group__feed',
  templateUrl: 'feed.component.html',
})
export class GroupFeedComponent implements OnInit {
  constructor(
    public service: GroupV2Service,
    protected route: ActivatedRoute
  ) {}

  ngOnInit() {}
}
