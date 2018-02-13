import { Component, Input, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { REASONS } from '../../../services/list-options';
import { MindsUser } from '../../../interfaces/entities';

@Component({
  moduleId: module.id,
  selector: 'm-modal--ban',
  templateUrl: 'modal.component.html'
})

export class BanModalComponent implements AfterViewInit {

  subject: number = 0;
  note: string = '';
  user: MindsUser;
  guid: string = '';

  initialized: boolean = false;
  inProgress: boolean = false;

  success: boolean = false;
  error: string = '';
  subjects = REASONS;

  next: boolean = false;

  @Input('object') set data(user) {
    this.user = user;
    this.guid = user ? user.guid : null;
  }

  constructor(
    public session: Session,
    private _changeDetectorRef: ChangeDetectorRef,
    private overlayModal: OverlayModalService,
    private client: Client,
  ) { }

  ngAfterViewInit() {
    this._changeDetectorRef.detectChanges();
  }

  /**
   * Validates if the report can be submitted using the current settings
   */
  validate() {
    if (!this.subject) {
      return false;
      //throw new Error('You cannot report this.');
    }
    return true;
  }

  /**
   * Checks if the user can submit using the current settings
   */
  canSubmit() {
    try {
      return this.validate();
    } catch (e) {
      return false;
    }
  }

  /**
   * Shows visible report errors
   */
  showErrors() {
    this.error = '';

    try {
      this.validate();
    } catch (e) {
      this.error = e.message;
    }
  }


  onSelectionChange(item) {
    this.subject = item.value;
  }

  close() {
    this.overlayModal.dismiss();
  }

  /**
   * Submits the report to the appropiate server endpoint using the current settings
   */
  submit() {
    let guid = this.guid;
    let subject = this.subject -1;
    let note = this.note;

    this.inProgress = true;

    this.client.put(`api/v1/admin/ban/${this.guid}`, { 'subject': this.subjects[subject], note })
      .then(() => {
        this.inProgress = false;
        this.user.banned = 'yes';
        this.success = true;
        this.overlayModal.dismiss();
      })
      .catch(e => {
        this.inProgress = false;
        this.user.banned = 'no';

        alert(e.message ? e.message: e);
      });
  }
}
