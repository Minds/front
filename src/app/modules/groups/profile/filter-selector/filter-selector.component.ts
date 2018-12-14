import { Component, Input } from '@angular/core';
import { VideoChatService } from '../../../videochat/videochat.service';

@Component({
  moduleId: module.id,
  selector: 'm-groups--filter-selector',
  templateUrl: 'filter-selector.component.html'
})
export class GroupsProfileFilterSelector {
  @Input() group: any;
  @Input() filter: string;

  constructor(
    public videoChat: VideoChatService
  ) { }

  openVideoChat() {
    this.videoChat.activate(this.group);
  }
}
