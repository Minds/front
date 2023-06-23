import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Service for the feature carousel component.
 */
@Injectable({ providedIn: 'root' })
export class FeatureCarouselService {
  /** Emit to jump the carousel to a specified index. */
  public readonly jumpToItemIndex$: Subject<number> = new Subject<number>();
}
