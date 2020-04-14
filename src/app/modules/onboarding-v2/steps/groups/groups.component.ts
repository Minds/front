import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingV2Service } from '../../service/onboarding.service';

@Component({
  selector: 'm-onboarding__groupsStep',
  templateUrl: 'groups.component.html',
})
export class GroupsStepComponent {
  pendingItems: string[];

  constructor(protected onboardingService: OnboardingV2Service) {
    this.onboardingService.setCurrentStep('groups');
    this.pendingItems = this.onboardingService.getPendingItems();
  }

  skip() {
    this.onboardingService.next();
  }

  continue() {
    this.onboardingService.next();
  }
}
