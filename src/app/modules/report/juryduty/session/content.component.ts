import { Component, Input } from '@angular/core';
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

  /**
   * Overturn a report.
   * @returns { Promise<void> }
   */
  async overturn() {
    this.decided = true;
    await this.sessionService.overturn(this.report);
  }

  /**
   * Uphold a report.
   * @returns { Promise<void> }
   */
  async uphold(): Promise<void> {
    this.decided = true;
    await this.sessionService.uphold(this.report);
  }
}
