import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

/**
 * Store an object in local storage - handles the parsing and stringification  of objects for storage.
 */
@Injectable({ providedIn: 'root' })
export class ObjectLocalStorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Set a single sub-object.
   * @param { string } storageKey - key we're storing under.
   * @param { any } object - sub-object to store (key => value).
   * @returns { this }
   */
  public setSingle(storageKey: string, object: any): this {
    const current = this.getAll(storageKey);

    if (!current) {
      return this.setAll(storageKey, object);
    }

    return this.setAll(storageKey, {
      ...current,
      ...object,
    });
  }

  /**
   * Remove a single key
   * @param { string } storageKey - key we're storing under.
   * @param { string } objectKey - sub-object key to remove.
   * @returns
   */
  public removeSingle(storageKey: string, objectKey: string): this {
    let object = this.getAll(storageKey);
    delete object[objectKey];
    return this.setAll(storageKey, object);
  }

  /**
   * Overwrite the whole object in local storage.
   * @param { string } storageKey - key we're setting.
   * @param { any } object - replacement object.
   * @returns { this }
   */
  public setAll(storageKey: string, object: any): this {
    if (isPlatformServer(this.platformId)) return this;
    try {
      localStorage.setItem(storageKey, JSON.stringify(object));
    } catch (e) {
      console.error(e);
    }
    return this;
  }

  /**
   * Gets whole object from local storage.
   * @param { any } storageKey - key we're storing under.
   * @returns { Object } Object from local storage.
   */
  public getAll(storageKey: string): any {
    if (isPlatformServer(this.platformId)) return [];
    try {
      return JSON.parse(localStorage.getItem(storageKey)) ?? {};
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  /**
   * Delete all entries from storage object.
   * @param { string } storageKey - key we're deleting object for.
   * @returns { this }
   */
  public deleteAll(storageKey: string): this {
    if (isPlatformServer(this.platformId)) return this;
    localStorage.removeItem(storageKey);
    return this;
  }
}
