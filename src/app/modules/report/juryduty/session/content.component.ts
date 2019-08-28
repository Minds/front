import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { REASONS } from '../../../../services/list-options';
import { JurySessionService } from './session.service';

@Component({
  selector: 'm-juryDutySession__content',
  templateUrl: 'content.component.html',
})
export class JuryDutySessionContentComponent {
  @Input() report;
  decided: boolean = false;

  constructor(private sessionService: JurySessionService) {}

  getReasonString(report) {
    return this.sessionService.getReasonString(report);
  }

  getAction(report) {
    let friendlyString =
      report.entity && report.entity.type == 'user' ? 'banned' : 'removed';

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
