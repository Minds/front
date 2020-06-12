import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroupV2Service } from '../../../services/group-v2.service';

@Component({
  selector: 'm-groupMember__button',
  templateUrl: 'button.component.html',
})
export class GroupMemberButton {
  @Input() group: any = {};
  @Input() user: any = {
    'is:member': false,
    'is:moderator': false,
    'is:owner': false,
    'is:creator': false,
    'is:banned': false,
  };
  @Input() request: boolean = false;

  @Output() invitationUpdated: EventEmitter<string> = new EventEmitter<
    string
  >();

  kickPrompt: boolean = false;
  kickBan: boolean = false;

  wasReInvited: boolean = false;

  showMenu: boolean = false;

  constructor(public service: GroupV2Service) {}

  toggleMenu(e) {
    e.stopPropagation();
    if (this.showMenu) {
      this.showMenu = false;

      return;
    }
    this.showMenu = true;
    // TODO: [emi] Maybe refresh state?
  }

  removePrompt() {
    this.showMenu = false;

    this.kickPrompt = true;
    this.kickBan = false;
  }

  cancelRemove() {
    this.kickPrompt = false;
  }

  kick(ban: boolean = false) {
    let action;

    this.kickPrompt = false;

    if (ban) {
      action = this.service.ban(this.group, this.user.guid);
    } else {
      action = this.service.kick(this.group, this.user.guid);
    }

    action.subscribe((response: any) => {
      this.user['is:member'] = !response.done;
      this.user['is:banned'] = response.done && ban;

      this.kickPrompt = !response.done;
      this.changeCounter('members:count', -1);
    });

    this.showMenu = false;
  }

  reInvite() {
    this.service.invite(this.group, this.user.username).subscribe(response => {
      if (response.done) {
        this.wasReInvited = true;
      } else {
        this.wasReInvited = false;
        throw response.error ? response.error : 'Internal error';
      }
    });

    this.showMenu = false;
  }

  grantOwnership() {
    this.user['is:owner'] = true;

    this.service
      .grantOwnership({ guid: this.group.guid }, this.user.guid)
      .subscribe((response: any) => {
        this.user['is:owner'] = !!response.done;
      });

    this.showMenu = false;
  }

  revokeOwnership() {
    this.user['is:owner'] = false;

    this.service
      .revokeOwnership({ guid: this.group.guid }, this.user.guid)
      .subscribe((response: any) => {
        this.user['is:owner'] = !response.done;
      });

    this.showMenu = false;
  }

  /**
   * Grant moderation
   */
  grantModerator() {
    this.user['is:moderator'] = true;

    this.service
      .grantModerator({ guid: this.group.guid }, this.user.guid)
      .subscribe((response: any) => {
        this.user['is:moderator'] = !!response.done;
      });

    this.showMenu = false;
  }

  /**
   * Revoke moderation
   */
  revokeModerator() {
    this.user['is:moderator'] = false;

    this.service
      .revokeModerator({ guid: this.group.guid }, this.user.guid)
      .subscribe((response: any) => {
        this.user['is:moderator'] = !response.done;
      });

    this.showMenu = false;
  }

  acceptRequest() {
    this.service.acceptRequest(this.user.guid);
    this.invitationUpdated.emit(this.user.guid);
  }

  rejectRequest() {
    this.service.rejectRequest(this.user.guid);
    this.invitationUpdated.emit(this.user.guid);
  }

  private changeCounter(counter: string, val = 0) {
    if (typeof this.group[counter] !== 'undefined') {
      this.group[counter] = parseInt(this.group[counter], 10) + val;
    }
  }
}
