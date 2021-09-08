import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivityEntity, ActivityService } from '../activity.service';
import { BoostRecommendationService } from '../../../../common/services/boost-recommendation.service';

@Component({
  selector: 'm-activity__boostButton',
  templateUrl: 'boost-button.html',
  styleUrls: ['boost-button.component.scss']
})
export class ActivityBoostButtonComponent {
  @Input()
  object = {
    guid: null,
  };

  constructor(public boostRecommendationService: BoostRecommendationService) {}
}
