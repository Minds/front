import { ComponentOnboardingV5OnboardingStep } from '../../../../graphql/generated.strapi';

/** Representation of an onboarding step. */
export type OnboardingStep = {
  completed: boolean;
  stepType: string;
  data: ComponentOnboardingV5OnboardingStep;
};

/** Sub-panels for verify email step */
export enum OnboardingV5VerifyEmailSubPanel {
  CODE_INPUT,
  CHANGE_EMAIL,
}
