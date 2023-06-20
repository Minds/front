import { ComponentOnboardingV5OnboardingStep } from '../../../../graphql/generated.strapi';

export type OnboardingStep = {
  completed: boolean;
  stepType: string;
  data: ComponentOnboardingV5OnboardingStep;
};
