import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';

import { JurySessionService } from './session.service';
import { isPlatformBrowser } from '@angular/common';
import { FormToastService } from '../../../../common/services/form-toast.service';
import {
  Reason,
  ReportService,
} from '../../../../common/services/report.service';

@Component({
  selector: 'm-juryDutySession__content',
  templateUrl: 'content.component.html',
  styleUrls: ['content.component.scss'],
})
export class JuryDutySessionContentComponent {
  @Input() report;
  decided: boolean = false;
  changeReportReason: boolean = false;
  reasons = this.reportService.reasons;

  private previousSelectedReason: Reason | null = null;
  private selectedReason: Reason | null = null;
  private selectedSubReason: Reason | null = null;

  constructor(
    private sessionService: JurySessionService,
    private toast: FormToastService,
    @Inject(PLATFORM_ID) protected platformId: Object,
    private reportService: ReportService
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
      try {
        await this.sessionService.overturn(this.report);
        this.decided = true;
      } catch (e) {
        console.error(e);
        this.toast.error(e?.message ?? 'An unknown error has occurred');
      }
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
    let confirmMessage = 'Are you sure?';
    let adminReasonOverride = null;
    if (this.selectedReason && !this.report.is_appeal) {
      adminReasonOverride = `${this.selectedReason.value}`;
      let adminReasonOverrideLabel = this.selectedReason.label;

      if (this.selectedSubReason) {
        adminReasonOverrideLabel = `${adminReasonOverrideLabel} - ${this.selectedSubReason.label}`;
        adminReasonOverride = `${adminReasonOverride}.${this.selectedSubReason.value}`;
      }
      confirmMessage = `You have selected to override the report reason from ${this.getReasonString(
        this.report
      )} to ${adminReasonOverrideLabel}
      \nAre you sure you want to uphold this report?`;
    }

    if (confirm(confirmMessage)) {
      try {
        await this.sessionService.uphold(this.report, adminReasonOverride);
        this.decided = true;
      } catch (e) {
        console.error(e);
        this.toast.error(e?.message ?? 'An unknown error has occurred');
      }
    }
  }

  toggleChangeReportReason(): void {
    this.changeReportReason = !this.changeReportReason;
    this.selectedReason = this.changeReportReason ? this.reasons[0] : null;
    this.selectedSubReason = this.selectedReason.hasMore
      ? (this.selectedReason.reasons[0] as Reason)
      : null;
  }

  updateReasonSelection($event): void {
    if (($event.option as Reason) === this.previousSelectedReason) {
      return;
    }

    this.previousSelectedReason = this.selectedReason;
    this.selectedReason = $event.option as Reason;
    this.selectedSubReason = this.selectedReason.hasMore
      ? (this.selectedReason.reasons[0] as Reason)
      : null;
  }

  updateSubReasonSelection($event): void {
    this.selectedSubReason = $event.option as Reason;
  }
}
