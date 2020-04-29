import { Injectable } from '@angular/core';
import { Storage } from '../../../services/storage';

/**
 * Most recently used hashtags service. Based off default storage service.
 */
@Injectable()
export class MruService {
  constructor(protected storage: Storage) {}

  /**
   * Resets MRU list
   * @param key
   */
  reset(key: string): MruService {
    this.storage.set(this.buildKey(key), JSON.stringify([]));
    return this;
  }

  /**
   * Pushes new MRU items
   * @param key
   * @param tags
   */
  push(key: string, tags: string[]): MruService {
    const items = [...tags, ...this.fetch(key)]
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
      .slice(0, 500);

    this.storage.set(this.buildKey(key), JSON.stringify(items));
    return this;
  }

  /**
   * Fetches MRU items
   * @param key
   */
  fetch(key: string): string[] {
    return JSON.parse(this.storage.get(this.buildKey(key)) || '[]') || [];
  }

  /**
   * Builds local storage key
   * @param key
   */
  protected buildKey(key: string): string {
    return `mru:hashtags:${key || '_'}`;
  }
}
