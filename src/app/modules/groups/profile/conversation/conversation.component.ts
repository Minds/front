import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'minds-groups-profile-conversation',
  templateUrl: 'conversation.component.html',
})
export class GroupsProfileConversation implements OnInit {
  @Input() group: any;

  @HostBinding('class.m-groupConversation__newDesign')
  @Input()
  newDesign: boolean = false;

  constructor(public session: Session, private router: Router) {}

  ngOnInit() {
    if (!this.group['is:member'] && this.group.membership != 2) {
      this.router.navigate(['/groups/profile', this.group.guid, 'activity']);
      return;
    }
  }
}
