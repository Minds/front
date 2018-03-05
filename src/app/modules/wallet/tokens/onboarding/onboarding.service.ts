
import { TokenIntroductionOnboardingComponent } from './introduction/introduction.component';
import { TokenRewardsOnboardingComponent } from './rewards/rewards.component';
import { TokenOnChainOnboardingComponent } from './onchain/onchain.component';
import { TokenCompletedOnboardingComponent } from './completed/completed.component';

export class TokenOnboardingService {

  slides = [
    TokenIntroductionOnboardingComponent,
    TokenRewardsOnboardingComponent,
    TokenOnChainOnboardingComponent,
    TokenCompletedOnboardingComponent
  ];

  currentSlide: number = 0;
  completed: boolean = false;

  next() {
    if (this.currentSlide > this.slides.length) {
      this.completed = true;
      return;
    }
    this.currentSlide++;
  }

  get slide(): any {
    return this.slides[this.currentSlide];
  }

}