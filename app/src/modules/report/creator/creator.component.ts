import { Component, Input, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { REASONS } from '../../../services/list-options';

@Component({
  moduleId: module.id,
  selector: 'm-report--creator',
  templateUrl: 'creator.component.html'
})

export class ReportCreatorComponent implements AfterViewInit {

  subject: number = 0;
  note: string = '';
  guid: string = '';

  initialized: boolean = false;
  inProgress: boolean = false;

  success: boolean = false;
  error: string = '';
  subjects = REASONS;

  next: boolean = false;

  @Input('object') set data(object) {
    this.guid = object ? object.guid : null;
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
    let subject = this.subject;
    let note = this.note;


    this.inProgress = true;

    this.client.post(`api/v1/entities/report/${guid}`, { subject, note })
      .then((response: any) => {
        this.inProgress = false;
        if (response.done) {
          this.success = true;
        } else {
          this.overlayModal.dismiss();
          alert('There was an error sending your report.');
        }
      })
      .catch(e => {
        this.inProgress = false;
        //this.overlayModal.dismiss();
        alert(e.message ? e.message : e);
      });
  }
}
