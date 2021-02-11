import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { setInterval } from 'timers';
import { Client } from '../../services/api';

@Injectable()
export class NewPostsService implements OnDestroy {
  endpoint: string;
  params: any = { sync: 1 };
  // timestamp: string | number; //ojm type?
  firstPost: any;
  pollIntervalMs: number = 10000; // default is 10s
  pollTimer;
  fetchInProgress: boolean = false;
  mostRecentPostTs; // ojm type?

  newPostsAvailable$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(protected client: Client) {}

  //ojm todo make FeatureFlag
  public setPollIntervalMs(ms: number): NewPostsService {
    this.pollIntervalMs = ms;
    return this;
  }

  public setEndpoint(endpoint: string): NewPostsService {
    console.log('ojm setting pollEndpoint', endpoint);
    this.endpoint = endpoint;
    return this;
  }

  public setParams(params): NewPostsService {
    this.params = params;

    if (!params.sync) {
      this.params.sync = 1;
    }
    return this;
  }

  public async poll(): Promise<void> {
    await this.fetchFirstPost();

    console.log('ojm FIRST POST POLL', this.firstPost);

    if (
      !this.mostRecentPostTs &&
      this.firstPost &&
      this.firstPost.time_created
    ) {
      this.mostRecentPostTs = this.firstPost.time_created;
    }

    this.pollTimer = setInterval(() => {
      console.log('ojm polltimer *-*-*-*-*-*');
      this.checkForNewPosts();
    }, this.pollIntervalMs);
  }

  async checkForNewPosts(): Promise<void> {
    await this.fetchFirstPost();

    console.log('ojm FIRST POST', this.firstPost);

    if (this.firstPost && this.firstPost.time_created) {
      if (this.firstPost.time_created > this.mostRecentPostTs) {
        this.newPostsAvailable$.next(true);
        this.mostRecentPostTs = this.firstPost.time_created;
        console.log(
          'ojm NEW POST AVAILABLE ---------------------------------------'
        );
      }
    }
  }

  async fetchFirstPost(): Promise<void> {
    console.log('ojm Fetching first post');
    if (this.fetchInProgress || !this.endpoint) {
      console.log('ojm fail', this.fetchInProgress, this.endpoint);
      return;
    }
    this.fetchInProgress = true;
    // const endpoint = this.endpoint; //ojm no need?

    try {
      const response: any = await this.client.get(this.endpoint, {
        ...this.params,
        ...{
          limit: 1,
          // as_activities: this.castToActivities ? 1 : 0,
        },
      });
      this.fetchInProgress = false;
      if (response && response.entities && response.entities.length) {
        console.log(
          'ojm response.ent NEW',
          response.entities,
          response.entities[0]
        );
        this.firstPost = response.entities[0].entity;
        return;
      }
    } catch (e) {
      console.log(e);
      this.fetchInProgress = false;
    }
    return;
  }

  reset(): void {
    this.cancelPoll();
    this.mostRecentPostTs = null;
  }

  cancelPoll(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
    }
  }

  ngOnDestroy(): void {
    this.cancelPoll();
  }
}
