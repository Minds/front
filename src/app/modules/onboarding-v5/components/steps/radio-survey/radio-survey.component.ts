import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentOnboardingV5OnboardingStep } from '../../../../../../graphql/generated.strapi';
import { OnboardingV5Service } from '../../../services/onboarding-v5.service';
import { FeatureCarouselService } from '../../../../../common/components/feature-carousel/feature-carousel.service';
import { AnalyticsService } from '../../../../../services/analytics';

@Component({
  selector: 'm-onboardingV5__radioSurveyContent',
  templateUrl: './radio-survey.component.html',
  styleUrls: [
    'radio-survey.component.ng.scss',
    '../../../stylesheets/onboarding-v5-common.ng.scss',
  ],
})
export class OnboardingV5RadioSurveyContentComponent implements OnInit {
  @Input() public readonly title: string;
  @Input() public readonly description: string;
  @Input() public readonly data: ComponentOnboardingV5OnboardingStep;

  public formGroup: FormGroup;

  constructor(
    private service: OnboardingV5Service,
    private featuredCarouselService: FeatureCarouselService,
    private analytics: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      selectedKey: new FormControl<string>('', [Validators.required]),
    });
  }

  public onActionButtonClick(): void {
    // TODO: Add save logic.
    const questionKey: string = this.data.radioSurveyQuestionKey;
    const selectedKey: string = this.formGroup.get('selectedKey').value;

    if (questionKey && selectedKey) {
      this.analytics.trackClick(
        `onboarding-segment--${questionKey}--${selectedKey}`
      );
    }

    this.service.continue();
  }

  public onSkipButtonClick(): void {
    this.service.continue();
  }

  public onOptionContainerClick(value: string, index: number): void {
    this.formGroup.get('selectedKey').setValue(value);
    this.featuredCarouselService.jumpToItemIndex$.next(index);
  }
}
