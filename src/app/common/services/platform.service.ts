import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  isIOS$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {}

  setUp(): void {
    this.emitPlatform();
  }

  emitPlatform(): void {
    const isIOS: boolean =
      !!navigator.platform && /iP(hone|od|ad)/.test(navigator.platform);
    this.isIOS$.next(isIOS);
  }
}
