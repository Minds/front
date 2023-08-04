import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MindsGroup } from '../../../../../interfaces/entities';
import { GroupsService } from '../../../groups.service';

/**
 * The meatball menu on a user in a group members list,
 * visible to those with access (admins and moderators?).
 * Contains a list of actions that relate to the user's place in the group
 *
 * (This is an old component that was moved to groups v2 with v minor changes)
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

  // ojm this is the old groups service
  // ojm move these fxs to new groups service?
  constructor(public v1Service: GroupsService) {}

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
      kicked = await this.v1Service.ban(this.group, this.user.guid);
    } else {
      kicked = await this.v1Service.kick(this.group, this.user.guid);
    }

    this.user['is:member'] = !kicked;
    this.user['is:banned'] = kicked && ban;

    this.kickPrompt = !kicked;
    this.changeCounter('members:count', -1);

    this.onKick.emit({ userGuid: this.user.guid });
  }

  reInvite() {
    this.v1Service
      .invite(this.group, this.user.username)
      .then(() => {
        this.wasReInvited = true;
      })
      .catch(e => {
        this.wasReInvited = false;
      });
  }

  grantOwnership() {
    this.user['is:owner'] = true;

    this.v1Service
      .grantOwnership({ guid: this.group.guid }, this.user.guid)
      .then((isOwner: boolean) => {
        this.user['is:owner'] = isOwner;
      });
  }

  revokeOwnership() {
    this.user['is:owner'] = false;

    this.v1Service
      .revokeOwnership({ guid: this.group.guid }, this.user.guid)
      .then((isOwner: boolean) => {
        this.user['is:owner'] = isOwner;
      });
  }

  /**
   * Grant moderation
   */
  grantModerator() {
    this.user['is:moderator'] = true;

    this.v1Service
      .grantModerator({ guid: this.group.guid }, this.user.guid)
      .then((isModerator: boolean) => {
        this.user['is:moderator'] = isModerator;
      });
  }

  /**
   * Revoke moderation
   */
  revokeModerator() {
    this.user['is:moderator'] = false;

    this.v1Service
      .revokeModerator({ guid: this.group.guid }, this.user.guid)
      .then((isModerator: boolean) => {
        this.user['is:moderator'] = isModerator;
      });
  }

  private changeCounter(counter: string, val = 0) {
    if (typeof this.group[counter] !== 'undefined') {
      this.group[counter] = parseInt(this.group[counter], 10) + val;
    }
  }
}
