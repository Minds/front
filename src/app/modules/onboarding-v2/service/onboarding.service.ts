import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

type Step = {
  name: string;
  selected: boolean;
  route: string;
  items: string[];
  completedItems: string[];
};

export class OnboardingV2Service {
  steps: Step[] = [
    {
      name: 'Hashtags',
      selected: false,
      route: '/onboarding/hashtags',
      items: ['suggested_hashtags'],
      completedItems: [],
    },
    {
      name: 'Info',
      selected: false,
      route: '/onboarding/info',
      items: ['token_verification', 'dob', 'location'],
      completedItems: [],
    },
    {
      name: 'Avatar',
      selected: false,
      route: '/onboarding/avatar',
      items: ['avatar'],
      completedItems: [],
    },
    // {
    //   name: 'Groups',
    //   selected: false,
    //   route: '/onboarding/groups',
    //   items: ['suggested_groups'],
    //   completedItems: [],
    // },
    // {
    //   name: 'Channels',
    //   selected: false,
    //   route: '/onboarding/channels',
    //   items: ['suggested_channels'],
    //   completedItems: [],
    // },
  ];

  currentSlide: number = -1;
  completed: boolean = false;

  completedPercentage: number = -1;
  completedItems: Array<string> = [];
  showOnboarding: boolean = false;
  finishedLoading: EventEmitter<any> = new EventEmitter<any>();
  loaded: boolean = false;

  slideChanged: EventEmitter<number> = new EventEmitter<number>();
  close: EventEmitter<any> = new EventEmitter<any>();

  static _(client: Client, session: Session) {
    return new OnboardingV2Service(client, session);
  }

  constructor(
    private client: Client,
    private session: Session
  ) {}

  async checkProgress() {
    try {
      const response: any = await this.client.get('api/v2/onboarding/progress');

      this.completedPercentage =
        (response.completed_items.length * 100) / response.all_items.length;
      this.completedItems = response.completed_items;
      this.showOnboarding = response.show_onboarding;

      this.populateCompletedItems();
      this.finishedLoading.emit();
      this.loaded = true;
    } catch (e) {
      console.error(e);
    }
  }

  async shouldShow() {
    if (!this.session.isLoggedIn()) {
      return false;
    }
    try {
      if (this.completedPercentage === -1) {
        await this.checkProgress();
      }

      if (this.completedItems.length > 1) {
        this.next();
      }
      return this.showOnboarding;
    } catch (e) {
      console.error(e);
    }

    return false;
  }

  async shown() {
    try {
      const response: any = await this.client.post(
        'api/v2/onboarding/onboarding_shown'
      );
    } catch (e) {
      console.log(e.message);
    }
  }

  next() {
    if (this.currentSlide + 1 >= this.steps.length) {
      this.completed = true;
      this.currentSlide = 0;
      this.close.emit();
      return;
    }

    // first time onboarding
    if (this.completedItems.length === 0) {
      this.currentSlide++;
    } else {
      // here we just go to the next slide with incomplete stuff
      this.currentSlide++;

      if (this.getPendingItems().length === 0) {
        this.next();
        return;
      }
    }

    this.slideChanged.emit(this.currentSlide);
  }

  setCurrentStep(name: string): void {
    this.currentSlide = this.steps.findIndex(
      (step) => step.name.toLowerCase() === name.toLowerCase()
    );
  }

  getPendingItems(): string[] {
    const step = this.steps[this.currentSlide];
    return step.items.filter((x) => !step.completedItems.includes(x));
  }

  private populateCompletedItems() {
    for (const step of this.steps) {
      for (const stepItem of step.items) {
        if (this.completedItems.indexOf(stepItem) !== -1) {
          step.completedItems.push(stepItem);
        }
      }
    }
  }
}
