import { Component, OnInit } from '@angular/core';

import { Client } from '../../../services/api/client';
import { REPORT_ACTIONS } from '../../../services/list-options';
import { JurySessionService } from '../juryduty/session/session.service';
import { ToasterService } from '../../../common/services/toaster.service';

/**
 * Dashboard that displays various disciplinary measures taken against your channel.
 *
 * Includes tabs to filter by different types/states
 * of infractions.
 *
 * See it at /settings/other/reported-content
 */
@Component({
  selector: 'm-report-console',
  templateUrl: 'console.component.html',
})
export class ReportConsoleComponent implements OnInit {
  filter: string = 'review';

  appeals: any[] = [];

  inProgress: boolean = false;
  offset: string = '';
  moreData: boolean = true;

  constructor(
    private client: Client,
    public service: JurySessionService,
    protected toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.load(true);
  }

  setFilter(filter: string) {
    this.filter = filter;
    this.load(true);
  }

  async load(refresh: boolean = false) {
    if (refresh) {
      this.inProgress = false;
      this.offset = '';
      this.moreData = true;
    }

    this.inProgress = true;

    try {
      /*let response: any = await this.client.get(`api/v1/entities/report/appeal/${this.filter}`, {
        limit: 12,
        offset: this.offset
      });*/
      let response: any = await this.client.get(
        `api/v2/moderation/appeals/${this.filter}`,
        {
          limit: 12,
          offset: this.offset,
        }
      );

      if (refresh) {
        this.appeals = [];
      }

      if (response.appeals) {
        this.appeals.push(...response.appeals);
      }

      if (response['load-next']) {
        this.offset = response['load-next'];
      } else {
        this.moreData = false;
      }
    } catch (e) {
      // TODO: show error
    } finally {
      this.inProgress = false;
    }
  }

  async sendAppeal(appeal, content: string, i: number) {
    appeal.inProgress = true;

    try {
      let response: any = await this.client.post(
        `api/v2/moderation/appeals/${appeal.report.urn}`,
        {
          note: content,
        }
      );

      this.appeals.splice(i, 1);
    } catch (e) {
      this.toasterService.error((e && e.message) || 'Error sending appeal');
    }
  }

  parseAction(action: string) {
    return typeof REPORT_ACTIONS[action] !== 'undefined'
      ? REPORT_ACTIONS[action]
      : action;
  }
}
