import {
  ComponentFactoryResolver,
  Injectable,
  Injector,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Network,
  NetworkSwitchService,
} from '../../../../../../common/services/network-switch-service';
import {
  BridgeComponent,
  BridgeService,
  BridgeStep,
  CurrentStep,
} from '../constants/constants.types';
import { WithdrawTransactionStateComponent } from '../components/withdraw-transaction-state/withdraw-transaction-state.component';
import { PolygonService } from './polygon/polygon.service';
import { SkaleService } from '../../skale/skale.service';

@Injectable({ providedIn: 'root' })
export class NetworkBridgeService implements OnDestroy {
  public readonly selectedBridge$ = new BehaviorSubject<Network | undefined>(
    undefined
  );

  public readonly currentStep$ = new BehaviorSubject<CurrentStep>({
    step: BridgeStep.SWAP,
  });

  constructor(
    private readonly cfr: ComponentFactoryResolver,
    private readonly networkSwitchService: NetworkSwitchService,
    public injector: Injector
  ) {}

  ngOnDestroy() {}

  async loadComponent(vcr: ViewContainerRef, step: BridgeStep) {
    vcr.clear();
    const component: any = await this.getPanel(step);
    const componentRef = vcr.createComponent(
      this.cfr.resolveComponentFactory<BridgeComponent>(component)
    );
    componentRef.instance.data = this.currentStep$.value.data;
    return componentRef;
  }

  async getPanel(step: BridgeStep) {
    const { NetworkBridgeSwapBoxComponent } = await import(
      '../components/swap-box/swap-box.component'
    );

    const { NetworkBridgeApprovalComponent } = await import(
      '../components/approval-dialog/approval-dialog.component'
    );

    const { NetworkBridgeConfirmationComponent } = await import(
      '../components/confirm-dialog/confirm-dialog.component'
    );

    const { NetworkBridgePendingComponent } = await import(
      '../components/transaction-state/transaction-state.component'
    );

    const { NetworkBridgeErrorComponent } = await import(
      '../components/error-dialog/error-dialog.component'
    );

    switch (step) {
      case BridgeStep.SWAP:
        return NetworkBridgeSwapBoxComponent;
      case BridgeStep.APPROVAL:
        return NetworkBridgeApprovalComponent;
      case BridgeStep.CONFIRMATION:
        return NetworkBridgeConfirmationComponent;
      case BridgeStep.PENDING:
        return NetworkBridgePendingComponent;
      case BridgeStep.ACTION_REQUIRED:
        return WithdrawTransactionStateComponent;
      case BridgeStep.ERROR:
      default:
        return NetworkBridgeErrorComponent;
    }
  }

  getBridgeService(): BridgeService {
    if (
      this.selectedBridge$.value.id ===
      this.networkSwitchService.networks.polygon.id
    ) {
      return this.injector.get(PolygonService);
    } else {
      return this.injector.get(SkaleService);
    }
  }
}
