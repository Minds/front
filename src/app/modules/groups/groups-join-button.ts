import { Component, Inject, EventEmitter } from '@angular/core';

import { GroupsService } from './groups-service';
import { Session } from '../../services/session';

@Component({
  selector: 'minds-groups-join-button',

  inputs: ['_group: group'],
  outputs: ['membership'],
  template: `
    <button class="m-btn m-btn--slim m-btn--join-group"
      *ngIf="!group['is:banned'] && !group['is:awaiting']
        && !group['is:invited'] && !group['is:member']"
        (click)="join()" i18n="@@GROUPS__JOIN_BUTTON__JOIN_ACTION"
      >
      Join
    </button>
    <span *ngIf="group['is:invited'] &amp;&amp; !group['is:member']">
      <button class="m-btn m-btn--slim m-btn--action" (click)="accept()" i18n="@@M__ACTION__ACCEPT">Accept</button>
      <button class="m-btn m-btn--slim m-btn--action" (click)="decline()" i18n="@@GROUPS__JOIN_BUTTON__DECLINE_ACTION">Decline</button>
    </span>
    <button class="m-btn m-btn--slim subscribed " *ngIf="group['is:member']" (click)="leave()" i18n="@@GROUPS__JOIN_BUTTON__LEAVE_ACTION">Leave</button>
    <button class="m-btn m-btn--slim awaiting" *ngIf="group['is:awaiting']" (click)="cancelRequest()" i18n="@@GROUPS__JOIN_BUTTON__CANCEL_REQ_ACTION">Cancel request</button>
    <m-modal-signup-on-action
      [open]="showModal"
      (closed)="showModal = false"
      action="join a group"
      i18n-action="@@GROUPS__JOIN_BUTTON__JOIN_A_GROUP_TITLE"
      [overrideOnboarding]="true"
      *ngIf="!session.isLoggedIn()">
    </m-modal-signup-on-action>
  `
})

export class GroupsJoinButton {

  minds;
  showModal: boolean = false;
  group: any;
  membership: EventEmitter<any> = new EventEmitter();


  constructor(public session: Session, public service: GroupsService) {
    this.minds = window.Minds;
  }

  set _group(value: any) {
    this.group = value;
  }

  /**
   * Check if is a member
   */
  isMember() {
    if (this.group['is:member'])
      return true;
    return false;
  }

  /**
   * Check if the group is closed
   */
  isPublic() {
    if (this.group.membership !== 2)
      return false;
    return true;
  }

  /**
   * Join a group
   */
  join() {
    if (!this.session.isLoggedIn()) {
      this.showModal = true;
      return;
    }

    if (this.isPublic()) {
      this.group['is:member'] = true;
    }

    this.service.join(this.group)
      .then(() => {
        if (this.isPublic()) {
          this.group['is:member'] = true;
          this.membership.next({
            member: true
          });
          return;
        }
        this.membership.next({});
        this.group['is:awaiting'] = true;
      })
      .catch(e => {
        this.group['is:member'] = false;
        this.group['is:awaiting'] = false;
      });
  }

  /**
   * Leave a group
   */
  leave() {
    this.service.leave(this.group)
      .then(() => {
        this.group['is:member'] = false;
        this.membership.next({
          member: false
        });
      })
      .catch(e => {
        this.group['is:member'] = true;
      });
  }

  /**
   * Accept joining a group
   */
  accept() {
    this.group['is:member'] = true;
    this.group['is:invited'] = false;

    this.service.acceptInvitation(this.group)
      .then((done: boolean) => {
        this.group['is:member'] = done;
        this.group['is:invited'] = !done;

        if (done) {
          this.membership.next({
            member: true
          });
        }
      });
  }

  /**
   * Cancel a group joining request
   */
  cancelRequest() {
    this.group['is:awaiting'] = false;

    this.service.cancelRequest(this.group)
      .then((done: boolean) => {
        this.group['is:awaiting'] = !done;
      });
  }

  /**
   * Decline joining a group
   */
  decline() {
    this.group['is:member'] = false;
    this.group['is:invited'] = false;

    this.service.declineInvitation(this.group)
      .then((done: boolean) => {
        this.group['is:member'] = false;
        this.group['is:invited'] = !done;
      });
  }

}
