import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Preload a message into blogs.
 *
 * TODO: Retain linebreaks.
 */
@Injectable({ providedIn: 'root' })
export class BlogPreloadService {
  /**
   * Message to be preloaded - publically accessible Observable
   */
  public readonly message$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  /**
   * Set preloaded message to an empty string.
   * @returns { void }
   */
  public clear(): void {
    this.message$.next('');
  }

  /**
   * Set next preloaded message.
   * @returns { void }
   */
  public next(message): void {
    this.message$.next(message);
  }

  /**
   * Get current value of preloaded message.
   * @returns { string } string containing preloaded message.
   */
  public getValue(): string {
    return this.message$.getValue();
  }
}
