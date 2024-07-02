import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

/**
 * Common service for tenant custom homepage.
 */
@Injectable({ providedIn: 'root' })
export class TenantCustomHomepageService {
  /** Whether members section has reported as loaded. */
  public readonly isMembersSectionLoaded$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Whether groups section has reported as loaded. */
  public readonly isGroupsSectionLoaded$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Whether the all sections have reported as loaded. */
  public readonly isLoaded$: Observable<boolean> = combineLatest([
    this.isMembersSectionLoaded$,
    this.isGroupsSectionLoaded$,
  ]).pipe(
    map(([members, groups]: [boolean, boolean]): boolean => members && groups)
  );
}
