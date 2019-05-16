import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

import { Client } from '../../../services/api/client';
import { REASONS, REPORT_ACTIONS } from '../../../services/list-options';
import { JurySessionService } from '../juryduty/session/session.service';

@Component({
  selector: 'm-moderation__appeal',
  templateUrl: 'appeal.component.html'
})
export class ModerationAppealComponent {

  @Input() appeal;
  note: string;

  constructor(
    private client: Client,
    public service: JurySessionService,
  ) { }

  async sendAppeal() {
    this.appeal.inProgress = true;

    try {
      let response: any = await this.client.post(`api/v2/moderation/appeals/${this.appeal.report.urn}`, {
        note: this.note,
      });

      this.appeal.note = this.note;
    } catch (e) {
      alert((e && e.message) || 'Error sending appeal');
    }
  }

  parseAction(action: string) {
    return typeof REPORT_ACTIONS[action] !== 'undefined' ?
      REPORT_ACTIONS[action] :
      action;
  }

}
