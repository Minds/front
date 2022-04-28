import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../../common/api/api.service';
import { RecentSubscriptionsService } from '../../../common/services/recent-subscriptions.service';
import { MindsUser } from '../../../interfaces/entities';
import { ExperimentsService } from '../../experiments/experiments.service';
import { ResizedEvent } from './../../../common/directives/resized.directive';

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
 * a component that shows channel recommendations
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
  location: string;
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
   * the height of the container, used to animate the mount and unmount of this component
   */
  containerHeight$: BehaviorSubject<number> = new BehaviorSubject(0);

  /** a list of recommended channels */
  recommendations$: BehaviorSubject<MindsUser[]> = new BehaviorSubject([]);
  /**
   * How many recommendations to show at a time?
   */
  listSize$: BehaviorSubject<number> = new BehaviorSubject(3);

  constructor(
    private api: ApiService,
    public experiments: ExperimentsService,
    private recentSubscriptions: RecentSubscriptionsService
  ) {}

  @HostBinding('class.m-channelRecommendation--activityV2')
  get activityV2Feature(): boolean {
    return this.experiments.hasVariation('front-5229-activities', true);
  }

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

    this.recommendations$.next(
      this.recommendations$.getValue().filter(u => u.guid !== user.guid)
    );
  }
}
