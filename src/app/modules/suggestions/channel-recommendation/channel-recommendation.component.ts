import { map } from 'rxjs/operators';
import {
  DismissalService,
  DismissIdentifier,
} from './../../../common/services/dismissal.service';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../../common/api/api.service';
import { RecentSubscriptionsService } from '../../../common/services/recent-subscriptions.service';
import { MindsUser } from '../../../interfaces/entities';
import { ExperimentsService } from '../../experiments/experiments.service';
import { DropdownMenuOption } from './../../../common/components/dropdown-menu-v2/dropdown-menu-v2.component';
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
   * drop down items
   */
  dropdownOptions: DropdownMenuOption[] = [
    {
      title: $localize`:@@COMMON__REMOVE_FROM_FEED:Remove from feed`,
      onPress: () => this.dismissalService.dismiss(this.widgetId),
      icon: {
        id: 'close',
        from: 'md',
      },
    },
  ];

  constructor(
    private api: ApiService,
    public experiments: ExperimentsService,
    private recentSubscriptions: RecentSubscriptionsService,
    private dismissalService: DismissalService
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

  /**
   * A unique identifier for this component. Used for dismissing this widget. It varies depending on this.location
   */
  get widgetId(): DismissIdentifier {
    return `channel-recommendation:${
      this.location === 'channel' ? 'channel' : 'feed'
    }`;
  }
}
