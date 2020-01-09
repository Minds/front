import { TopicsOnboardingComponent } from './topics/topics.component';
import { SubscriptionsOnboardingComponent } from './subscriptions/subscriptions.component';
import { ChannelSetupOnboardingComponent } from './channel/channel.component';
import { TokenRewardsOnboardingComponent } from './rewards/rewards.component';
import { EventEmitter } from '@angular/core';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { FeaturesService } from '../../../services/features.service';

export class ChannelOnboardingService {
  slides = [
    TopicsOnboardingComponent,
    SubscriptionsOnboardingComponent,
    // GroupsOnboardingComponent,
    ChannelSetupOnboardingComponent,
    TokenRewardsOnboardingComponent,
  ];

  currentSlide: number = 0;
  completed: boolean = false;

  onOpen: EventEmitter<any> = new EventEmitter<any>();

  onClose: EventEmitter<any> = new EventEmitter<any>();

  onSlideChanged: EventEmitter<number> = new EventEmitter<number>();

  completedPercentage: number = -1;
  completedItems: Array<string> = [];
  showOnboarding: boolean = false;

  // these are updated per each slide when calculating the next one, except for the first time onboarding
  pendingItems: Array<string> = [];

  static _(client: Client, session: Session, featuresService: FeaturesService) {
    return new ChannelOnboardingService(client, session, featuresService);
  }

  constructor(
    private client: Client,
    private session: Session,
    private featuresService: FeaturesService
  ) {
    this.session.userEmitter.subscribe(v => {
      if (!v) {
        this.reset();
      }
    });
  }

  async checkProgress() {
    if (
      !this.session.isLoggedIn() ||
      this.featuresService.has('onboarding-december-2019')
    ) {
      return;
    }
    try {
      const response: any = await this.client.get('api/v2/onboarding/progress');

      this.completedPercentage =
        (response.completed_items.length * 100) / response.all_items.length;
      this.completedItems = response.completed_items;
      this.showOnboarding = response.show_onboarding;
    } catch (e) {
      console.error(e);
    }
  }

  async showModal(force: boolean = false) {
    if (
      !this.session.isLoggedIn() ||
      this.featuresService.has('onboarding-december-2019')
    ) {
      return false;
    }
    if (!force) {
      const status = localStorage.getItem('already_onboarded');

      if (status !== null) {
        return false;
      }
    }

    if (this.completedPercentage === -1) {
      await this.checkProgress();
    }

    if (this.completedItems.length > 1) {
      this.next();
    }

    if (force) {
      localStorage.setItem('already_onboarded', '1');
      return true;
    } else if (this.showOnboarding) {
      localStorage.setItem('already_onboarded', '1');
      return true;
    }

    return false;
  }

  previous() {
    if (this.currentSlide === 0) {
      return;
    }

    this.currentSlide--;

    this.onSlideChanged.emit(this.currentSlide);
  }

  next() {
    if (this.currentSlide + 1 >= this.slides.length) {
      this.completed = true;
      this.currentSlide = 0;
      this.onClose.next(true);
      return;
    }

    // first time onboarding
    if (this.completedItems.length === 1) {
      // empty is 1 because username is always there from the beginning
      this.currentSlide++;
    } else {
      // here we just go to the next slide with incomplete stuff
      const i = this.currentSlide + 1;

      this.pendingItems = [];

      const items: Array<string> = (<any>this.slides[i]).items;

      for (let item of items) {
        if (!this.completedItems.includes(item)) {
          this.pendingItems.push(item);
        }
      }

      if (this.pendingItems.length > 0) {
        this.currentSlide = i;
      } else {
        this.currentSlide++;
        this.next();
      }
    }

    this.onSlideChanged.emit(this.currentSlide);
  }

  get slide(): any {
    return this.slides[this.currentSlide];
  }

  reset() {
    this.completedPercentage = -1;
    this.completedItems = [];
    this.showOnboarding = false;
    this.pendingItems = [];
    this.currentSlide = 0;
    this.completed = false;
  }
}
