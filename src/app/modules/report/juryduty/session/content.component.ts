import { Component, Input } from '@angular/core';
import { JurySessionService } from './session.service';

@Component({
  selector: 'm-juryDutySession__content',
  templateUrl: 'content.component.html',
})
export class JuryDutySessionContentComponent {
  @Input() report;
  decided: boolean = false;
  showOriginal: boolean = true;

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

  toggleVersion() {
    this.showOriginal = !this.showOriginal;
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
