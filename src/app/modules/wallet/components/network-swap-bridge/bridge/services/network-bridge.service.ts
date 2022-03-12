import {
  Injectable,
  OnDestroy,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnChanges,
  SimpleChanges,
  ComponentRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Network } from '../../../../../../common/services/network-switch-service';
import { BridgeComponent, BridgeStep } from '../constants/constants.types';

@Injectable({ providedIn: 'root' })
export class NetworkBridgeService implements OnDestroy {
  public readonly selectedBridge$ = new BehaviorSubject<Network | undefined>(
    undefined
  );

  public readonly currentStep$ = new BehaviorSubject<BridgeStep | undefined>(
    BridgeStep.SWAP
  );

  public readonly currentStepData$ = new BehaviorSubject<any | undefined>(
    undefined
  );

  constructor(private cfr: ComponentFactoryResolver) {}

  ngOnDestroy() {}

  async loadComponent(vcr: ViewContainerRef, step: BridgeStep) {
    const { NetworkBridgeSwapBoxComponent } = await import(
      '../components/swap-box/swap-box.component'
    );

    const { NetworkBridgeApprovalComponent } = await import(
      '../components/approval-dialog/approval-dialog.component'
    );

    const { NetworkBridgeConfirmationComponent } = await import(
      '../components/confirm-dialog/confirm-dialog.component'
    );

    const { NetworkBridgeErrorComponent } = await import(
      '../components/error-dialog/error-dialog.component'
    );

    vcr.clear();
    let component: any =
      step === BridgeStep.SWAP
        ? NetworkBridgeSwapBoxComponent
        : step === BridgeStep.APPROVAL
        ? NetworkBridgeApprovalComponent
        : step === BridgeStep.CONFIRMATION
        ? NetworkBridgeConfirmationComponent
        : NetworkBridgeErrorComponent;

    const componentRef = vcr.createComponent(
      this.cfr.resolveComponentFactory<BridgeComponent>(component)
    );

    componentRef.instance.data = this.currentStepData$.value;

    return componentRef;
  }
}
