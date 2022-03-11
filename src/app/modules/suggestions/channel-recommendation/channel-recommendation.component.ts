import { Session } from './../../../services/session';
import { BehaviorSubject } from 'rxjs';
import { MindsUser } from '../../../interfaces/entities';
import { ApiService } from '../../../common/api/api.service';
import { Component, Input, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'm-channelRecommendation',
  templateUrl: './channel-recommendation.component.html',
  styleUrls: ['./channel-recommendation.component.ng.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state(
        'closed',
        style({
          height: '0px',
        })
      ),
      state(
        'open',
        style({
          height: '200px',
        })
      ),
      transition('* => closed', [animate('1s')]),
      transition('* => open', [animate('0.5s')]),
    ]),
  ],
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
  _containerHeight$: BehaviorSubject<number> = new BehaviorSubject(0);

  recommendations$: BehaviorSubject<MindsUser[]> = new BehaviorSubject([]);

  constructor(private api: ApiService, private session: Session) {}

  ngOnInit(): void {
    if (this.location) {
      this.api
        .get('api/v3/recommendations', {
          location: this.location,
          mostRecentSubscriptionUserGuid: this.session.getLoggedInUser()?.guid,
          targetUserGuid: this.channelId,
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
  onResized(event: ResizedEvent) {
    this._containerHeight$.next(event.newRect.height + 64);
  }
}
