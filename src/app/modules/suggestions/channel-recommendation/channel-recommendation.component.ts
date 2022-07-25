import { ClientMetaDirective } from './../../../common/directives/client-meta.directive';
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
import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiService } from '../../../common/api/api.service';
import { RecentSubscriptionsService } from '../../../common/services/recent-subscriptions.service';
import { MindsUser } from '../../../interfaces/entities';
import { ExperimentsService } from '../../experiments/experiments.service';
import { ActivityV2ExperimentService } from '../../experiments/sub-services/activity-v2-experiment.service';
import { ResizedEvent } from './../../../common/directives/resized.directive';
import { DismissalService } from './../../../common/services/dismissal.service';
import { AnalyticsService } from './../../../services/analytics';
import { ApiResource } from '../../../common/api/api-resource.service';
import { filter, map } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../common/components/abstract-subscriber/abstract-subscriber.component';

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
  /** a list of recommended channels */
  recommendations$: BehaviorSubject<MindsUser[]> = new BehaviorSubject([]);
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
    updateState: response =>
      response?.entities.map(e => e.entity).filter(Boolean) || [],
  });

  constructor(
    private api: ApiService,
    public experiments: ExperimentsService,
    private recentSubscriptions: RecentSubscriptionsService,
    private activityV2Experiment: ActivityV2ExperimentService,
    private dismissal: DismissalService,
    private analyticsService: AnalyticsService,
    @Optional() @SkipSelf() protected parentClientMeta: ClientMetaDirective,
    private apiResource: ApiResource
  ) {}

  @HostBinding('class.m-channelRecommendation--activityV2')
  get activityV2Feature(): boolean {
    return this.activityV2Experiment.isActive();
  }

  ngOnInit(): void {
    if (this.location) {
      this.recommendations$ = this.channelRecommendationQuery.fetch({
        location: this.location,
        mostRecentSubscriptions: this.recentSubscriptions.list(),
        currentChannelUserGuid: this.channelId,
        limit: 12,
      }).data$ as any;
    }
  }

  ngAfterViewInit(): void {
    this.disabledAnimations$.next(false);
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
      this.listSize$.next(5);
    }

    if (this.recommendations$.getValue().length <= 3) {
      return;
    }

    // TODO: change
    this.recommendations$.next(
      this.recommendations$.getValue().filter(u => u.guid !== user.guid)
    );
  }

  channelTrackBy(index: number, activity: any) {
    return activity?.guid;
  }
}
