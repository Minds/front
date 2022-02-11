import { ApiService } from './../../api/api.service';
import { Component, Injectable, OnInit } from '@angular/core';
import { ApiResource } from '../../api/api-resource.service';

@Injectable()
export class ChannelRecommendationResource extends ApiResource<any> {
  constructor(public api: ApiService) {
    super('api/v2/suggestions/user', {
      params: {
        type: 'all',
        limit: 3,
      },
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
  constructor(public channelRecommendations: ChannelRecommendationResource) {}

  ngOnInit(): void {
    this.channelRecommendations.load();
  }
}
