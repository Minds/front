import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '../../services/storage';

@Injectable()
export class BoostRecommendationService {
  /**
   * toggle to show boost recommendation
   **/
  public showBoostRecommendationForPost$: BehaviorSubject<
    string
  > = new BehaviorSubject<string>(null);
  /**
   * is boosting already recommended for this session?
   * if it was already recommended, the button will shimmer,
   * otherwise, a tooltip will be shown
   **/
  public boostRecommended: boolean = false;

  constructor(protected storage: Storage) {
    this.boostRecommended = Boolean(this.storage.get('boost:recommended'));
  }

  /**
   * Recommends to boost a post by showing a tooltip
   **/
  recommendBoost(guid: string) {
    this.showBoostRecommendationForPost$.next(guid);
    setTimeout(
      () => {
        this.showBoostRecommendationForPost$.next(null);
        this.storage.set('boost:recommended', true); // save to storage
        this.boostRecommended = true;
      },
      this.boostRecommended ? 12000 : 6000
    );
  }
}
