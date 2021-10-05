import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ExperimentsService } from '../../modules/experiments/experiments.service';
import { Storage } from '../../services/storage';

@Injectable()
export class BoostRecommendationService {
  /**
   * a list of guids that have to be recommended
   **/
  public boostRecommendations: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  /**
   * is boosting already recommended for this session?
   * if it was already recommended, the button will shimmer,
   * otherwise, a tooltip will be shown
   **/
  public boostRecommended: boolean = false;

  constructor(
    protected storage: Storage,
    protected experimentsService: ExperimentsService
  ) {
    this.boostRecommended = Boolean(this.storage.get('boost:recommended'));
  }

  shouldShowTooltip(entityGuid) {
    return (
      !this.boostRecommended &&
      Boolean(
        this.boostRecommendations.getValue().find(guid => guid === entityGuid)
      )
    );
  }

  shouldShowBoost(entityGuid) {
    return this.boostRecommendations
      .getValue()
      .find(guid => guid === entityGuid);
  }

  /**
   * recommend to boost by adding the guid to a list
   * and removing it after some time.
   **/
  recommendBoost(guid: string) {
    if (this.experimentsService.run('boost-prompt') !== 'on') {
      return;
    }
    this.boostRecommendations.next([
      ...this.boostRecommendations.getValue(),
      guid,
    ]);
    setTimeout(
      () => {
        this.boostRecommendations.next(
          this.boostRecommendations.getValue().filter(p => p !== guid)
        );
        this.storage.set('boost:recommended', true); // save to storage
        this.boostRecommended = true;
      },
      this.boostRecommended ? 12000 : 6000
    );
  }
}
