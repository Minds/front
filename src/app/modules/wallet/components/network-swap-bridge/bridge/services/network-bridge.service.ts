import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NetworkBridgeService implements OnDestroy {
  public readonly selectedBridge$ = new BehaviorSubject<any | null>({});

  ngOnDestroy() {}
}
