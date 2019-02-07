import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VideoChatService } from '../../../videochat/videochat.service';

@Component({
  moduleId: module.id,
  selector: 'm-groups--filter-selector',
  templateUrl: 'filter-selector.component.html'
})
export class GroupsProfileFilterSelector {
  @Input() group: any;
  @Input() filter: string;

  @Input() isSorting: boolean;
  @Input() algorithm: string;
  @Input() period: string;
  @Input() customType: string;

  @Output('onSortingChange') onChangeEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public videoChat: VideoChatService
  ) { }

  openVideoChat() {
    this.videoChat.activate(this.group);
  }
}
