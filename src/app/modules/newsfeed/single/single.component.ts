import { Component, Injector, SkipSelf, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { Session } from '../../../services/session';
import { ContextService } from '../../../services/context.service';
import { EntitiesService } from '../../../common/services/entities.service';
import { Client } from '../../../services/api/client';
import { FeaturesService } from '../../../services/features.service';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import {
  MetaService,
  MIN_METRIC_FOR_ROBOTS,
} from '../../../common/services/meta.service';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-newsfeed--single',
  providers: [ClientMetaService],
  templateUrl: 'single.component.html',
})
export class NewsfeedSingleComponent {
  readonly cdnAssetsUrl: string;
  readonly siteUrl: string;
  inProgress: boolean = false;
  activity: any;
  error: string = '';
  paramsSubscription: Subscription;
  queryParamsSubscription: Subscription;
  focusedCommentGuid: string = '';

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public context: ContextService,
    public session: Session,
    public entitiesService: EntitiesService,
    protected client: Client,
    protected featuresService: FeaturesService,
    protected clientMetaService: ClientMetaService,
    private metaService: MetaService,
    @SkipSelf() injector: Injector,
    configs: ConfigsService
  ) {
    this.clientMetaService
      .inherit(injector)
      .setSource('single')
      .setMedium('single');
    this.siteUrl = configs.get('site_url');
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
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
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  /**
   * Load newsfeed
   */
  load(guid: string) {
    this.context.set('activity');

    this.inProgress = true;

    const fetchSingleGuid = this.featuresService.has('sync-feeds')
      ? this.loadFromFeedsService(guid)
      : this.loadLegacy(guid);

    fetchSingleGuid.subscribe(
      (activity: any) => {
        if (activity === null) {
          return; // Not yet loaded
        }

        this.activity = activity;

        switch (this.activity.subtype) {
          case 'image':
          case 'video':
          case 'album':
            this.router.navigate(['/media', this.activity.guid], {
              replaceUrl: true,
            });
            break;
          case 'blog':
            this.router.navigate(['/blog/view', this.activity.guid], {
              replaceUrl: true,
            });
            break;
        }

        this.updateMeta();

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

  private updateMeta(): void {
    const activity = this.activity.remind_object || this.activity;
    this.metaService
      .setTitle(`@${activity.ownerObj.username} on Minds`)
      .setDescription(
        activity.title ||
          activity.message ||
          `Subscribe to @${activity.ownerObj.username} on Minds`
      )
      .setOgImage(
        activity.custom_type === 'batch'
          ? activity.custom_data[0]['src']
          : activity.thumbnail_src,
        { width: 2000, height: 1000 }
      )
      .setRobots(
        activity['thumbs:up:count'] >= MIN_METRIC_FOR_ROBOTS ? 'all' : 'noindex'
      );

    if (activity.custom_type === 'video') {
      this.metaService.setOgType('video');
      this.metaService.setOgImage(activity.custom_data['thumbnail_src']);
    }
  }

  delete(activity) {
    this.router.navigate(['/newsfeed']);
  }
}
