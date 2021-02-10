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
  pollIntervalMs: number = 10000;
  pollTimer;
  fetchInProgress: boolean = false;
  mostRecentPostTs; // ojm type?

  newPostsAvailable$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(protected client: Client) {}

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

  async poll(): Promise<void> {
    this.firstPost = await this.fetchFirstPost();

    console.log('ojm FIRST POST2', this.firstPost);

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
    const firstPost = await this.fetchFirstPost();

    console.log('ojm FIRST POST', firstPost);

    if (firstPost && firstPost.time_created) {
      if (firstPost.time_created > this.mostRecentPostTs) {
        this.newPostsAvailable$.next(true);
        console.log(
          'ojm NEW POST AVAILABLE ---------------------------------------'
        );
      }
    }
  }

  async fetchFirstPost(): Promise<any> {
    console.log('ojm Fetching first post');
    if (this.fetchInProgress || !this.endpoint) {
      console.log('ojm fail', this.fetchInProgress, this.endpoint);
      return;
    }
    this.fetchInProgress = true;
    // const endpoint = this.endpoint; //ojm no need?

    await this.client
      .get(this.endpoint, {
        ...this.params,
        ...{
          limit: 1,
          // as_activities: this.castToActivities ? 1 : 0,
        },
      })
      .then((response: any) => {
        console.log('ojm POLL RESPONSE', response);
        // if (this.endpoint !== endpoint) {
        //   // Avoid race conditions if endpoint changes
        //   // ojm no need??
        //   return;
        // }

        //ojm keep?
        // if (!response.entities && response.activity) {
        //   response.entities = response.activity;
        // }

        if (response.entities.length) {
          console.log(
            'ojm respomse.ent',
            response.entities,
            response.entities[0]
          );
          const firstPost = response.entities[0];
          this.fetchInProgress = false;

          return firstPost;
          // ojm todo get first item ts??
        }
      })
      .catch(e => {
        console.log(e);
        this.fetchInProgress = false;
        return;
      });
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
