import { transition, style, animate, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MindsUser } from '../../../interfaces/entities';
import { ApiService } from '../../../common/api/api.service';

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
  recommendations$: BehaviorSubject<MindsUser[]> = new BehaviorSubject([]);

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    if (this.location) {
      this.api
        .get('api/v3/recommendations', {
          location: this.location,
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
   * When a recommendation is subscribed, remove it from the list——unless the list length is small
   */
  onSubscribed(user): void {
    if (this.recommendations$.getValue().length <= 3) {
      return;
    }

    this.recommendations$.next(
      this.recommendations$.getValue().filter(u => u.guid !== user.guid)
    );
  }
}
