//

import { Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { UserAvatarService } from '../../services/user-avatar.service';
import { of, Observable } from 'rxjs';
import { ConfigsService } from '../../services/configs.service';
import { Session } from '../../../services/session';

/** Object that can be passed in to display an avatar. */
export type MindsAvatarObject = {
  guid: string;
  type: 'user' | 'group';
  icontime?: number;
};

/**
 * Displays the avatar for a channel
 *
 * Also includes an edit mode, to upload a new image
 *
 * TODO: retire this component and make a new one instead
 */
@Component({
  selector: 'minds-avatar',
  inputs: [
    '_object: object',
    '_src: src',
    '_editMode: editMode',
    'waitForDoneSignal',
    'showPrompt',
  ],
  outputs: ['added'],
  templateUrl: 'avatar.html',
  styleUrls: ['avatar.ng.scss'],
})
export class MindsAvatar {
  readonly cdnAssetsUrl: string;
  readonly cdnUrl: string;
  object;
  editing: boolean = false;
  waitForDoneSignal: boolean = true;
  src: string = '';
  index: number = 0;
  icon: string = 'camera';
  showPrompt: boolean = true;
  file: any;
  added: EventEmitter<any> = new EventEmitter();

  @ViewChild('file') fileInput: ElementRef;

  constructor(
    public userAvatarService: UserAvatarService,
    configs: ConfigsService,
    private session: Session
  ) {
    this.cdnUrl = configs.get('cdn_url');
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  set _object(value: any) {
    if (!value) return;
    value.icontime = value.icontime ? value.icontime : '';
    this.object = value;

    if (this.object.type !== 'user') {
      this.src = `${this.cdnUrl}fs/v1/avatars/${this.object.guid}/large/${this.object.icontime}`;
    } else if (
      !this.session.getLoggedInUser() ||
      this.object.guid !== this.session.getLoggedInUser().guid
    ) {
      this.src = `${this.cdnUrl}icon/${this.object.guid}/large/${this.object.icontime}`;
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

  openFileDialog() {
    this.fileInput.nativeElement.click();
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
    return (
      this.session.getLoggedInUser() &&
      this.object &&
      this.object.guid === this.session.getLoggedInUser().guid
    );
  }
}
