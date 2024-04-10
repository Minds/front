import { Client } from '../../../../services/api';
import { Injectable } from '@angular/core';
import { ReportService } from './../../../../common/services/report.service';

@Injectable()
export class JurySessionService {
  reportReasons = this.reportService.reasons;

  constructor(
    private client: Client,
    private reportService: ReportService
  ) {}

  async getList(opts) {
    let queryString = opts.offset ? `?offset=${opts.offset}&limit=12` : '';
    return await this.client.get(
      'api/v2/moderation/jury/' + opts.juryType + queryString
    );
  }

  async getReport(urn) {
    return (<any>await this.client.get('api/v2/moderation/jury/appeal/' + urn))
      .report;
  }

  async overturn(report) {
    const juryType = report.is_appeal ? 'appeal' : 'initial';
    return await this.client.post(
      `api/v2/moderation/jury/${juryType}/${report.urn}`,
      {
        uphold: false,
      }
    );
  }

  async uphold(report, adminReasonOverride: string | null = null) {
    const juryType = report.is_appeal ? 'appeal' : 'initial';
    return await this.client.post(
      `api/v2/moderation/jury/${juryType}/${report.urn}`,
      {
        uphold: true,
        admin_reason_override: adminReasonOverride,
      }
    );
  }

  getReasonString(report) {
    return this.reportReasons
      .filter((item) => {
        if (item.hasMore && item.reasons) {
          return (
            item.value === report.reason_code &&
            item.reasons[report.sub_reason_code - 1].value ===
              report.sub_reason_code
          );
        }
        return item.value === report.reason_code;
      })
      .map((item) => {
        if (item.hasMore && item.reasons) {
          return item.reasons[report.sub_reason_code - 1].label;
        }
        return item.label;
      })
      .join(', ');
  }

  getAction(report) {
    let friendlyString =
      report.entity && report.entity.type == 'user' ? 'banned' : 'removed';

    switch (report.reason_code) {
      case 2:
        friendlyString = 'marked NSFW';
        break;
      case 4:
      case 8:
        if (report.entity && report.entity.type == 'user')
          friendlyString = 'given a strike';
        break;
    }

    return friendlyString;
  }
}
