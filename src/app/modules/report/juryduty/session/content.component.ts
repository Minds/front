import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';

import { JurySessionService } from './session.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'm-juryDutySession__content',
  templateUrl: 'content.component.html',
})
export class JuryDutySessionContentComponent {
  @Input() report;
  decided: boolean = false;

  constructor(
    private sessionService: JurySessionService,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

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
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (confirm('Are you sure?')) {
      this.decided = true;
      await this.sessionService.overturn(this.report);
    }
  }

  /**
   * Uphold a report.
   * @returns { Promise<void> }
   */
  async uphold(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (confirm('Are you sure?')) {
      this.decided = true;
      await this.sessionService.uphold(this.report);
    }
  }
}
