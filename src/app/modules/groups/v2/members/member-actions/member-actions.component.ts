import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroupInviteService } from '../../invite/invite.service';
import { GroupService } from '../../group.service';
import { Session } from '../../../../../services/session';

/**
 * The meatball menu on a user in a group members list,
 * visible to those with access (admins and moderators?).
 * Contains a list of actions that relate to the user's place in the group
 *
 * This an old component copied from groups v1 with minor changes
 */
@Component({
  selector: 'm-group__memberActions',
  inputs: ['group', 'user'],
  templateUrl: './member-actions.component.html',
  styleUrls: ['./member-actions.component.ng.scss'],
})
export class GroupMemberActionsComponent {
  @Input() group: any = {};
  @Input() user: any = {
    'is:member': false,
    'is:moderator': false,
    'is:owner': false,
    'is:creator': false,
    'is:banned': false,
  };

  kickPrompt: boolean = false;
  kickBan: boolean = false;

  wasReInvited: boolean = false;

  /**
   * Emit when a user has been removed from the group
   */
  @Output() onKick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emit when members and/or their roles have changed
   * Used to sync sidebar mods list and main members list
   */
  @Output() memberChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public service: GroupService,
    private inviteService: GroupInviteService,
    private session: Session
  ) {}

  removePrompt() {
    this.kickPrompt = true;
    this.kickBan = false;
  }

  cancelRemove() {
    this.kickPrompt = false;
  }

  async kick(ban: boolean = false) {
    let kicked;

    this.kickPrompt = false;

    if (ban) {
      kicked = await this.service.ban(this.user.guid);
    } else {
      kicked = await this.service.kick(this.user.guid);
    }

    this.user['is:member'] = !kicked;
    this.user['is:banned'] = kicked && ban;

    this.kickPrompt = !kicked;
    this.service.memberCount$.next(this.service.memberCount$.getValue() - 1);

    this.onKick.emit({ userGuid: this.user.guid });
    this.memberChanged.emit(this.user);
  }

  async reInvite() {
    await this.inviteService.invite(this.user);
    this.wasReInvited = true;
    this.memberChanged.emit(this.user);
  }

  async grantOwnership() {
    await this.service.grantOwnership(this.user.guid);
    this.user['is:owner'] = true;
    this.memberChanged.emit(this.user);
  }

  async revokeOwnership() {
    await this.service.revokeOwnership(this.user.guid);
    this.user['is:owner'] = false;
    if (this.user.guid === this.session.getLoggedInUser().guid) {
      // Refresh permissions everywhere if you've revoked your own ownership
      this.service.sync();
    }
    this.memberChanged.emit(this.user);
  }

  async grantModerator() {
    await this.service.grantModerator(this.user.guid);
    this.user['is:moderator'] = true;
    this.memberChanged.emit(this.user);
  }

  async revokeModerator() {
    await this.service.revokeModerator(this.user.guid);
    this.user['is:moderator'] = false;
    this.memberChanged.emit(this.user);
  }
}
