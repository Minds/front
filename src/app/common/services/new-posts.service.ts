import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { setInterval } from 'timers';
import { Client } from '../../services/api';
import { FeaturesService } from '../../services/features.service';
import { Session } from '../../services/session';

const DEFAULT_POLL_INTERVAL_MS: number = 10000; // default is 10s
@Injectable({ providedIn: 'root' })
export class NewPostsService implements OnDestroy {
  endpoint: string;
  params: any = { sync: 1 };
  firstPost: any;
  pollIntervalMs: number = DEFAULT_POLL_INTERVAL_MS;
  pollTimer;
  fetchInProgress: boolean = false;
  mostRecentPostTs;

  public newPostsAvailable$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  public showNewPostsIntent$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  constructor(
    protected client: Client,
    protected featuresService: FeaturesService,
    protected session: Session
  ) {}

  public setPollIntervalMs(ms: number): NewPostsService {
    this.pollIntervalMs = ms;
    return this;
  }

  public setEndpoint(endpoint: string): NewPostsService {
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
    this.reset();
    if (!this.featuresService.has('new-posts')) {
      return;
    }

    await this.fetchFirstPost();
    if (
      !this.mostRecentPostTs &&
      this.firstPost &&
      this.firstPost.time_created
    ) {
      this.mostRecentPostTs = this.firstPost.time_created;
    }

    this.pollTimer = setInterval(() => {
      this.checkForNewPosts();
    }, this.pollIntervalMs);
  }

  async checkForNewPosts(): Promise<void> {
    await this.fetchFirstPost();

    if (this.firstPost && this.firstPost.time_created) {
      if (
        this.mostRecentPostTs &&
        this.firstPost.time_created > this.mostRecentPostTs &&
        this.session.getLoggedInUser().guid !== this.firstPost.owner_guid
      ) {
        this.newPostsAvailable$.next(true);
        this.mostRecentPostTs = this.firstPost.time_created;
      }
    }
  }

  async fetchFirstPost(limit: number = 1): Promise<void> {
    if (this.fetchInProgress || !this.endpoint) {
      return;
    }
    this.fetchInProgress = true;
    const endpoint = this.endpoint;

    try {
      const response: any = await this.client.get(this.endpoint, {
        ...this.params,
        ...{
          limit: 1,
        },
      });
      this.fetchInProgress = false;

      if (this.endpoint !== endpoint) {
        // Avoid race conditions if endpoint changes
        return;
      }

      if (response && response.entities && response.entities.length) {
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
    this.pollIntervalMs = DEFAULT_POLL_INTERVAL_MS;
    this.newPostsAvailable$.next(false);
    this.showNewPostsIntent$.next(false);
    this.mostRecentPostTs = null;
    this.firstPost = null;
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
