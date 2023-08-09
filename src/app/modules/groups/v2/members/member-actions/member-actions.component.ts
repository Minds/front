import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MindsGroup } from '../../../../../interfaces/entities';
import { GroupInviteService } from '../../invite/invite.service';
import { GroupService } from '../../group.service';

/**
 * The meatball menu on a user in a group members list,
 * visible to those with access (admins and moderators?).
 * Contains a list of actions that relate to the user's place in the group
 *
 * (This is mostly an old component that was moved to groups v2 with minor changes)
 */
@Component({
  selector: 'm-group__memberActions',
  inputs: ['group', 'user'],
  templateUrl: './member-actions.component.html',
  styleUrls: ['./member-actions.component.ng.scss'],
})
export class GroupMemberActionsComponent {
  group: any = {};
  user: any = {
    'is:member': false,
    'is:moderator': false,
    'is:owner': false,
    'is:creator': false,
    'is:banned': false,
  };

  kickPrompt: boolean = false;
  kickBan: boolean = false;

  wasReInvited: boolean = false;

  @Output('onKick') onKick: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public service: GroupService,
    private inviteService: GroupInviteService
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
    this.changeCounter('members:count', -1);

    this.onKick.emit({ userGuid: this.user.guid });
  }

  async reInvite() {
    await this.inviteService.invite(this.user);
    this.wasReInvited = true;
  }

  async grantOwnership() {
    await this.service.grantOwnership(this.user.guid);
    this.user['is:owner'] = true;
  }

  async revokeOwnership() {
    await this.service.revokeOwnership(this.user.guid);
    this.user['is:owner'] = false;
  }

  /**
   * Grant moderation
   */
  async grantModerator() {
    await this.service.grantModerator(this.user.guid);
    this.user['is:moderator'] = true;
  }

  /**
   * Revoke moderation
   */
  async revokeModerator() {
    await this.service.revokeModerator(this.user.guid);
    this.user['is:moderator'] = false;
  }

  private changeCounter(counter: string, val = 0) {
    if (typeof this.group[counter] !== 'undefined') {
      this.group[counter] = parseInt(this.group[counter], 10) + val;
    }
  }
}
