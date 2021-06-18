import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable()
export class Storage {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  static _(platformId: Object) {
    return new Storage(platformId);
  }

  get(key: string) {
    if (isPlatformServer(this.platformId)) return null;
    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      // We are catching here as some browser block localstorege.
      // TODO: Extend to .set and .destroy once this is verified as fix
      console.log(err);
      return null;
    }
  }
  set(key: string, value: any) {
    if (isPlatformServer(this.platformId)) return;
    return window.localStorage.setItem(key, value);
  }
  destroy(key: string) {
    if (isPlatformServer(this.platformId)) return;
    return window.localStorage.removeItem(key);
  }

  clear() {
    if (isPlatformServer(this.platformId)) return;
    window.localStorage.clear();
  }
}
