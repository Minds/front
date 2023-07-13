import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ExperimentsService } from './experiments.service';
import { ToasterService } from '../../common/services/toaster.service';

/**
 * Router guard to ensure a route can only be accessed when a specific experiment variation is active.
 * If NOT active, will redirect to the root URL '/'.
 * @param { string } experimentId - id of the experiment to check.
 * @param { string | number | boolean } variation - variation to check for.
 * @returns { CanActivateFn } - guard function.
 */
export function experimentVariationGuard(
  experimentId: string,
  variation: string | number | boolean = true
): CanActivateFn {
  return (): boolean => {
    const hasVariation: boolean = inject(ExperimentsService).hasVariation(
      experimentId,
      variation
    );

    if (!hasVariation) {
      inject(ToasterService).warn('This feature is not currently enabled');
      inject(Router).navigate(['/']);
      return false;
    }

    return true;
  };
}
