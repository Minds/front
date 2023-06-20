import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentOnboardingV5ActionButton } from '../../../../../graphql/generated.strapi';

@Component({
  selector: 'm-onboardingV5__footer',
  templateUrl: './footer.component.html',
  styleUrls: ['../../stylesheets/onboarding-v5-common.ng.scss'],
})
export class OnboardingV5FooterComponent {
  @Input() public readonly actionButton: ComponentOnboardingV5ActionButton;
  @Input() public readonly skipButton: ComponentOnboardingV5ActionButton;
  @Input() public readonly hasCompletedStep: boolean = false;
  @Input() public readonly saving: boolean = false;

  @Output() public readonly actionButtonClick = new EventEmitter<boolean>();
  @Output() public readonly skipButtonClick = new EventEmitter<boolean>();

  public onActionButtonClick(): void {
    this.actionButtonClick.emit(true);
  }

  public onSkipButtonClick(): void {
    this.skipButtonClick.emit(true);
  }
}
