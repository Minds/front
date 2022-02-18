import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MindsUser } from './../../../interfaces/entities';
import { StorageV2 } from './../../../services/storage/v2';
import { ApiService } from './../../api/api.service';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { ApiResourceService } from '../../api/api-resource.service';

@Injectable()
export class ChannelRecommendationResource extends ApiResourceService<{
  algorithm: string;
  entities: {
    entity_guid: string;
    entity_type: string;
    entity: MindsUser;
    confidence_score: number;
  }[];
}> {
  constructor(protected api: ApiService, protected storage: StorageV2) {
    super({
      url: 'api/v3/recommendations',
      cachePolicy: ApiResourceService.CachePolicy.cacheThenFetch,
    });
  }
}

@Component({
  selector: 'm-channelRecommendation',
  templateUrl: './channel-recommendation.component.html',
  styleUrls: ['./channel-recommendation.component.ng.scss'],
  providers: [ChannelRecommendationResource],
})
export class ChannelRecommendationComponent implements OnInit {
  /**
   * the location in which this component appears
   */
  @Input()
  location: string;
  recommendations$: Observable<
    MindsUser[]
  > = this.channelRecommendations.result$.pipe(
    map(result => result?.entities.map(e => e.entity).slice(0, 3) || [])
  );

  constructor(public channelRecommendations: ChannelRecommendationResource) {}

  ngOnInit(): void {
    if (this.location) {
      this.channelRecommendations.load({
        location: this.location,
      });
    }
  }
}
