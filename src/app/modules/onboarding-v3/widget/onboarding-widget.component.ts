import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  OnboardingResponse,
  OnboardingV3Service,
  OnboardingStepName,
} from '../onboarding-v3.service';
import { OnboardingV3PanelService } from '../panel/onboarding-panel.service';
import { ModalService } from '../../composer/components/modal/modal.service';
import { ComposerService } from '../../composer/services/composer.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { OnboardingV3StorageService } from '../onboarding-storage.service';

/**
 * Onboarding widget that tracks user progress through onboarding.
 */
@Component({
  selector: 'm-onboardingProgressWidget',
  templateUrl: './onboarding-widget.component.html',
  styleUrls: ['./onboarding-widget.component.ng.scss'],
  providers: [ComposerService],
})
export class OnboardingV3WidgetComponent implements OnInit, OnDestroy {
  /**
   * If true, widget will be collapsed.
   */
  public collapsed = false;

  /**
   * If true, all steps are completed.
   */
  public completed = false;

  /**
   * If true, widget is hidden
   */
  public hidden = false;

  private progressSubscription: Subscription;

  constructor(
    private onboarding: OnboardingV3Service,
    private panel: OnboardingV3PanelService,
    private onboardingStorage: OnboardingV3StorageService,
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

    // if should collapse, collapse and return
    if (this.shouldCollapse()) {
      this.collapsed = true;
      return;
    }

    // else load
    this.onboarding.load();

    // sub to progress; hide if completed.
    this.progressSubscription = this.progress$.subscribe(progress => {
      if (progress && progress.is_completed) {
        this.completed = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
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
            .toPromise()
            .then(response => {
              // if activity posted, manually strike through task.
              if (response) {
                this.onboarding.strikeThrough('CreatePostStep');
              }
            });
          break;
        default:
          this.panel.currentStep$.next(step);
          await this.onboarding.open();
          break;
      }
    } catch (e) {
      if (e === 'DismissedModalException') {
        if (this.onboarding.loadOverrideSteps.indexOf(step) === -1) {
          this.onboarding.load();
        }
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
      this.collapsed = true;
      this.onboardingStorage.set('onboarding:widget:collapsed');
      return;
    }
    if (option === 'show') {
      this.collapsed = false;
      this.onboarding.load();
      this.onboardingStorage.destroy('onboarding:widget:collapsed');
      return;
    }
  }

  /**
   * Determines whether body of panel should be collapsed.
   * @returns { boolean } true if should be hidden.
   */
  private shouldCollapse(): boolean {
    return this.onboardingStorage.hasNotExpired('onboarding:widget:collapsed');
  }

  /**
   * Determines whether widget should be hidden.
   * @returns { boolean } true if should be hidden.
   */
  private shouldHide(): boolean {
    return this.onboardingStorage.hasNotExpired('onboarding:widget:completed');
  }
}
