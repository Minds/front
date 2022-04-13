import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../../common/api/api.service';
import { ExperimentsService } from '../../experiments/experiments.service';
import { RecentSubscriptionsService } from '../../../common/services/recent-subscriptions.service';
import { MindsUser } from '../../../interfaces/entities';
import { ResizedEvent } from './../../../common/directives/resized.directive';

/**
 * a component that shows channel recommendations
 */
@Component({
  selector: 'm-channelRecommendation',
  templateUrl: './channel-recommendation.component.html',
  styleUrls: ['./channel-recommendation.component.ng.scss'],
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
          limit: 3,
        })
        .toPromise()
        .then(result => {
          if (result) {
            this.recommendations$.next(
              result.entities.map(e => e.entity).slice(0, 3)
            );
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
}
