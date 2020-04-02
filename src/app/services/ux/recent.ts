import { Injectable } from '@angular/core';

import { Storage } from '../storage';

@Injectable()
export class RecentService {
  constructor(private storage: Storage) {}

  store(key: string, entry: any, cleanupFn?: Function) {
    let data = this.read(key);

    if (cleanupFn) {
      data = data.filter(e => !cleanupFn(e));
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
