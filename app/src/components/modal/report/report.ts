import { Component, EventEmitter } from '@angular/core';
import { Client } from '../../../services/api';

@Component({
  selector: 'm-modal-report',
  inputs: [ 'open', '_object: object' ],
  outputs: ['closed'],
  template: `
    <m-modal [open]="open" (closed)="close($event)" class="mdl-color-text--blue-grey-700">

      <div [hidden]="sent" class="m-modal-report-body">
        <h3 class="m-modal-report-title" i18n>Report</h3>

        <div *ngFor="let item of subjects" class="m-modal-report-reason mdl-color-text--blue-grey-900">
          <input type="radio"
            [disabled]="inProgress"
            [ngModel]="{ checked: subject == item.value }"
            (ngModelChange)="subject = item.value"
            name="subject"
            value="{{ item.value }}"
            />
          <label (click)="subject = item.value">{{ item.label }}</label>
        </div>

        <div class="m-modal-report-buttons">
          <button class="mdl-button mdl-button--raised" [disabled]="inProgress" (click)="send()">
            <!-- i18n -->Send<!-- /i18n -->
          </button>
        </div>
      </div>

      <div [hidden]="!sent" class="m-modal-report-body">
        <h3 class="m-modal-report-title" i18n>Report</h3>
        <p>
          <!-- i18n -->Thanks for letting us know! We appreciate your effort to keep Minds safe and secure.<!-- /i18n -->
        </p>

        <p>
          <!-- i18n -->We will review your report as soon as possible.<!-- /i18n -->
        </p>

        <div class="m-modal-report-buttons">
          <button class="mdl-button mdl-button--raised" (click)="close()">
            <!-- i18n -->Close<!-- /i18n -->
          </button>
        </div>
      </div>

    </m-modal>
  `
})

export class ReportModal {

  open : boolean = false;
  closed : EventEmitter<any> = new EventEmitter();
  object : any = {};

  inProgress: boolean = false;
  sent: boolean = false;
  subject: string = '';

  subjects: any[] = [
    { value: 'spam', label: 'It\'s spam' },
    { value: 'sensitive', label: 'It displays a sensitive image' },
    { value: 'abusive', label: 'It\'s abusive or harmful' },
    { value: 'annoying', label: 'It shouldn\'t be on Minds' }
  ];

  constructor(public client: Client) {
  }

  set _object(object: any){
    this.object = object;
  }

  close(e?){
    this.open = false;
    this.closed.next(true);
  }

  send(){
    this.inProgress = true;

    let subject = this.subject;

    if (!subject || !this.object.guid) {
      return;
    }

    this.client.post(`api/v1/entities/report/${this.object.guid}`, { subject })
    .then((response: any) => {
      this.inProgress = false;

      if (response.done) {
        this.sent = true;
      } else {
        this.close();
        alert('There was an error sending your report.');
      }
    })
    .catch(e => {
      this.inProgress = false;
      this.close();
      alert(e.message ? e.message : e);
    });
  }

}
