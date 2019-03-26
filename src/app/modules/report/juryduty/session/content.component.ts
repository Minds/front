import { Component, Input, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { REASONS } from '../../../../services/list-options';
import { JurySessionService } from './session.service';

@Component({
  selector: 'm-juryDutySession__content',
  templateUrl: 'content.component.html'
})

export class JuryDutySessionContentComponent {

  @Input() report;
  decided: boolean = false;

  constructor(
    private sessionService: JurySessionService,
  ) {

  }

  getReasonString(report) {
    let friendlyString = 'removed';
    
    switch (report.reason_code) {
      case 1:
        if (report.sub_reason_code) {
          friendlyString = REASONS[0].reasons[report.sub_reason_code-1].label;
          break;
        }
        friendlyString = 'being illegal';
        break;
      case 2:
        friendlyString = REASONS[1].reasons[report.sub_reason_code-1].label;
        break;
    }

    return friendlyString;
  }

  getAction(report) {
    let friendlyString = report.entity.type == 'user' ? 'banned' : 'removed';
    
    switch (report.reason_code) {
      case 2: 
        friendlyString = 'marked NSFW';
        break;
    }

    return friendlyString;
  }

 async overturn() {
    this.decided = true;
    await this.sessionService.overturn(this.report);
  }

  async uphold() {
    this.decided = true;
    await this.sessionService.uphold(this.report);
  }

}
