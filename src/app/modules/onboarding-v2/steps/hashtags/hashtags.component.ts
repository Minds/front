import { Component, OnInit } from '@angular/core';
import { TopbarHashtagsService } from '../../../hashtags/service/topbar.service';
import { Router } from '@angular/router';
import { Storage } from '../../../../services/storage';
import { OnboardingV2Service } from '../../service/onboarding.service';

type Hashtag = {
  value: string;
  selected: boolean;
};

@Component({
  selector: 'm-onboarding__hashtagsStep',
  templateUrl: 'hashtags.component.html',
})
export class HashtagsStepComponent implements OnInit {
  hashtags: Array<Hashtag> = [];
  error: string;
  inProgress: boolean;
  pendingItems: string[];

  constructor(
    protected onboardingService: OnboardingV2Service,
    private service: TopbarHashtagsService,
    private storage: Storage
  ) {
    this.onboardingService.setCurrentStep('hashtags');
    this.pendingItems = this.onboardingService.getPendingItems();
  }

  ngOnInit() {
    this.storage.set('preferred_hashtag_state', '1'); // turn on preferred hashtags for discovery
    this.load();
  }

  async load() {
    this.inProgress = true;

    try {
      this.hashtags = await this.service.load(14);
    } catch (e) {
      console.error(e);
    }

    this.inProgress = false;
  }

  async toggleSelection(hashtag) {
    this.error = null;
    try {
      await this.service.toggleSelection(hashtag, this);
    } catch (e) {
      this.error = (e && e.message) || 'Sorry, something went wrong';
      hashtag.selected = !hashtag.selected;
    }
  }

  skip() {
    this.onboardingService.next();
  }

  continue() {
    if (this.validate()) {
      this.onboardingService.next();
    }
  }

  private validate() {
    this.error = null;

    if (this.hashtags.filter((item) => item.selected).length < 3) {
      this.error = 'not:enough:hashtags';
      return false;
    }

    return true;
  }
}
