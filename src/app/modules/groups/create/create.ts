import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { GroupsService } from '../groups-service';

import { Session } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'minds-groups-create',
  host: {
    '(keydown)': 'keyDown($event)',
  },
  templateUrl: 'create.html',
})
export class GroupsCreator {
  banner: any = false;
  avatar: any = false;
  group: any = {
    name: '',
    description: '',
    membership: 2,
    tags: '',
    invitees: '',
    moderated: 0,
    default_view: 0,
  };
  invitees: Array<any> = [];
  editing: boolean = true;
  editDone: boolean = false;
  inProgress: boolean = false;

  constructor(
    public session: Session,
    public service: GroupsService,
    public router: Router,
    private groupsService: GroupsService
  ) {}

  addBanner(banner: any) {
    this.banner = banner.file;
    this.group.banner_position = banner.top;
  }

  addAvatar(avatar: any) {
    this.avatar = avatar;
  }

  membershipChange(value) {
    this.group.membership = value;
  }

  invite(user: any) {
    for (let i of this.invitees) {
      if (i.guid === user.guid) return;
    }
    this.invitees.push(user);
  }

  removeInvitee(i) {
    this.invitees.splice(i, 1);
  }

  keyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      return false;
    }
  }

  save(e) {
    if (!this.group.name) {
      return;
    }

    this.editing = false;
    this.editDone = true;
    this.inProgress = true;

    this.group.invitees = this.invitees.map(user => {
      return user.guid;
    });

    this.service
      .save(this.group)
      .then((guid: any) => {
        this.service
          .upload(
            {
              guid,
              banner_position: this.group.banner_position,
            },
            {
              banner: this.banner,
              avatar: this.avatar,
            }
          )
          .then(() => {
            this.groupsService.updateMembership(true, guid);
            this.router.navigate(['/groups/profile', guid]);
          });
      })
      .catch(e => {
        this.editing = true;
        this.inProgress = false;
      });
  }

  onTagsChange(tags) {}

  onTagsAdded(tags) {
    if (!this.group.tags) this.group.tags = [];

    for (let tag of tags) {
      this.group.tags.push(tag.value);
    }
  }

  onTagsRemoved(tags) {
    for (let tag of tags) {
      for (let i in this.group.tags) {
        console.log(this.group.tags[i]);
        if (this.group.tags[i] == tag.value) {
          this.group.tags.splice(i, 1);
        }
      }
    }
  }
}
