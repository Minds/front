import {Component, OnInit} from '@angular/core';

import { Client } from '../../../services/api/client';
import { REASONS, REPORT_ACTIONS } from '../../../services/list-options';

@Component({
  moduleId: module.id,
  selector: 'm-report-console',
  templateUrl: 'console.component.html'
})
export class ReportConsoleComponent implements OnInit {

  filter: string = 'review';

  appeals: any[] = [];

  inProgress: boolean = false;
  offset: string = '';
  moreData: boolean = true;

  constructor(private client: Client) { }

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
      let response: any = await this.client.get(`api/v1/entities/report/appeal/${this.filter}`, {
        limit: 12,
        offset: this.offset
      });

      if (refresh) {
        this.appeals = [];
      }

      if (response.data) {
        this.appeals.push(...response.data);
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
      let response: any = await this.client.post(`api/v1/entities/report/appeal/${appeal.guid}`, {
        note: content
      });

      this.appeals.splice(i, 1);
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
