import { Component, OnInit, ViewChild } from '@angular/core';
import { AnalyticsCardComponent } from '../card/card.component';
import { Client } from '../../../../../services/api/client';

@Component({
  selector: 'm-analyticsengagement__card',
  templateUrl: 'engagement.component.html',
})
export class EngagementCardComponent implements OnInit {
  @ViewChild('posts', { static: true }) posts: AnalyticsCardComponent;
  @ViewChild('comments', { static: true }) comments: AnalyticsCardComponent;
  @ViewChild('votes', { static: true }) votes: AnalyticsCardComponent;
  @ViewChild('reminds', { static: true }) reminds: AnalyticsCardComponent;

  avgPosts: number = 0;
  avgPostingUsers: number = 0;
  currentPosts: { name: string; value: number }[];
  avgComments: number = 0;
  avgCommentingUsers: number = 0;
  currentComments: { name: string; value: number }[];
  avgVotes: number = 0;
  avgVotingUsers: number = 0;
  currentVotes: { name: string; value: number }[];
  avgReminds: number = 0;
  avgRemindingUsers: number = 0;
  currentReminds: { name: string; value: number }[];

  constructor(private client: Client) {}

  ngOnInit() {
    this.getAvgPosts();
    this.getAvgComments();
    this.getAvgVotes();
    this.getAvgReminds();

    this.posts.selectedOptionChange.subscribe(() => {
      this.getAvgPosts();
    });

    this.comments.selectedOptionChange.subscribe(() => {
      this.getAvgComments();
    });

    this.votes.selectedOptionChange.subscribe(() => {
      this.getAvgVotes();
    });

    this.reminds.selectedOptionChange.subscribe(() => {
      this.getAvgReminds();
    });
  }

  private async getAvgPosts() {
    try {
      const response: any = await this.client.get('api/v2/analytics/posts', {
        key: 'avg',
        timespan: this.posts.selectedOption,
      });

      this.avgPosts = response.data.posts;
      this.avgPostingUsers = response.data.postingUsers;
    } catch (e) {
      console.error(e);
    }
  }

  private async getAvgComments() {
    try {
      const response: any = await this.client.get('api/v2/analytics/comments', {
        key: 'avg',
        timespan: this.comments.selectedOption,
      });

      this.avgComments = response.data.comments;
      this.avgCommentingUsers = response.data.commentingUsers;
    } catch (e) {
      console.error(e);
    }
  }

  private async getAvgVotes() {
    try {
      const response: any = await this.client.get('api/v2/analytics/votes', {
        key: 'avg',
        timespan: this.votes.selectedOption,
      });

      this.avgVotes = response.data.votes;
      this.avgVotingUsers = response.data.votingUsers;
    } catch (e) {
      console.error(e);
    }
  }

  private async getAvgReminds() {
    try {
      const response: any = await this.client.get('api/v2/analytics/reminds', {
        key: 'avg',
        timespan: this.reminds.selectedOption,
      });

      this.avgReminds = response.data.reminds;
      this.avgRemindingUsers = response.data.remindingUsers;
    } catch (e) {
      console.error(e);
    }
  }
}
