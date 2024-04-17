import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Used to pass the inProgress$ state between services and components.
 */
@Injectable({ providedIn: 'root' })
export class OnboardingV3ModalProgressService {
  private readonly _inProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public next(inProgress): void {
    this._inProgress$.next(inProgress);
  }

  public get inProgress$(): BehaviorSubject<boolean> {
    return this._inProgress$;
  }
}
