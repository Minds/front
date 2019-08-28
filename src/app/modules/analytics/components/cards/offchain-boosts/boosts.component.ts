import { Component, ViewChild } from '@angular/core';
import { Client } from '../../../../../services/api/client';
import { AnalyticsCardComponent } from '../card/card.component';

@Component({
  selector: 'm-analyticsoffchainboosts__card',
  templateUrl: 'boosts.component.html',
})
export class OffChainBoostsCardComponent {
  @ViewChild('completed', { static: true }) completed: AnalyticsCardComponent;
  @ViewChild('notcompleted', { static: true })
  notcompleted: AnalyticsCardComponent;
  @ViewChild('revoked', { static: true }) revoked: AnalyticsCardComponent;
  @ViewChild('rejected', { static: true }) rejected: AnalyticsCardComponent;
  @ViewChild('userscompleted', { static: true })
  userscompleted: AnalyticsCardComponent;
  @ViewChild('userspending', { static: true })
  userspending: AnalyticsCardComponent;
  @ViewChild('reclaimedtokens', { static: true })
  reclaimedtokens: AnalyticsCardComponent;
  @ViewChild('impressions', { static: true })
  impressions: AnalyticsCardComponent;

  avgNewsfeedCompleted: number = 0;
  avgContentCompleted: number = 0;

  avgNewsfeedNotCompleted: number = 0;
  avgContentNotCompleted: number = 0;

  avgNewsfeedRevoked: number = 0;
  avgContentRevoked: number = 0;

  avgNewsfeedRejected: number = 0;
  avgContentRejected: number = 0;

  avgNewsfeedUsersCompleted: number = 0;
  avgContentUsersCompleted: number = 0;

  avgNewsfeedUsersAwaitingCompletion: number = 0;
  avgContentUsersAwaitingCompletion: number = 0;

  avgNewsfeedReclaimed: number = 0;
  avgContentReclaimed: number = 0;

  avgNewsfeedImpressions: number = 0;
  avgContentImpressions: number = 0;

  currentCompleted: { name: string; value: number }[];
  currentNotCompleted: { name: string; value: number }[];
  currentRevoked: { name: string; value: number }[];
  currentRejected: { name: string; value: number }[];
  currentUsersCompleted: { name: string; value: number }[];
  currentUsersAwaitingCompletion: { name: string; value: number }[];
  currentReclaimed: { name: string; value: number }[];
  currentImpressions: { name: string; value: number }[];

  constructor(private client: Client) {}

  ngOnInit() {
    this.getAvgCompleted();
    this.getAvgNotCompleted();
    this.getAvgRevoked();
    this.getAvgRejected();
    this.getAvgUsersCompleted();
    this.getAvgUsersAwaitingCompletion();
    this.getAvgReclaimed();
    this.getAvgImpressions();

    this.completed.selectedOptionChange.subscribe(() => {
      this.getAvgCompleted();
    });

    this.notcompleted.selectedOptionChange.subscribe(() => {
      this.getAvgNotCompleted();
    });

    this.revoked.selectedOptionChange.subscribe(() => {
      this.getAvgRevoked();
    });

    this.rejected.selectedOptionChange.subscribe(() => {
      this.getAvgRejected();
    });

    this.userscompleted.selectedOptionChange.subscribe(() => {
      this.getAvgUsersCompleted();
    });

    this.userspending.selectedOptionChange.subscribe(() => {
      this.getAvgUsersAwaitingCompletion();
    });

    this.reclaimedtokens.selectedOptionChange.subscribe(() => {
      this.getAvgReclaimed();
    });

    this.impressions.selectedOptionChange.subscribe(() => {
      this.getAvgImpressions();
    });
  }

  private async getAvgCompleted() {
    try {
      const response: any = await this.client.get(
        'api/v2/analytics/offchainboosts',
        {
          key: 'completed_avg',
          timespan: this.completed.selectedOption,
        }
      );

      this.avgNewsfeedCompleted = response.data.newsfeed;
      this.avgContentCompleted = response.data.content;
    } catch (e) {
      console.error(e);
    }
  }

  private async getAvgNotCompleted() {
    try {
      const response: any = await this.client.get(
        'api/v2/analytics/offchainboosts',
        {
          key: 'not_completed_avg',
          timespan: this.notcompleted.selectedOption,
        }
      );

      this.avgNewsfeedNotCompleted = response.data.newsfeed;
      this.avgContentNotCompleted = response.data.content;
    } catch (e) {
      console.error(e);
    }
  }

  private async getAvgRevoked() {
    try {
      const response: any = await this.client.get(
        'api/v2/analytics/offchainboosts',
        {
          key: 'revoked_avg',
          timespan: this.revoked.selectedOption,
        }
      );

      this.avgNewsfeedRevoked = response.data.newsfeed;
      this.avgContentRevoked = response.data.content;
    } catch (e) {
      console.error(e);
    }
  }

  private async getAvgRejected() {
    try {
      const response: any = await this.client.get(
        'api/v2/analytics/offchainboosts',
        {
          key: 'rejected_avg',
          timespan: this.rejected.selectedOption,
        }
      );

      this.avgNewsfeedRejected = response.data.newsfeed;
      this.avgContentRejected = response.data.content;
    } catch (e) {
      console.error(e);
    }
  }

  private async getAvgUsersCompleted() {
    try {
      const response: any = await this.client.get(
        'api/v2/analytics/offchainboosts',
        {
          key: 'users_who_completed_avg',
          timespan: this.userscompleted.selectedOption,
        }
      );

      this.avgNewsfeedUsersCompleted = response.data.newsfeed;
      this.avgContentUsersCompleted = response.data.content;
    } catch (e) {
      console.error(e);
    }
  }

  private async getAvgUsersAwaitingCompletion() {
    try {
      const response: any = await this.client.get(
        'api/v2/analytics/offchainboosts',
        {
          key: 'users_waiting_for_completion_avg',
          timespan: this.userspending.selectedOption,
        }
      );

      this.avgNewsfeedUsersAwaitingCompletion = response.data.newsfeed;
      this.avgContentUsersAwaitingCompletion = response.data.content;
    } catch (e) {
      console.error(e);
    }
  }

  private async getAvgReclaimed() {
    try {
      const response: any = await this.client.get(
        'api/v2/analytics/offchainboosts',
        {
          key: 'reclaimed_tokens_avg',
          timespan: this.reclaimedtokens.selectedOption,
        }
      );

      this.avgNewsfeedReclaimed = response.data.newsfeed;
      this.avgContentReclaimed = response.data.content;
    } catch (e) {
      console.error(e);
    }
  }

  private async getAvgImpressions() {
    try {
      const response: any = await this.client.get(
        'api/v2/analytics/offchainboosts',
        {
          key: 'impressions_served_avg',
          timespan: this.impressions.selectedOption,
        }
      );

      this.avgNewsfeedImpressions = response.data.newsfeed;
      this.avgContentImpressions = response.data.content;
    } catch (e) {
      console.error(e);
    }
  }
}
