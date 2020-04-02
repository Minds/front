import { Client } from '../../../../services/api';
import { Injectable } from '@angular/core';
import { REASONS } from '../../../../services/list-options';

@Injectable()
export class JurySessionService {
  constructor(private client: Client) {}

  async getList(opts) {
    return await this.client.get('api/v2/moderation/jury/' + opts.juryType);
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

  async uphold(report) {
    const juryType = report.is_appeal ? 'appeal' : 'initial';
    return await this.client.post(
      `api/v2/moderation/jury/${juryType}/${report.urn}`,
      {
        uphold: true,
      }
    );
  }

  getReasonString(report) {
    return REASONS.filter(item => {
      if (item.hasMore && item.reasons) {
        return (
          item.value === report.reason_code &&
          item.reasons[report.sub_reason_code - 1].value ===
            report.sub_reason_code
        );
      }
      return item.value === report.reason_code;
    })
      .map(item => {
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
