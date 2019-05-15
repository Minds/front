import {Component, OnInit} from '@angular/core';

import { Client } from '../../../services/api/client';
import { REASONS, REPORT_ACTIONS } from '../../../services/list-options';
import { JurySessionService } from '../juryduty/session/session.service';

@Component({
  selector: 'm-moderation__strikes',
  templateUrl: 'strikes.component.html'
})
export class StrikesComponent implements OnInit {

  strikes: any[] = [];

  inProgress: boolean = false;
  offset: string = '';
  moreData: boolean = true;

  constructor(
    private client: Client,
    public service: JurySessionService,
  ) { }

  ngOnInit() {
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
        offset: this.offset
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

}