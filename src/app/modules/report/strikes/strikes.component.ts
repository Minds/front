import { Component, OnInit } from '@angular/core';

import { Client } from '../../../services/api/client';
import { JurySessionService } from '../juryduty/session/session.service';
import { FeaturesService } from '../../../services/features.service';

@Component({
  selector: 'm-moderation__strikes',
  templateUrl: 'strikes.component.html',
})
export class StrikesComponent implements OnInit {
  strikes: any[] = [];

  inProgress: boolean = false;
  offset: string = '';
  moreData: boolean = true;

  hasNewNav: boolean = false;

  constructor(
    private client: Client,
    public service: JurySessionService,
    protected featuresService: FeaturesService
  ) {}

  ngOnInit() {
    this.hasNewNav = true;

    this.load();
  }

  async load(refresh: boolean = false) {
    if (refresh) {
      this.inProgress = false;
      this.offset = '';
      this.moreData = true;
    }

    this.inProgress = true;

    try {
      let response: any = await this.client.get(`api/v2/moderation/strikes`, {
        limit: 12,
        offset: this.offset,
      });

      if (refresh) {
        this.strikes = [];
      }

      if (response.strikes) {
        this.strikes.push(...response.strikes);
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

  friendlyState(report) {
    switch (report.state) {
      case 'initial_jury_decided':
        return 'Available to appeal';
        break;
      case 'appealed':
        return 'Awaiting appeal jury';
        break;
      case 'appeal_jury_decided':
        if (report.upheld) {
          return 'Appeal rejected';
        } else {
          return 'Appeal accepted'; // Strike should have been removed by this stage
        }
        break;
    }
    return 'Unknown';
  }
}
