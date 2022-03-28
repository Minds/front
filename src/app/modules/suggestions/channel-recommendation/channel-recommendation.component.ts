import { BehaviorSubject } from 'rxjs';
import { MindsUser } from '../../../interfaces/entities';
import { ApiService } from '../../../common/api/api.service';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ExperimentsService } from '../../experiments/experiments.service';

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
  recommendations$: BehaviorSubject<MindsUser[]> = new BehaviorSubject([]);

  constructor(
    private api: ApiService,
    public experiments: ExperimentsService
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
}
