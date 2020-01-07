import { Injectable } from '@angular/core';

@Injectable()
export class InMemoryStorageService {
  protected entries: { [key: string]: any } = {};

  get(key: string): null | any {
    if (typeof this.entries[key] === 'undefined') {
      return null;
    }

    return this.entries[key];
  }

  set(key: string, value: any): this {
    this.entries[key] = value;
    return this;
  }

  destroy(key: string): this {
    if (typeof this.entries[key] === 'undefined') {
      return this;
    }

    delete this.entries[key];
    return this;
  }

  once(key: string): any {
    const value = this.get(key);
    this.destroy(key);

    return value;
  }

  static _() {
    return new InMemoryStorageService();
  }
}
