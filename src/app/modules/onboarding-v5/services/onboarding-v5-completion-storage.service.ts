import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

/**
 * Service for the storing of a local storage item when a user
 * has completed onboarding - the user is used in the key to avoid
 * multi-user collisions.
 */
@Injectable({
  providedIn: 'root',
})
export class OnboardingV5CompletionStorageService {
  /** Storage key prefix */
  private readonly STORAGE_KEY_PREFIX = 'onboarding-v5-completed-';

  constructor(@Inject(PLATFORM_ID) private platformId) {}

  /**
   * Set a storage item exists that indicates that
   * the user has completed onboarding.
   * @param { string } guid - the user's guid.
   * @returns { void }
   */
  public setAsCompleted(guid: string): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    localStorage.setItem(this.getStorageKey(guid), '1');
  }

  /**
   * Whether a storage item exists that indicates that
   * the user has completed onboarding.
   * @param { string } guid - the user's guid.
   * @returns { boolean } true if a storage item exists that
   * indicates that the user has completed onboarding.
   */
  public isCompleted(guid: string): boolean {
    if (isPlatformServer(this.platformId)) {
      return true;
    }

    return localStorage.getItem(this.getStorageKey(guid)) === '1';
  }

  /**
   * Get the key for storage for a given user guid.
   * @param { string } guid - the user's guid.
   * @returns { string }
   */
  private getStorageKey(guid: string): string {
    return `${this.STORAGE_KEY_PREFIX}${guid}`;
  }
}
