import { Component, EventEmitter } from '@angular/core';
import { UserAvatarService } from '../../services/user-avatar.service';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'minds-avatar',
  inputs: [
    '_object: object',
    '_src: src',
    '_editMode: editMode',
    'waitForDoneSignal',
    'icon',
    'showPrompt',
  ],
  outputs: ['added'],
  template: `
    <div
      class="minds-avatar"
      [ngStyle]="{ 'background-image': 'url(' + (getSrc() | async) + ')' }"
    >
      <img
        *ngIf="!(userAvatarService.src$ | async)"
        src="{{ minds.cdn_assets_url }}assets/avatars/blue/default-large.png"
        class="mdl-shadow--4dp"
      />
      <div *ngIf="editing" class="overlay">
        <i class="material-icons">{{ icon }}</i>
        <ng-container *ngIf="showPrompt">
          <span
            *ngIf="userAvatarService.src$ | async"
            i18n="@@COMMON__AVATAR__CHANGE"
            >Change avatar</span
          >
          <span
            *ngIf="!(userAvatarService.src$ | async)"
            i18n="@@COMMON__AVATAR__ADD"
            >Add an avatar</span
          >
        </ng-container>
      </div>
      <input *ngIf="editing" type="file" #file (change)="add($event)" />
    </div>
  `,
})
export class MindsAvatar {
  minds: Minds = window.Minds;
  object;
  editing: boolean = false;
  waitForDoneSignal: boolean = true;
  src: string = '';
  index: number = 0;
  icon: string = 'camera';
  showPrompt: boolean = true;
  file: any;
  added: EventEmitter<any> = new EventEmitter();

  constructor(public userAvatarService: UserAvatarService) {}

  set _object(value: any) {
    if (!value) return;
    value.icontime = value.icontime ? value.icontime : '';
    this.object = value;

    if (this.object.type !== 'user') {
      this.src = `${this.minds.cdn_url}fs/v1/avatars/${this.object.guid}/large/${this.object.icontime}`;
    } else if (!this.minds.user || this.object.guid !== this.minds.user.guid) {
      this.src = `${this.minds.cdn_url}icon/${this.object.guid}/large/${this.object.icontime}`;
    }
  }

  set _src(value: any) {
    this.src = value;
  }

  set _editMode(value: boolean) {
    this.editing = value;
    if (!this.editing && this.file) this.done();
  }

  /**
   * New avatar added.
   * @param e - the element.
   */
  add(e) {
    if (!this.editing) return;

    var element: any = e.target ? e.target : e.srcElement;
    this.file = element ? element.files[0] : null;

    /**
     * Set a live preview
     */
    var reader = new FileReader();
    reader.onloadend = () => {
      this.src =
        typeof reader.result === 'string'
          ? reader.result
          : reader.result.toString();
      if (this.object.type === 'user' && this.isOwnerAvatar()) {
        this.userAvatarService.src$.next(this.src);
      }
    };
    reader.readAsDataURL(this.file);

    element.value = '';

    console.log(this.waitForDoneSignal);
    if (this.waitForDoneSignal !== true) this.done();
  }

  /**
   * Called upon being done.
   */
  done() {
    console.log('sending done');
    this.added.next(this.file);
    this.file = null;
  }

  /**
   * Gets the src of the image
   * @returns { Observables<string> } the src for the image.
   */
  getSrc(): Observable<string> {
    return this.isOwnerAvatar() ? this.userAvatarService.src$ : of(this.src);
  }

  /**
   * Determined whether this is a users avatar.
   * @returns true if the object guid matches the currently logged in user guid
   */
  isOwnerAvatar(): boolean {
    return this.minds.user && this.object.guid === this.minds.user.guid;
  }
}
