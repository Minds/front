import { Injectable } from '@angular/core';

import { Storage } from '../storage';

export type SearchSuggestionType = 'text' | 'publisher';

@Injectable()
export class RecentService {
  constructor(private storage: Storage) {}

  store(key: string, entry: any, cleanupFn?: Function) {
    let data = this.read(key);

    if (cleanupFn) {
      data = data.filter((e) => !cleanupFn(e));
    }

    data.unshift(entry);

    this.write(key, data);

    return this;
  }

  fetch(key: string, limit?: number) {
    let data = this.read(key);

    if (limit) {
      data.splice(0, data.length - limit);
    }

    return data;
  }

  splice(key: string, deleteCount: number) {
    this.write(key, this.read(key).splice(0, deleteCount));

    return this;
  }

  clear(key: string) {
    this.delete(key);

    return this;
  }

  /**
   * Store suggestion
   */
  storeSuggestion(
    type: SearchSuggestionType,
    suggestionObj: any,
    cleanupFn?: Function
  ): void {
    const key = `suggestions:${type}`;
    let entry = suggestionObj;

    entry['recent_timestamp'] = Date.now();
    if (type === 'text') {
      entry['type'] = 'text';
    }

    this.store(key, entry, cleanupFn);
    this.splice(key, 50);
  }

  /**
   * Get a list of suggestions in reverse order of their recent_timestamps
   */
  fetchSuggestions(): Array<any> {
    const textSuggestions = this.read('suggestions:text');
    const publishersSuggestions = this.read('suggestions:publisher').filter(
      (user) => !user.blocked
    );

    let suggestions = textSuggestions.concat(publishersSuggestions);

    if (!suggestions.length) return;

    suggestions.sort((a, b) => b.recent_timestamp - a.recent_timestamp);

    return suggestions.splice(0, 20);
  }

  clearSuggestions(): void {
    this.clear('suggestions:publisher');
    this.clear('suggestions:text');
    this.clear('recent:text'); // legacy
    this.clear('recent'); // legacy
  }

  //

  private read(key: string): any[] {
    return JSON.parse(this.storage.get(`recent:${key}`) || '[]');
  }

  private write(key: string, data: any[]) {
    this.storage.set(`recent:${key}`, JSON.stringify(data));
  }

  private delete(key: string) {
    this.storage.destroy(`recent:${key}`);
  }

  //

  static _(storage: Storage) {
    return new RecentService(storage);
  }
}
