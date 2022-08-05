import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DefaultTagsV2ExperimentService } from '../../../experiments/sub-services/default-tags-v2-experiment.service';
import { OnboardingV3TagsService, Tag } from './tags.service';

/**
 * Onboarding tags selection component
 */
@Component({
  selector: 'm-onboardingV3__tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.ng.scss'],
  host: {
    '[class.m-onboardingV3__tags--fullWidth]': 'defaultTagsV2ExperimentActive',
  },
})
export class OnboardingV3TagsComponent implements OnInit {
  public defaultTagsV2ExperimentActive = false;

  constructor(
    private service: OnboardingV3TagsService,
    private defaultTagsV2Experiment: DefaultTagsV2ExperimentService
  ) {}

  ngOnInit() {
    // load tags on init
    this.defaultTagsV2ExperimentActive = this.defaultTagsV2Experiment.isActive();
    this.service.loadTags();
  }

  /**
   * Gets tags$ to display from service.
   * @returns { BehaviorSubject<Tag[]> } - Behaviour subject array of tags to present.
   */
  get tags$(): BehaviorSubject<Tag[]> {
    return this.service.tags$;
  }

  /**
   * Toggles a tag, passing it to the service
   * @param { string } tagValue - value matching the value of a tag.
   * @returns { void }
   */
  public toggleTag(tagValue: string): void {
    this.service.toggleTag(tagValue);
  }
}
