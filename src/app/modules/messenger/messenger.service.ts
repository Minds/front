import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FeaturesService } from '../../services/features.service';
import { Storage } from '../../services/storage';

@Injectable({
  providedIn: 'root',
})
export class MessengerService {
  showLegacyMessenger$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(
    protected featuresService: FeaturesService,
    protected storage: Storage
  ) {}

  /**
   * If there's no preferred value in local storage,
   * determine visibility with matrix feature
   * (don't show if feature enabled)
   */
  public setupLegacyMessengerVisibility(): void {
    const matrixFeature = this.featuresService.has('matrix');
    const storage = this.storage.get('legacy_messenger');

    const show = storage === null ? !matrixFeature : JSON.parse(storage);

    this.showLegacyMessenger$.next(show);
  }
}
