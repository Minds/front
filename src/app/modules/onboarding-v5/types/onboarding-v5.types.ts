import { ComponentOnboardingV5OnboardingStep } from '../../../../graphql/generated.strapi';

// representation of an onboarding step.
export type OnboardingStep = {
  completed: boolean;
  stepType: string;
  data: ComponentOnboardingV5OnboardingStep;
};
