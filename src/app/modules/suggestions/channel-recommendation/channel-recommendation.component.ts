import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  Component,
  HostBinding,
  Input,
  OnInit,
  Optional,
  SkipSelf,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResource } from '../../../common/api/api-resource.service';
import { ApiService } from '../../../common/api/api.service';
import { RecentSubscriptionsService } from '../../../common/services/recent-subscriptions.service';
import { MindsUser } from '../../../interfaces/entities';
import { ExperimentsService } from '../../experiments/experiments.service';
import { ActivityV2ExperimentService } from '../../experiments/sub-services/activity-v2-experiment.service';
import { PersistentFeedExperimentService } from '../../experiments/sub-services/persistent-feed-experiment.service';
import { ClientMetaDirective } from './../../../common/directives/client-meta.directive';
import { ResizedEvent } from './../../../common/directives/resized.directive';
import { DismissalService } from './../../../common/services/dismissal.service';
import { AnalyticsService } from './../../../services/analytics';

const listAnimation = trigger('listAnimation', [
  transition(':enter', [
    style({ opacity: 0, height: 0 }),
    animate('200ms ease-out', style({ opacity: 1, height: '*' })),
  ]),
  transition(
    ':leave',
    animate('200ms ease-out', style({ height: 0, opacity: 0 }))
  ),
]);

interface ChannelRecommendationResponse {
  algorithm: string;
  entities: {
    entity_guid: string;
    entity_type: string;
    confidence_score: number;
    entity: MindsUser;
  }[];
}

interface ChannelRecommendationParams {
  location: string;
  mostRecentSubscriptions: string[];
  currentChannelUserGuid: string;
  limit: number;
}

/**
 * Displays channel recommendations
 *
 * See it in the newsfeed
 */
@Component({
  selector: 'm-channelRecommendation',
  templateUrl: './channel-recommendation.component.html',
  styleUrls: ['./channel-recommendation.component.ng.scss'],
  animations: [listAnimation],
})
export class ChannelRecommendationComponent implements OnInit, AfterViewInit {
  /**
   * the location in which this component appears
   */
  @Input()
  location: 'newsfeed' | 'discovery-feed' | 'channel';
  /**
   * the channel id for which the recommendations should be contextualized.
   */
  @Input()
  channelId: string;
  /**
   * same as ngIf except it starts loading recommendations immediately but controls
   * when the component is shown
   */
  @Input()
  visible: boolean = true;
  /**
   * The title of channel recommendation widget
   */
  @Input()
  title: string = $localize`:@@M_DISCOVERY_CARD_CAROUSEL__SUGGESTED_CHANNELS:Recommended Channels`;
  /**
   * Whether the widget should have a close button
   */
  @Input()
  dismissible: boolean = false;
  disabledAnimations$ = new BehaviorSubject(true); // disabled by default, will enable after component mounts
  /**
   * the height of the container, used to animate the mount and unmount of this component
   */
  containerHeight$: BehaviorSubject<number> = new BehaviorSubject(undefined);
  /**
   * How many recommendations to show at a time?
   */
  listSize$: BehaviorSubject<number> = new BehaviorSubject(3);

  channelRecommendationQuery = this.apiResource.query<
    ChannelRecommendationResponse,
    ChannelRecommendationParams
  >('api/v3/recommendations', {
    cacheStorage: ApiResource.CacheStorage.Memory,
    cachePolicy: ApiResource.CachePolicy.cacheFirst,
    skip: true,
  });

  /** a list of recommended channels */
  recommendations$ = this.channelRecommendationQuery.data$.pipe(
    map(data => data?.entities.map(e => e.entity).filter(Boolean))
  );

  constructor(
    private api: ApiService,
    public experiments: ExperimentsService,
    private recentSubscriptions: RecentSubscriptionsService,
    private activityV2Experiment: ActivityV2ExperimentService,
    private dismissal: DismissalService,
    private analyticsService: AnalyticsService,
    @Optional() @SkipSelf() protected parentClientMeta: ClientMetaDirective,
    private apiResource: ApiResource,
    private persistentFeedExperiment: PersistentFeedExperimentService
  ) {}

  @HostBinding('class.m-channelRecommendation--activityV2')
  get activityV2Feature(): boolean {
    return this.activityV2Experiment.isActive();
  }

  ngOnInit(): void {
    if (this.location) {
      this.channelRecommendationQuery.fetch({
        location: this.location,
        mostRecentSubscriptions: this.recentSubscriptions.list(),
        currentChannelUserGuid: this.channelId,
        limit: 12,
      });
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.disabledAnimations$.next(false);
    });
  }

  /**
   * tracks views of channel rec items
   * @param { MindsUser } channel - the entity
   * @param { number } position - position in the channel recs
   */
  trackView(channel: MindsUser, position: number) {
    if (this.parentClientMeta) {
      this.analyticsService.trackEntityView(
        channel,
        this.parentClientMeta.build({
          position,
          medium: 'channel-recs',
        })
      );
    }
  }

  /**
   * dismisses the component
   * @returns { void }
   */
  dismiss(): void {
    this.dismissal.dismiss(
      `channel-recommendation:${
        this.location === 'channel' ? 'channel' : 'feed'
      }`
    );
  }

  /**
   * when component resizes we set the container height and animate it
   */
  onResized(event: ResizedEvent): void {
    this.containerHeight$.next(event.newRect.height + 64);
  }

  /**
   * When a recommendation is subscribed, remove it from the list——unless the list length is small
   */
  onSubscribed(user): void {
    if (this.listSize$.getValue() === 3) {
      if (!this.persistentFeedExperiment.isActive()) {
        this.listSize$.next(5);
      }
    }

    if (
      this.channelRecommendationQuery.data$.getValue()?.entities.length <= 3
    ) {
      return;
    }

    this.channelRecommendationQuery.setData(data => ({
      ...data,
      entities: data?.entities.filter(u => u.entity?.guid !== user.guid),
    }));
  }

  channelTrackBy(index: number, activity: any) {
    return activity?.guid;
  }
}
