import { ClientMetaDirective } from './../../../common/directives/client-meta.directive';
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../../common/api/api.service';
import { RecentSubscriptionsService } from '../../../common/services/recent-subscriptions.service';
import { MindsUser } from '../../../interfaces/entities';
import { ExperimentsService } from '../../experiments/experiments.service';
import { ResizedEvent } from './../../../common/directives/resized.directive';
import { DismissalService } from './../../../common/services/dismissal.service';
import { AnalyticsService } from './../../../services/analytics';
import { NewsfeedService } from '../../newsfeed/services/newsfeed.service';

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
export class ChannelRecommendationComponent implements OnInit {
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
  /**
   * the height of the container, used to animate the mount and unmount of this component
   */
  containerHeight$: BehaviorSubject<number> = new BehaviorSubject(0);
  /** a list of recommended channels */
  recommendations$: BehaviorSubject<MindsUser[]> = new BehaviorSubject([]);
  /**
   * How many recommendations to show at a time?
   */
  listSize$: BehaviorSubject<number> = new BehaviorSubject(4);

  constructor(
    private api: ApiService,
    public experiments: ExperimentsService,
    private recentSubscriptions: RecentSubscriptionsService,
    private dismissal: DismissalService,
    private analyticsService: AnalyticsService,
    private newsfeedService: NewsfeedService,
    @Optional() @SkipSelf() protected parentClientMeta: ClientMetaDirective
  ) {}

  ngOnInit(): void {
    if (this.location) {
      this.api
        .get('api/v3/recommendations', {
          location: this.location,
          mostRecentSubscriptions: this.recentSubscriptions.list(),
          currentChannelUserGuid: this.channelId,
          limit: 12,
        })
        .toPromise()
        .then(result => {
          if (result) {
            this.recommendations$.next(result.entities.map(e => e.entity));
          }
        });
    }
  }

  /**
   * tracks views of channel rec items
   * @param { MindsUser } channel - the entity
   * @param { number } position - position in the channel recs
   */
  trackView(channel: MindsUser, position: number) {
    if (this.parentClientMeta) {
      const clientMeta: {} = this.parentClientMeta.build({
        position,
        medium: 'channel-recs',
      });

      if (channel.boosted_guid) {
        const clientMeta: {} = this.parentClientMeta.build({
          position,
          medium: 'channel-recs',
          campaign: channel.urn,
        });

        this.newsfeedService.recordView(channel, true, null, clientMeta);
      }

      this.analyticsService.trackEntityView(
        channel,
        this.parentClientMeta.build(clientMeta)
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
    this.containerHeight$.next(event.newRect.height + 40);
  }

  /**
   * When a recommendation is subscribed, remove it from the list——unless the list length is small
   */
  onSubscribed(user): void {
    if (this.listSize$.getValue() === 4) {
      this.listSize$.next(5);
    }

    if (this.recommendations$.getValue().length <= 4) {
      return;
    }

    this.recommendations$.next(
      this.recommendations$.getValue().filter(u => u.guid !== user.guid)
    );
  }
}
