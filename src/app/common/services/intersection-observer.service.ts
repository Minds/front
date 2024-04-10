import { ElementRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, mergeMap } from 'rxjs/operators';

/**
 * Wrapper for intersection observer.
 * Minor adaptions made to Piotr Sobuś @ https://stackoverflow.com/a/67273415/7396007
 */
@Injectable({
  providedIn: 'root',
})
export class IntersectionObserverService {
  /**
   * Create interception observer and observe it.
   * @param { ElementRef } element - element to observe
   * @returns { Observable<boolean> } true when element is visible, else false.
   */
  public createAndObserve(element: ElementRef): Observable<boolean> {
    return new Observable((observer) => {
      const intersectionObserver = new IntersectionObserver((entries) => {
        observer.next(entries);
      });

      intersectionObserver.observe(element.nativeElement);

      return () => {
        intersectionObserver.disconnect();
      };
    }).pipe(
      mergeMap((entries: IntersectionObserverEntry[]) => entries),
      map((entry: IntersectionObserverEntry) => entry.isIntersecting),
      distinctUntilChanged()
    );
  }
}
