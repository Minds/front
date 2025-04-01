import { ClientMetaDirective } from '../../../common/directives/client-meta.directive';
import { animate, style, transition, trigger } from '@angular/animations';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  PLATFORM_ID,
  SkipSelf,
} from '@angular/core';
import { BehaviorSubject, Subscription, map, take } from 'rxjs';
import { ApiService } from '../../../common/api/api.service';
import { RecentSubscriptionsService } from '../../../common/services/recent-subscriptions.service';
import { MindsUser } from '../../../interfaces/entities';
import { ExperimentsService } from '../../experiments/experiments.service';
import { ResizedEvent } from '../../../common/directives/resized.directive';
import { DismissalService } from '../../../common/services/dismissal.service';
import { AnalyticsService } from '../../../services/analytics';
import { NewsfeedService } from '../../newsfeed/services/newsfeed.service';
import { PublisherType } from '../../../common/components/publisher-search-modal/publisher-search-modal.component';
import { GroupMembershipChangeOuput } from '../../../common/components/group-membership-button/group-membership-button.component';
import { MindsGroup } from '../../groups/v2/group.model';
import {
  BoostNode,
  GroupNode,
  PublisherRecsConnection,
  UserNode,
} from '../../../../graphql/generated.engine';
import { ParseJson } from '../../../common/pipes/parse-json';
import { isPlatformServer } from '@angular/common';

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

export type PublisherRecommendationsLocation =
  | 'newsfeed'
  | 'discovery-feed'
  | 'channel'
  | 'groups-memberships'
  | 'search';

/**
 * Displays channel/group recommendations
 *
 * See it in the newsfeed and onboarding
 */

@Component({
  selector: 'm-publisherRecommendations',
  templateUrl: './publisher-recommendations.component.html',
  styleUrls: ['./publisher-recommendations.component.ng.scss'],
  animations: [listAnimation],
  providers: [ParseJson],
})
export class PublisherRecommendationsComponent implements OnInit, OnDestroy {
  /**
   * the location in which this component appears
   */
  @Input()
  location: PublisherRecommendationsLocation;
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
   * The title of publisher recommendations widget
   */
  @Input()
  title: string;
  /**
   * Whether the widget should have a close button
   */
  @Input()
  dismissible: boolean = false;

  /**
   * Should the widget recommend channels or groups?
   *
   * If using gql recs, types may be mixed and
   * this mostly determines where the 'See More' link goes
   */
  @Input()
  publisherType: PublisherType = 'user';

  /** @type { boolean } whether to show a title on top */
  @Input()
  showTitle: boolean = true;

  /**
   * How many recommendations to show at a time when
   * the component is loaded
   */
  @Input() initialListSize: number = 4;

  /**
   * the height of the container, used to animate the mount and unmount of this component
   */
  containerHeight$: BehaviorSubject<number> = new BehaviorSubject(0);

  /** a list of recommended channels or groups */
  recommendations$: BehaviorSubject<(MindsUser | MindsGroup)[]> =
    new BehaviorSubject([]);

  /**
   * How many recommendations to show at a time?
   */
  listSize$: BehaviorSubject<number> = new BehaviorSubject(
    this.initialListSize
  );

  @Input('listSize') set _listSize(size: number) {
    this.listSize$.next(size);
  }

  @Input() noOuterPadding: boolean = false;

  /**
   * Emit when user subscribes to a recommendation
   */
  @Output() subscribed: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emit when user unsubscribes from a recommendation
   */
  @Output() unsubscribed: EventEmitter<any> = new EventEmitter<any>();

  @Output() loaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * New graphql way of loading data, if this value is inputted then no additional data calls will be made
   */
  @Input() connection: PublisherRecsConnection;

  private subscriptions: Subscription[] = [];

  constructor(
    private api: ApiService,
    public experiments: ExperimentsService,
    private recentSubscriptions: RecentSubscriptionsService,
    private dismissal: DismissalService,
    private analyticsService: AnalyticsService,
    private newsfeedService: NewsfeedService,
    @Optional() @SkipSelf() protected parentClientMeta: ClientMetaDirective,
    private parseJson: ParseJson,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (this.initialListSize) {
      this.listSize$.next(this.initialListSize);
    }

    if (this.connection) {
      this.recommendations$.next(
        this.connection.edges.map((e: any) => {
          return <MindsUser | MindsGroup>(
            this.parseJson.transform(
              (<UserNode | BoostNode | GroupNode>e.publisherNode).legacy
            )
          );
        })
      );

      this.subscriptions.push(
        this.recommendations$.pipe(take(1)).subscribe((recs) => {
          // Makes sure we know what the publisher type is,
          // even if the recommendations are coming from gql
          let rec = recs[0];

          if (
            rec &&
            rec.type &&
            (rec.type === 'user' || rec.type === 'group')
          ) {
            this.publisherType = rec.type;
          }
        })
      );

      return; // Don't load data via api
    }

    if (isPlatformServer(this.platformId)) {
      return; // Don't load anything is server side
    }

    if (this.publisherType === 'group') {
      this.loadGroups();
    }
    if (this.location && this.publisherType === 'user') {
      this.loadChannels();
    }
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Load list of channel suggestions
   */
  async loadChannels(): Promise<void> {
    this.api
      .get('api/v3/recommendations', {
        location: this.location,
        mostRecentSubscriptions: this.recentSubscriptions.list(),
        currentChannelUserGuid: this.channelId,
        limit: 12,
      })
      .toPromise()
      .then((result) => {
        this.loaded.emit(true);
        if (result) {
          this.recommendations$.next(result.entities.map((e) => e.entity));
        }
      });
  }

  /**
   * Load a list of group suggestions
   */
  async loadGroups(): Promise<void> {
    this.api
      .get('api/v2/suggestions/group', {
        limit: 12,
      })
      .toPromise()
      .then((result) => {
        this.loaded.emit(true);
        if (result) {
          this.recommendations$.next(result.suggestions.map((e) => e.entity));
        }
      });
  }

  /**
   * tracks views of channel rec items
   * @param { MindsUser } channel - the entity
   * @param { number } position - position in the channel recs
   */
  trackView(channel: MindsUser, position: number) {
    if (this.parentClientMeta) {
      if (channel.boosted_guid) {
        this.newsfeedService.recordView(
          channel,
          true,
          null,
          this.parentClientMeta.build({
            position,
            medium: 'channel-recs',
            campaign: channel.urn,
          })
        );
        return;
      }

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
    this.containerHeight$.next(event.newRect.height + 40);
  }

  /**
   * When a recommendation is subscribed, remove it from the list——unless the list length is small
   */
  onSubscribed(publisher): void {
    this.subscribed.emit();

    if (this.listSize$.getValue() === this.initialListSize) {
      this.listSize$.next(this.initialListSize);
    }

    if (this.recommendations$.getValue().length <= this.initialListSize) {
      return;
    }

    this.recommendations$.next(
      this.recommendations$.getValue().filter((p) => p.guid !== publisher.guid)
    );
  }

  onUnsubscribed(publisher): void {
    this.unsubscribed.emit();
  }

  onGroupMembershipChange(
    $event: GroupMembershipChangeOuput,
    group: MindsGroup
  ) {
    if ($event.isMember) {
      this.onSubscribed(group);
    } else {
      this.onUnsubscribed(group);
    }
  }

  /**
   * Improves change detection
   */
  trackByFn(i: number, user: MindsUser) {
    return user.guid;
  }
}
