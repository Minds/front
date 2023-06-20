import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FeatureCarouselService {
  public readonly jumpToItemIndex$: Subject<number> = new Subject<number>();
}
