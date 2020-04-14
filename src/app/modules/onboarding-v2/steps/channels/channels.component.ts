import { Component } from '@angular/core';
import { OnboardingV2Service } from '../../service/onboarding.service';

@Component({
  selector: 'm-onboarding__channelsStep',
  templateUrl: 'channels.component.html',
})
export class ChannelsStepComponent {
  pendingItems: string[];

  constructor(protected onboardingService: OnboardingV2Service) {
    this.onboardingService.setCurrentStep('channels');
    this.pendingItems = this.onboardingService.getPendingItems();
  }

  finish() {
    this.onboardingService.next();
  }
}
