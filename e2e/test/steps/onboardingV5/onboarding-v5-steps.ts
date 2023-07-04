import featureCarouselComponent from '../../fragments/onboardingV5/featureCarouselComponent';
import { FeatureCarouselDirection } from '../../types/feature-carousel.types';

namespace OnboardingV5Steps {
  const {
    I,
    onboardingV5ModalComponent,
    onboardingV5VerifyEmailComponent,
    onboardingV5TagSelectorComponent,
    onboardingV5SurveyComponent,
    onboardingV5PublisherRecsComponent,
    onboardingV5CompletionPanelComponent,
  } = inject();

  // General
  Given(
    'I click the onboarding v5 continue button',
    async (): Promise<void> => {
      await onboardingV5ModalComponent.clickContinue();
    }
  );

  Given(
    'I click the onboarding v5 continue button and wait for progress to save',
    async (): Promise<void> => {
      await onboardingV5ModalComponent.clickContinue(true);
    }
  );

  Given('I see the onboarding v5 continue button is disabled', (): void => {
    onboardingV5ModalComponent.isContinueDisabled();
  });

  // Verify email panel
  Given(
    'I fill out onboarding v5 email code input with {string}',
    (code: string) => {
      onboardingV5VerifyEmailComponent.fillCodeInput(code);
      I.wait(1);
    }
  );

  Given(
    'I set an email verification bypass cookie for code {string}',
    (code: string) => {
      onboardingV5VerifyEmailComponent.setBypassCookieForCode(code);
    }
  );

  Then('I see the onboarding v5 modal', (): void => {
    onboardingV5ModalComponent.isVisible();
  });

  // Tag selector panel

  Given(
    'I add a new onboarding v5 tag with the text {string}',
    (tagText: string): void => {
      onboardingV5TagSelectorComponent.addCustomTag(tagText);
    }
  );

  Then('I select {string} onboarding v5 tags', (amountOfTags: string): void => {
    onboardingV5TagSelectorComponent.selectFirstTags(Number(amountOfTags));
  });

  Then(
    'I see an onboarding v5 tag with the text {string}',
    (tagText: string): void => {
      onboardingV5TagSelectorComponent.hasTag(tagText);
    }
  );

  Then('I see the onboarding v5 tag selector panel', (): void => {
    onboardingV5TagSelectorComponent.isVisible();
  });

  // Survey panel

  Given(
    'I select the onboarding v5 survey option at index {string}',
    (optionIndex: string): void => {
      onboardingV5SurveyComponent.selectOptionByIndex(Number(optionIndex));
    }
  );

  Then('I see the onboarding v5 survey panel', (): void => {
    onboardingV5SurveyComponent.isVisible();
  });

  // User selector panel

  Then('I see the onboarding v5 user selector panel', (): void => {
    onboardingV5PublisherRecsComponent.isVisible();
    onboardingV5PublisherRecsComponent.isUserRecommendations();
  });

  // Group selector panel

  Then('I see the onboarding v5 group selector panel', (): void => {
    onboardingV5PublisherRecsComponent.isVisible();
    onboardingV5PublisherRecsComponent.isGroupRecommendations();
  });

  // General publisher recs

  Then(
    'I select the onboarding v5 recommendation at index {string}',
    (index: string): void => {
      onboardingV5PublisherRecsComponent.selectRecommendationByIndex(
        Number(index)
      );
    }
  );

  // Completion Panel

  Then(
    'I see the onboarding v5 completion panel for a short period',
    (): void => {
      onboardingV5CompletionPanelComponent.isVisible();
      onboardingV5CompletionPanelComponent.waitForCompletion();
    }
  );

  // Feature Carousel

  When('I click feature carousel left arrow', (): void => {
    featureCarouselComponent.clickArrow(FeatureCarouselDirection.Back);
  });

  When('I click feature carousel right arrow', (): void => {
    featureCarouselComponent.clickArrow(FeatureCarouselDirection.Forward);
  });

  When(
    'I click feature carousel dot at index {string}',
    (index: string): void => {
      featureCarouselComponent.clickDotAtIndex(Number(index));
    }
  );

  Then(
    'I see feature carousel dot at index {string} is active',
    async (index: string): Promise<void> => {
      await featureCarouselComponent.isDotActiveAtIndex(Number(index));
    }
  );
}
