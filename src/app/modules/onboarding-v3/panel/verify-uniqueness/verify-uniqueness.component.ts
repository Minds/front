import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { StepName } from '../../onboarding-v3.service';
import { OnboardingV3PanelService } from '../onboarding-panel.service';

@Component({
  selector: 'm-onboardingV3__verifyUniqueness',
  templateUrl: './verify-uniqueness.component.html',
  styleUrls: ['./verify-uniqueness.component.ng.scss'],
  providers: [],
})
export class OnboardingV3VerifyUniquenessComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(private panel: OnboardingV3PanelService) {}

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public optionClicked(option: StepName): void {
    this.panel.currentStep$.next(option);
  }
}
