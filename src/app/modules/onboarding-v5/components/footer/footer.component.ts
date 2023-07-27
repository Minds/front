import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentOnboardingV5ActionButton } from '../../../../../graphql/generated.strapi';
import { OnboardingV5Service } from '../../services/onboarding-v5.service';
import { BehaviorSubject } from 'rxjs';

/**
 * Footer component for onboarding v5 modal.
 */
@Component({
  selector: 'm-onboardingV5__footer',
  templateUrl: './footer.component.html',
  styleUrls: ['../../stylesheets/onboarding-v5-common.ng.scss'],
})
export class OnboardingV5FooterComponent {
  /** Data for action button. */
  @Input() public readonly actionButton: ComponentOnboardingV5ActionButton;

  /** Data for skip button (interpreted as the step not being skippable if not present). */
  @Input() public readonly skipButton: ComponentOnboardingV5ActionButton;

  /** Whether button should show a saving state. */
  @Input() public readonly saving: boolean = false;

  /** Whether action button should be disabled (NOT skip button). */
  @Input() public readonly disabledActionButton: boolean = false;

  /** Emits on action button click. */
  @Output() public readonly actionButtonClick = new EventEmitter<boolean>();

  /** Emits on skip button click. */
  @Output() public readonly skipButtonClick = new EventEmitter<boolean>();

  /** Whether completion is in progress (used to extend loading spinner during animation delay). */
  public readonly completionInProgress$: BehaviorSubject<boolean> = this.service
    .completionInProgress$;

  constructor(private service: OnboardingV5Service) {}

  /**
   * Fires on action button click and emits Output event.
   * @returns { void }
   */
  public onActionButtonClick(): void {
    this.actionButtonClick.emit(true);
  }

  /**
   * Fires on action button click and emits Output event.
   * @returns { void }
   */
  public onSkipButtonClick(): void {
    this.skipButtonClick.emit(true);
  }
}
