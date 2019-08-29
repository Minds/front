import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { REASONS } from '../../../services/list-options';
import { EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'm-report--creator',
  templateUrl: 'creator.component.html',
})
export class ReportCreatorComponent implements AfterViewInit {
  subject = {
    value: null,
    hasMore: false,
  };
  subReason = {
    value: null,
  };

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

  _opts: any;

  set opts(opts: any) {
    this._opts = opts;
  }

  constructor(
    public session: Session,
    private _changeDetectorRef: ChangeDetectorRef,
    private overlayModal: OverlayModalService,
    private client: Client
  ) {}

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
    if (this.subject.hasMore && this.next && !this.subReason.value) {
      return false;
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

  setSubject(subject) {
    this.subject = subject;
  }

  setSubReason(reason) {
    this.subReason = reason;
  }

  //onSelectionChange(item) {
  //  this.subject = item.value;
  //}

  close() {
    this.overlayModal.dismiss();
  }

  /**
   * Submits the report to the appropiate server endpoint using the current settings
   */
  async submit() {
    this.inProgress = true;

    try {
      let response: any = await this.client.post(`api/v2/moderation/report`, {
        entity_guid: this.guid,
        reason_code: this.subject.value,
        note: this.note,
        sub_reason_code: this.subReason.value,
      });

      this.inProgress = false;
      this.success = true;

      if (this.session.isAdmin()) {
        this.close();
      }

      if (this._opts && this._opts.onReported) {
        this._opts.onReported(
          this.guid,
          this.subject.value,
          this.subReason.value
        );
      }
    } catch (e) {
      this.inProgress = false;
      //this.overlayModal.dismiss();\
      alert('There was an error sending your report.');
      alert(e.message ? e.message : e);
    }
  }
}
