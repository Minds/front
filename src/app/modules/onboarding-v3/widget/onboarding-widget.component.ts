import { Component, Injector, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Storage } from '../../../services/storage';
import {
  OnboardingResponse,
  OnboardingV3Service,
  OnboardingStepName,
} from '../onboarding-v3.service';
import { OnboardingV3PanelService } from '../panel/onboarding-panel.service';
import { ModalService } from '../../composer/components/modal/modal.service';
import { ComposerService } from '../../composer/services/composer.service';
import { FormToastService } from '../../../common/services/form-toast.service';

/**
 * Onboarding widget that tracks user progress through onboarding.
 */
@Component({
  selector: 'm-onboardingProgressWidget',
  templateUrl: './onboarding-widget.component.html',
  styleUrls: ['./onboarding-widget.component.ng.scss'],
  providers: [ComposerService],
})
export class OnboardingV3WidgetComponent implements OnInit {
  /**
   * If true, widget will be collapsed.
   */
  public hidden = false;

  constructor(
    private onboarding: OnboardingV3Service,
    private panel: OnboardingV3PanelService,
    private storage: Storage,
    private composerModal: ModalService,
    private injector: Injector,
    private toast: FormToastService
  ) {}

  ngOnInit(): void {
    // if should hide, hide and return
    if (this.shouldHide()) {
      this.hidden = true;
      return;
    }

    // else load
    this.onboarding.load();
  }

  /**
   * Get progress response from the service.
   * @returns Observable<OnboardingResponse> - response from the service.
   */
  get progress$(): Observable<OnboardingResponse> {
    return this.onboarding.progress$;
  }

  /**
   * Called when a task is clicked by the user.
   * @param { OnboardingStepName } - the clicked step.
   * @returns { Promise<void> } - awaitable.
   */
  public async onTaskClick(step: OnboardingStepName): Promise<void> {
    try {
      switch (step) {
        case 'VerifyEmailStep':
          this.toast.inform(
            'Check your inbox for a verification email from us.'
          );
          break;
        case 'CreatePostStep':
          this.composerModal
            .setInjector(this.injector)
            .present()
            .toPromise();
          // TODO: Can we get hold of onPost and trigger the Strikethrough.
          break;
        default:
          this.panel.currentStep$.next(step);
          await this.onboarding.open();
          break;
      }
    } catch (e) {
      if (e === 'DismissedModalException') {
        // Check for changes
        this.onboarding.load();
        return;
      }
      console.error(e);
    }
  }

  /**
   * Called when hide or show is clicked.
   * @param { 'show' | 'hide' } - one of 'show' or 'hide'.
   * @returns { void }
   */
  public onHideClick(option: 'show' | 'hide'): void {
    if (option === 'hide') {
      this.hidden = true;
      const expiryTime = Date.now() + 604800000; // 1 week
      this.storage.set('onboarding:widget:hidden', expiryTime);
      return;
    }
    if (option === 'show') {
      this.hidden = false;
      this.onboarding.load();
      this.storage.destroy('onboarding:widget:hidden');
      return;
    }
  }

  /**
   * Determines whether body of panel should be hidden.
   * @returns { boolean } true if should be hidden.
   */
  private shouldHide(): boolean {
    const storedExpiryTime: string = this.storage.get(
      'onboarding:widget:hidden'
    );
    const parsedExpiryTime = parseInt(storedExpiryTime);

    // if time set and not malformed or null.
    if (!isNaN(parsedExpiryTime)) {
      return Date.now() < parsedExpiryTime;
    }

    return false;
  }
}
