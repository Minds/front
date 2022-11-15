import { Component, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Session } from '../../../services/session';
import { ContextService } from '../../../services/context.service';
import { EntitiesService } from '../../../common/services/entities.service';
import { Client } from '../../../services/api/client';
import { FeaturesService } from '../../../services/features.service';
import {
  MetaService,
  MIN_METRIC_FOR_ROBOTS,
} from '../../../common/services/meta.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { HeadersService } from '../../../common/services/headers.service';
import { AuthModalService } from '../../auth/modal/auth-modal.service';
import { JsonLdService } from '../../../common/services/jsonld.service';
import { ActivityV2ExperimentService } from '../../experiments/sub-services/activity-v2-experiment.service';

/**
 * Base component to display an activity on a standalone page
 *
 * See it by clicking the permalink (aka timestamp) in the ownerblock of an activity in the feed
 */
@Component({
  selector: 'm-newsfeed--single',
  templateUrl: 'single.component.html',
  styleUrls: ['single.component.ng.scss'],
})
export class NewsfeedSingleComponent {
  readonly cdnAssetsUrl: string;
  readonly siteUrl: string;
  inProgress: boolean = false;
  activity: any;
  error: string = '';
  focusedCommentGuid: string = '';
  editing = false;
  fixedHeight = false;

  private paramsSubscription: Subscription;
  private queryParamsSubscription: Subscription;
  private singleGuidSubscription: Subscription;

  private shouldReuseRouteFn; // For comment focusedUrn reloading

  activityV2Feature: boolean = false;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public context: ContextService,
    public session: Session,
    public entitiesService: EntitiesService,
    protected client: Client,
    protected featuresService: FeaturesService,
    private metaService: MetaService,
    configs: ConfigsService,
    private headersService: HeadersService,
    private authModal: AuthModalService,
    protected jsonLdService: JsonLdService,
    private activityV2Experiment: ActivityV2ExperimentService
  ) {
    this.siteUrl = configs.get('site_url');
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    this.activityV2Feature = this.activityV2Experiment.isActive();

    this.context.set('activity');

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['guid']) {
        this.error = '';
        this.activity = void 0;
        if (this.route.snapshot.queryParamMap.has('comment_guid')) {
          this.focusedCommentGuid = this.route.snapshot.queryParamMap.get(
            'comment_guid'
          );
        }
        this.load(params['guid']);
      }
    });

    this.queryParamsSubscription = this.route.queryParamMap.subscribe(
      params => {
        if (params.has('editing')) {
          this.editing = !!params.get('editing');
        }
        if (params.has('fixedHeight')) {
          this.fixedHeight = params.get('fixedHeight') === '1';
        }
      }
    );

    /**
     * Comments rely on focusedCommentUrn being sent through to the comments
     * component. It is required to allow the router to know that this query parameter
     * has changed.
     * It is in the component as having it in the comment can render multiple times, creating
     * a race condition for resettig the default shouldReuseRoute (as it happens on ngOnDestroy)
     */
    this.shouldReuseRouteFn = this.router.routeReuseStrategy.shouldReuseRoute;
    this.router.routeReuseStrategy.shouldReuseRoute = future => {
      return false;
    };
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.queryParamsSubscription.unsubscribe();

    if (this.singleGuidSubscription) {
      this.singleGuidSubscription.unsubscribe();
    }
    this.jsonLdService.removeStructuredData();

    // Set the router strategy back to default
    this.router.routeReuseStrategy.shouldReuseRoute = this.shouldReuseRouteFn;
  }

  /**
   * Load newsfeed
   */
  load(guid: string) {
    this.context.set('activity');

    this.inProgress = true;

    this.singleGuidSubscription = this.entitiesService
      .singleCacheFirst(guid)
      .pipe(switchMap(activitySubscription => activitySubscription))
      .subscribe(
        activity => {
          if (!activity) {
            return; // Not yet loaded
          }

          this.activity = activity;

          switch (this.activity.subtype) {
            case 'image':
            case 'video':
            case 'album':
              break;
            case 'blog':
              break;
          }

          this.updateMeta();

          if (this.activity.require_login) this.openLoginModal();

          this.inProgress = false;

          if (this.activity.ownerObj) {
            this.context.set('activity', {
              label: `@${this.activity.ownerObj.username} posts`,
              nameLabel: `@${this.activity.ownerObj.username}`,
              id: this.activity.ownerObj.guid,
            });
          } else if (this.activity.owner_guid) {
            this.context.set('activity', {
              label: `this user's posts`,
              id: this.activity.owner_guid,
            });
          } else {
            this.context.reset();
          }
        },
        err => {
          this.inProgress = false;

          if (err.status === 0) {
            this.error = 'Sorry, there was a timeout error.';
          } else {
            this.error = "Sorry, we couldn't load the activity";
            this.headersService.setCode(404);
          }
        }
      );
  }

  loadFromFeedsService(guid: string) {
    return this.entitiesService.single(guid);
  }

  loadLegacy(guid: string) {
    const fakeEmitter = new EventEmitter();

    this.client
      .get('api/v1/newsfeed/single/' + guid, {}, { cache: true })
      .then((response: any) => {
        fakeEmitter.next(response.activity);
      });

    return fakeEmitter;
  }

  async openLoginModal(): Promise<void> {
    this.error = 'You must be logged in to see this post';
    this.headersService.setCode(401);
    const user = await this.authModal.open();
    if (user) {
      this.activity.require_login = false;
      this.error = null;
    }
  }

  private updateMeta(): void {
    const activity = this.activity;

    const title: string =
      activity.title ||
      activity.message ||
      `@${activity.ownerObj.username}'s post on Minds`;

    let description: string;
    if (title.length > 60) {
      description = `...${title.substr(57)}`;
    } else {
      description = activity.blurb || '';
    }
    if (description) {
      description += `. `;
    }
    description += `Subscribe to @${activity.ownerObj.username} on Minds`;

    this.metaService
      .setTitle(title)
      .setDescription(description)
      .setOgImage(
        activity.custom_type === 'batch'
          ? activity.custom_data[0]['src']
          : activity.thumbnail_src,
        { width: 2000, height: 1000 }
      )
      .setCanonicalUrl(`/newsfeed/${activity.guid}`)
      .setRobots(
        activity['thumbs:up:count'] >= MIN_METRIC_FOR_ROBOTS ? 'all' : 'noindex'
      );

    if (activity.nsfw.length) {
      this.metaService.setNsfw(true);
    }

    if (
      activity.subtype === 'video' ||
      activity.custom_type === 'video' ||
      activity.content_type === 'video'
    ) {
      const videoSchema = this.jsonLdService.getVideoSchema(activity);
      this.jsonLdService.insertSchema(videoSchema);
    }

    if (activity.custom_type === 'video') {
      this.metaService.setOgType('video');
      this.metaService.setOgImage(activity.custom_data['thumbnail_src']);
    }

    if (activity.subtype === 'video' || activity.subtype === 'image') {
      this.metaService.setOEmbed(activity.guid);
    }

    if (activity.supermind?.is_reply) {
      this.metaService.setTwitterSummaryCard(
        activity.ownerObj.name + "'s reply on Minds",
        this.siteUrl +
          'api/v3/newsfeed/activity/og-image/' +
          activity.remind_object.guid,
        'Get replies from ' +
          activity.ownerObj.name +
          ' and elevate the discourse on Minds.'
      );
    }
  }

  delete(activity) {
    this.router.navigate(['/newsfeed']);
  }

  get showLegacyActivity(): boolean {
    return this.editing;
  }
}
