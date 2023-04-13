import { Component, Input, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../../services/api/client';
import { REPORT_ACTIONS } from '../../../services/list-options';
import { JurySessionService } from '../juryduty/session/session.service';
import { ToasterService } from '../../../common/services/toaster.service';

/**
 * Displays details of action taken against
 * a reported post/comment. Allows users to
 * appeal the decision and explain why.
 *
 * Includes a preview of the reported post/comment
 * with restricted interactivity (no toolbar, comments)
 */
@Component({
  selector: 'm-moderation__appeal',
  templateUrl: 'appeal.component.html',
  styleUrls: ['appeal.component.ng.scss'],
})
export class ModerationAppealComponent {
  @Input() appeal;
  note: string;

  protected displayOptions = {
    isFeed: true,
    showComments: false,
    autoplayVideo: false,
    showToolbar: false,
    showPostMenu: false,
    bypassMediaModal: true,
  };

  constructor(
    private client: Client,
    public service: JurySessionService,
    private cd: ChangeDetectorRef,
    protected toasterService: ToasterService
  ) {}

  async sendAppeal() {
    this.appeal.inProgress = true;

    try {
      let response: any = await this.client.post(
        `api/v2/moderation/appeals/${this.appeal.report.urn}`,
        {
          note: this.note,
        }
      );

      this.appeal.note = this.note;

      this.detectChanges();
    } catch (e) {
      this.toasterService.error((e && e.message) || 'Error sending appeal');
    } finally {
      this.appeal.inProgress = false;
    }
  }

  parseAction(action: string) {
    return typeof REPORT_ACTIONS[action] !== 'undefined'
      ? REPORT_ACTIONS[action]
      : action;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
