import { ReportService } from './../../../common/services/report.service';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { MindsUser } from '../../../interfaces/entities';
import { FormToastService } from '../../../common/services/form-toast.service';
import { ModalService } from '../../../services/ux/modal.service';
import noOp from '../../../helpers/no-op';

@Component({
  moduleId: module.id,
  selector: 'm-modal--ban',
  templateUrl: 'modal.component.html',
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
  subjects = this.reportService.reasons;

  next: boolean = false;

  setModalData({ user, onDismiss }) {
    this.user = user;
    this.guid = user ? user.guid : null;
    this.close = onDismiss || noOp;
  }

  constructor(
    public session: Session,
    private _changeDetectorRef: ChangeDetectorRef,
    private modalService: ModalService,
    private client: Client,
    protected toasterService: FormToastService,
    private reportService: ReportService
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
      if (!this.inProgress) {
        this.toasterService.error(this.error);
      }
    }
  }

  onSelectionChange(item) {
    this.subject = item.value;
  }

  close() {}

  /**
   * Submits the report to the appropiate server endpoint using the current settings
   */
  submit() {
    let guid = this.guid;
    let subject = this.subject - 1;
    let note = this.note;

    this.inProgress = true;

    this.client
      .put(`api/v1/admin/ban/${this.guid}`, {
        subject: this.subjects[subject],
        note,
      })
      .then(() => {
        this.inProgress = false;
        this.user.banned = 'yes';
        this.success = true;
        this.close();
      })
      .catch(e => {
        this.inProgress = false;
        this.user.banned = 'no';

        this.toasterService.error(e.message ? e.message : e);
      });
  }
}
