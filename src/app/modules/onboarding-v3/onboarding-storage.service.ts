import { Injectable } from '@angular/core';
import { Session } from '../../services/session';
import { Storage } from '../../services/storage';

/**
 * Possible onboarding key names as strings.
 */
export type OnboardingStorageKey =
  | 'onboarding:widget:completed'
  | 'onboarding:widget:collapsed';

/**
 * Local storage handler for OnboardingV3
 */
@Injectable({
  providedIn: 'root',
})
export class OnboardingV3StorageService {
  constructor(private storage: Storage, private session: Session) {}

  /**
   * Sets a new entry to mark completion or collapsing.
   * @param { OnboardingStorageKey } - key name.
   * @returns { void }
   */
  public set(key: OnboardingStorageKey): void {
    const futureTime =
      key === 'onboarding:widget:completed'
        ? 259200 // 3 days
        : 604800; // 1 week

    const expiryTimestamp = Date.now() + futureTime;
    const value = `${expiryTimestamp}:${this.session.getLoggedInUser().guid}`;

    this.storage.set(key, value); // expires 3 days
  }

  /**
   * Wrapper around storage for destroying a key from local storage.
   * @param { OnboardingStorageKey } - key name.
   * @returns { void } - destroy a key
   */
  public destroy(key: OnboardingStorageKey): void {
    this.storage.destroy(key);
  }

  /**
   * Determine whether a key has not expired or is invalid.
   * @param { OnboardingStorageKey } - key name.
   * @returns { boolean } - true if key has not expired.
   */
  public hasNotExpired(key: OnboardingStorageKey): boolean {
    const value = this.storage.get(key);

    // if no value, treat as expired.
    if (!value) {
      return false;
    }

    // destructuring split string array - userGuid:expiryTimestamp
    const [userGuid, expiryTimestamp] = value.split(':');

    // if this is a different user, expire.
    if (userGuid !== this.session.getLoggedInUser().guid) {
      this.destroy(key);
      return false;
    }

    const parsedExpiryTime: number = parseInt(expiryTimestamp);

    // if time set and not malformed or null.
    if (!isNaN(parsedExpiryTime)) {
      return Date.now() < parsedExpiryTime;
    }

    return false;
  }
}
