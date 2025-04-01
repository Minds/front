import { isPlatformServer } from '@angular/common';
import { ElementRef, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { platform } from 'os';
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
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Create interception observer and observe it.
   * @param { ElementRef } element - element to observe
   * @returns { Observable<boolean> } true when element is visible, else false.
   */
  public createAndObserve(
    element: ElementRef,
    opts: IntersectionObserverInit = {}
  ): Observable<boolean> {
    return new Observable((observer) => {
      if (isPlatformServer(this.platformId)) {
        return () => {};
      }
      const intersectionObserver = new IntersectionObserver((entries) => {
        observer.next(entries);
      }, opts);

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
