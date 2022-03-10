import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Network } from '../../../../../../common/services/network-switch-service';

@Injectable({ providedIn: 'root' })
export class NetworkBridgeService implements OnDestroy {
  public readonly selectedBridge$ = new BehaviorSubject<Network | undefined>(
    undefined
  );

  ngOnDestroy() {}
}
