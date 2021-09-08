import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '../../services/storage';

@Injectable()
export class BoostRecommendationService {
  /**
   * toggle to show boost recommendation
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

  constructor(protected storage: Storage) {
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
   * Recommends to boost a post by showing a tooltip
   **/
  recommendBoost(guid: string) {
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
