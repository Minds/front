import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay, switchMap } from 'rxjs';
import { ApiService } from '../../../../common/api/api.service';
import { BootstrapStepProgress } from '../components/bootstrap-progress-splash/bootstrap-progress-splash.service';

/**
 * Bootstrap progress event socket service.
 */
@Injectable({ providedIn: 'root' })
export class BootstrapProgressService {
  /** Subject for loading bootstrap progress. */
  private load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /** Subject for bootstrap progress. */
  public readonly progress$ = this.load$.pipe(
    switchMap(
      (): Observable<BootstrapStepProgress[]> =>
        this.api.get<BootstrapStepProgress[]>(
          '/api/v3/tenant-bootstrap/progress'
        )
    ),
    shareReplay()
  );

  constructor(private readonly api: ApiService) {}

  /**
   * Load bootstrap progress.
   * @returns { void }
   */
  public load(): void {
    this.load$.next(true);
  }

  /**
   * Check if a step has already completed.
   * @param { string } stepName - Name of step.
   * @returns { Observable<boolean> }
   */
  public hasAlreadyCompletedStep(stepName: string): Observable<boolean> {
    return this.progress$.pipe(
      map((progress: BootstrapStepProgress[]): boolean =>
        progress.some(
          (step: BootstrapStepProgress): boolean =>
            step.stepName === stepName && step.success
        )
      )
    );
  }
}
