import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiResource,
  ResourceRef
} from './../../../common/api/api-resource.service';
import { MindsUser } from './../../../interfaces/entities';

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
  channelRecommendations: ResourceRef<
    {
      algorithm: string;
      entities: {
        entity_guid: string;
        entity_type: string;
        entity: MindsUser;
        confidence_score: number;
      }[];
    },
    any
  >;
  recommendations$: Observable<MindsUser[]>;

  constructor(public apiResource: ApiResource) {}

  ngOnInit(): void {
    if (this.location) {
      this.channelRecommendations = this.apiResource.query(
        'api/v3/recommendations',
        {
          cachePolicy: ApiResource.CachePolicy.cacheThenFetch,
          params: {
            location: this.location,
          },
        }
      );
      this.recommendations$ = this.channelRecommendations.data$.pipe(
        map(result => result?.entities.map(e => e.entity).slice(0, 3) || [])
      );
    }
  }
}
