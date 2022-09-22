import { Component, EventEmitter, Output } from '@angular/core';

import { GroupsService } from '../groups.service';

/**
 * The settings cog on a user in a group members list,
 * visible to those with access (admins and moderators?).
 * Contains a list of actions that relate to the user's place in the group
 */
@Component({
  selector: 'minds-groups-card-user-actions-button',
  inputs: ['group', 'user'],
  templateUrl: 'card-user-actions-button.html',
})
export class GroupsCardUserActionsButton {
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

  constructor(public service: GroupsService) {}

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
      kicked = await this.service.ban(this.group, this.user.guid);
    } else {
      kicked = await this.service.kick(this.group, this.user.guid);
    }

    this.user['is:member'] = !kicked;
    this.user['is:banned'] = kicked && ban;

    this.kickPrompt = !kicked;
    this.changeCounter('members:count', -1);

    this.onKick.emit({ userGuid: this.user.guid });
  }

  reInvite() {
    this.service
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

    this.service
      .grantOwnership({ guid: this.group.guid }, this.user.guid)
      .then((isOwner: boolean) => {
        this.user['is:owner'] = isOwner;
      });
  }

  revokeOwnership() {
    this.user['is:owner'] = false;

    this.service
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

    this.service
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

    this.service
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
