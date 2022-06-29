import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ExperimentsService } from '../../modules/experiments/experiments.service';
import { Storage } from '../../services/storage';

/**
 * the duration in ms within which a boost prompt should be shown once
 **/
const PROMPT_DISMISS_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in ms
const BOOST_RECOMMENDED_KEY = 'boost:recommendedAt';

@Injectable()
export class BoostRecommendationService {
  /**
   * a list of guids that have to be recommended
   **/
  public boostRecommendations$: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  /**
   * is boosting already recommended for this session?
   * if it was already recommended, the button will shimmer,
   * otherwise, a tooltip will be shown
   **/
  public boostRecommended$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  constructor(
    protected storage: Storage,
    protected experimentsService: ExperimentsService
  ) {
    const recommendedAt = this.storage.get(BOOST_RECOMMENDED_KEY);
    if (!recommendedAt) {
      return;
    }

    // if the last recommendation was more than 3 days ago
    if (Date.now() - Number(recommendedAt) > PROMPT_DISMISS_DURATION) {
      this.storage.destroy(BOOST_RECOMMENDED_KEY);
      return;
    }

    this.boostRecommended$.next(true);
  }

  /**
   * recommend to boost by adding the guid to a list
   * and removing it after some time.
   **/
  recommendBoost(guid: string) {
    this.boostRecommendations$.next([
      ...this.boostRecommendations$.getValue(),
      guid,
    ]);
    setTimeout(
      () => {
        this.boostRecommendations$.next(
          this.boostRecommendations$.getValue().filter(p => p !== guid)
        );
        this.storage.set(BOOST_RECOMMENDED_KEY, String(Date.now())); // save to storage
        this.boostRecommended$.next(true);
      },
      this.boostRecommended$.getValue() ? 12000 : 6000
    );
  }
}
