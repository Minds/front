import {
  Component,
  Inject,
  EventEmitter,
  HostListener,
  HostBinding,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';

import { GroupsService } from './groups.service';
import { Session } from '../../services/session';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { ToasterService } from '../../common/services/toaster.service';

/**
 * Click this button to join/leave a group,
 * accept/decline a group invitation,
 * or cancel a request to join a group.
 * (function changes depending on context)
 */
@Component({
  selector: 'm-group__membershipButton',
  inputs: ['_group: group'],
  outputs: ['membership'],
  templateUrl: './group-membership-button.html',
})
export class GroupMembershipButton {
  showModal: boolean = false;
  group: any;
  membership: EventEmitter<any> = new EventEmitter();
  inProgress: boolean = false;

  @HostBinding('class.m-groupsJoin--iconsOnly')
  @Input()
  iconsOnly: boolean = false;

  constructor(
    public session: Session,
    public service: GroupsService,
    private router: Router,
    private loginReferrer: LoginReferrerService,
    private toast: ToasterService
  ) {}

  set _group(value: any) {
    this.group = value;
  }

  /**
   * Check if is a member
   */
  isMember() {
    if (this.group['is:member']) return true;
    return false;
  }

  /**
   * Check if the group is closed
   */
  isPublic() {
    if (this.group.membership !== 2) return false;
    return true;
  }

  /**
   * Join a group.
   * @param { MouseEvent } - mouse event.
   * @returns { void }
   */
  public join($event: MouseEvent = null): void {
    if ($event) {
      $event.preventDefault();
    }

    if (!this.session.isLoggedIn()) {
      //this.showModal = true;
      this.loginReferrer.register(
        `/groups/profile/${this.group.guid}/feed?join=true`
      );
      this.router.navigate(['/login']);
      return;
    }
    this.inProgress = true;
    this.service
      .join(this.group)
      .then(() => {
        this.inProgress = false;
        if (this.isPublic()) {
          this.group['is:member'] = true;
          this.membership.next({
            member: true,
          });
          return;
        }
        this.membership.next({});
        this.group['is:awaiting'] = true;
      })
      .catch(e => {
        let error = e.error;
        this.toast.error(
          error ?? 'An unknown error has occurred whilst joining'
        );

        switch (e.error) {
          case 'You are banned from this group':
            error = 'banned';
            break;
          case 'User is already a member':
            error = 'already_a_member';
            break;
          default:
            error = e.error;
            break;
        }
        this.group['is:member'] = false;
        this.group['is:awaiting'] = false;
        this.membership.next({ error: error });
        this.inProgress = false;
      });
  }

  /**
   * Leave a group
   */
  leave() {
    event.preventDefault();
    this.inProgress = true;

    this.service
      .leave(this.group)
      .then(() => {
        this.inProgress = false;
        this.group['is:member'] = false;
        this.membership.next({
          member: false,
        });
      })
      .catch(e => {
        this.group['is:member'] = true;
        this.inProgress = false;
      });
  }

  /**
   * Accept joining a group
   */
  accept() {
    this.group['is:member'] = true;
    this.group['is:invited'] = false;
    this.inProgress = true;

    this.service
      .acceptInvitation(this.group)
      .then((done: boolean) => {
        this.inProgress = false;
        this.group['is:member'] = done;
        this.group['is:invited'] = !done;

        if (done) {
          this.membership.next({
            member: true,
          });
        }
      })
      .catch(e => {
        this.inProgress = false;
      });
  }

  /**
   * Cancel a group joining request
   */
  cancelRequest() {
    this.group['is:awaiting'] = false;
    this.inProgress = true;

    this.service
      .cancelRequest(this.group)
      .then((done: boolean) => {
        this.inProgress = false;
        this.group['is:awaiting'] = !done;
      })
      .catch(e => {
        this.inProgress = false;
      });
  }

  /**
   * Decline joining a group
   */
  decline() {
    this.inProgress = true;
    this.group['is:member'] = false;
    this.group['is:invited'] = false;

    this.service
      .declineInvitation(this.group)
      .then((done: boolean) => {
        this.inProgress = false;
        this.group['is:member'] = false;
        this.group['is:invited'] = !done;
      })
      .catch(e => {
        this.inProgress = false;
      });
  }
}
