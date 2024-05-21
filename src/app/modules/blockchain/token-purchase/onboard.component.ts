import { OnInit, Component, ViewChild } from '@angular/core';
import { DynamicHostDirective } from '../../../common/directives/dynamic-host.directive';
import { TokenRewardsOnboardingComponent } from '../../wallet/tokens/onboarding/rewards/rewards.component';

@Component({
  selector: 'm-blockchain--marketing--onboard',
  template: ` <ng-template dynamic-host></ng-template> `,
})
export class BlockchainMarketingOnboardComponent implements OnInit {
  @ViewChild(DynamicHostDirective, { static: true }) host: DynamicHostDirective;

  componentRef;
  componentInstance: TokenRewardsOnboardingComponent;

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {
    const viewContainerRef = this.host.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(
      TokenRewardsOnboardingComponent
    );
    this.componentInstance = this.componentRef.instance;
  }
}
