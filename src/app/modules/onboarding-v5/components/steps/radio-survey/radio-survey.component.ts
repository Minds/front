import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentOnboardingV5OnboardingStep } from '../../../../../../graphql/generated.strapi';
import { OnboardingV5Service } from '../../../services/onboarding-v5.service';
import { FeatureCarouselService } from '../../../../../common/components/feature-carousel/feature-carousel.service';
import { AnalyticsService } from '../../../../../services/analytics';
import { OnboardingStepContentInterface } from '../step-content.interface';

/**
 * Radio survey content panel for onboarding v5.
 * Allows a user to relay information requested via survey.
 * Data is submitted via a snowplow click event for analytics
 * and to the engine directly as additional data.
 *
 * WILL move the carousel on option selection - as a design requirement
 * it is intended that CMS provided carousel items for the step
 * will map directly to the radio options.
 */
@Component({
  selector: 'm-onboardingV5__radioSurveyContent',
  templateUrl: './radio-survey.component.html',
  styleUrls: [
    'radio-survey.component.ng.scss',
    '../../../stylesheets/onboarding-v5-common.ng.scss',
  ],
})
export class OnboardingV5RadioSurveyContentComponent
  implements OnInit, OnboardingStepContentInterface
{
  /** Title for section. */
  @Input() public title: string;

  /** Description for section. */
  @Input() public description: string;

  /** Data from CMS. */
  @Input() public data: ComponentOnboardingV5OnboardingStep;

  /** Form group. */
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

  /**
   * On action button click, handle submission of data, continuation to next step,
   * and requesting to submit additional data containing the selected key.
   * @returns { void }
   */
  public onActionButtonClick(): void {
    const stepKey: string = this.data.stepKey;
    const selectedKey: string = this.formGroup.get('selectedKey').value;

    if (stepKey && selectedKey) {
      this.analytics.trackClick(
        `onboarding-segment--${stepKey}--${selectedKey}`
      );
    }

    let additionalData: Object = null;
    if (stepKey === 'onboarding_interest_survey') {
      additionalData = {
        onboarding_interest: selectedKey,
      };
    }

    this.service.continue(additionalData);
  }

  /**
   * On skip button click, handle continuation to next step.
   * @returns { void }
   */
  public onSkipButtonClick(): void {
    this.service.continue();
  }

  /**
   * On option container click, change form value and jump carousel to next index.
   * @param { string } value - value of selected option.
   * @param { number} index - index of carousel item to jump to.
   * @returns { void }
   */
  public onOptionContainerClick(value: string, index: number): void {
    this.formGroup.get('selectedKey').setValue(value);
    this.featuredCarouselService.jumpToItemIndex$.next(index);
  }
}
