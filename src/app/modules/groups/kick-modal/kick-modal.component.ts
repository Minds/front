import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { GroupsService } from '../groups.service';

@Component({
  selector: 'm-groups__kick-modal',
  templateUrl: 'kick-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsKickModalComponent {
  user: any;
  @Input('user') set _user(user: any) {
    if (this.user !== user) {
      this.user = user;
      this.kickSuccess = false;
      this.kickPrompt = true;
      this.kickBan = false;
    }
  }

  @Input() group: any;

  @Output() closed: EventEmitter<any> = new EventEmitter();

  kickPrompt: boolean = false;
  kickBan: boolean = false;
  kickSuccess: boolean = false;

  constructor(
    protected service: GroupsService,
    protected cd: ChangeDetectorRef
  ) {}

  async kick(ban: boolean = false) {
    if (!this.user) {
      return;
    }

    this.kickPrompt = false;
    this.detectChanges();

    let action;

    if (ban) {
      action = this.service.ban(this.group, this.user.guid);
    } else {
      action = this.service.kick(this.group, this.user.guid);
    }

    await action;

    this.kickSuccess = true;
    this.detectChanges();
  }

  emitClose() {
    this.kickPrompt = false;
    this.kickBan = false;
    this.detectChanges();

    this.closed.emit(Date.now());
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
