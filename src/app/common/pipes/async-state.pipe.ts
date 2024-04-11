import { Pipe, PipeTransform } from '@angular/core';
import { isObservable, Observable, of } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';

export interface AsyncState<T> {
  pending: boolean;
  value?: T;
  error?: any;
}

/**
 * Checks if the passed value matches the pending partial. For
 * non-objects it'll perform a strict equality of the values.
 * For objects it'll check all the keys.
 * @param value
 * @param pendingIf
 */
function isPending<T>(value: T, pendingIf: T | Partial<T>): boolean {
  if (typeof pendingIf !== 'object') {
    return value === pendingIf;
  }

  if (typeof value !== 'object') {
    return true;
  }

  const props = Object.getOwnPropertyNames(pendingIf);

  for (let i = 0; i < props.length; i++) {
    const propName = props[i];

    if (value[propName] !== pendingIf[propName]) {
      return false;
    }
  }

  return true;
}

/**
 * This pipe will wrap an observable onto an object which
 * will reflect its pending state, value and/or error message.
 */
@Pipe({
  name: 'asyncState',
})
export class AsyncStatePipe implements PipeTransform {
  transform<T>(
    value: Observable<T> | T,
    pendingIf: T | Partial<T> = null
  ): Observable<AsyncState<T>> {
    if (!isObservable(value)) {
      return of({
        pending: false,
        value,
      });
    }

    return value.pipe(
      // Map value changes to AsyncState
      map(
        (value: T): AsyncState<T> => ({
          pending: typeof value === 'undefined' || isPending(value, pendingIf),
          value,
        })
      ),

      // Initial AsyncState emission
      startWith({
        pending: true,
      }),

      // Catch errors and transform onto AsyncState
      catchError((error) =>
        of({
          pending: false,
          error,
        })
      )
    );
  }
}
