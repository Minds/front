import { Component } from '@angular/core';
import { GroupV2Service } from '../../services/group-v2.service';

@Component({
  selector: 'm-group__chat',
  templateUrl: 'chat.component.html',
})
export class GroupChatComponent {
  constructor(public service: GroupV2Service) {}
}
