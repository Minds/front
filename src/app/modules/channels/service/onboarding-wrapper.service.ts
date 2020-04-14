import { EventEmitter, Injectable } from '@angular/core';
import { OnboardingV2Service } from '../../onboarding-v2/service/onboarding.service';
import { ChannelOnboardingService } from '../../onboarding/channel/onboarding.service';
import { FeaturesService } from '../../../services/features.service';
import { Router } from '@angular/router';

@Injectable()
export class OnboardingWrapperService {
  useV2: boolean;

  get completedPercentage(): number {
    if (this.useV2) {
      return this.onboardingV2Service.completedPercentage;
    } else {
      return this.onboardingService.completedPercentage;
    }
  }

  // v1 only
  get onClose(): EventEmitter<any> {
    return this.onboardingService.onClose;
  }

  constructor(
    private onboardingV2Service: OnboardingV2Service,
    private onboardingService: ChannelOnboardingService,
    private featuresService: FeaturesService,
    private router: Router
  ) {
    this.useV2 = this.featuresService.has('ux-2020');
  }

  open(): void {
    if (this.useV2) {
      this.router.navigate(['/onboarding']);
    } else {
      this.onboardingService.onOpen.emit();
    }
  }

  async checkProgress() {
    if (this.useV2) {
      await this.onboardingV2Service.checkProgress();
    } else {
      await this.onboardingService.checkProgress();
    }
  }
}
