import {
  OnInit,
  Component,
  ComponentFactoryResolver,
  ViewChild,
} from '@angular/core';
import { DynamicHostDirective } from '../../../common/directives/dynamic-host.directive';
import { TokenRewardsOnboardingComponent } from '../../wallet/tokens/onboarding/rewards/rewards.component';

@Component({
  selector: 'm-blockchain--marketing--onboard',
  template: `
    <ng-template dynamic-host></ng-template>
  `,
})
export class BlockchainMarketingOnboardComponent implements OnInit {
  @ViewChild(DynamicHostDirective, { static: true }) host: DynamicHostDirective;

  componentRef;
  componentInstance: TokenRewardsOnboardingComponent;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
        TokenRewardsOnboardingComponent
      ),
      viewContainerRef = this.host.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentInstance = this.componentRef.instance;
  }
}
