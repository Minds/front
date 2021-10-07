import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BoostRecommendationService } from '../../../../common/services/boost-recommendation.service';

@Component({
  selector: 'm-activity__boostButton',
  templateUrl: 'boost-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityBoostButtonComponent implements OnInit {
  @Input()
  object = {
    guid: undefined,
  };
  boostRecommendationsSubscription: Subscription;
  shouldShowTooltip: BehaviorSubject<boolean> = new BehaviorSubject(false);
  shouldShowShimmer: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(public boostRecommendationService: BoostRecommendationService) {}

  ngOnInit() {
    this.boostRecommendationsSubscription = this.boostRecommendationService.boostRecommendations.subscribe(
      boostRecommendations => {
        if (boostRecommendations.find(guid => guid === this.object.guid)) {
          if (!this.boostRecommendationService.boostRecommended.getValue()) {
            this.shouldShowTooltip.next(true);
          }

          this.shouldShowShimmer.next(true);
        } else {
          this.shouldShowTooltip.next(false);
          this.shouldShowShimmer.next(false);
        }
      }
    );
  }

  ngOnDestroy() {
    this.boostRecommendationsSubscription?.unsubscribe();
  }
}
