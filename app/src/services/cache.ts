export class CacheService {
  private storage = {};

  public set(key: string, value: any) {
    this.storage[key] = value;
    return this;
  }

  public get(key: string) {
    if (typeof this.storage[key] === 'undefined') {
      return;
    }

    return this.storage[key];
  }
}
