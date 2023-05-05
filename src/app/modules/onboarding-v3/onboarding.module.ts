import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { OnboardingV3Service } from './onboarding-v3.service';

/**
 * Non-lazy loaded module.
 */
@NgModule({
  imports: [NgCommonModule, CommonModule],
  providers: [OnboardingV3Service],
})
export class OnboardingV3Module {}
