import { Injectable, Injector, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../services/ux/modal.service';
import { OnboardingTagsExperimentService } from '../experiments/sub-services/onboarding-tags-experiment.service';
import { ContentSettingsComponent } from '../content-settings/content-settings/content-settings.component';
import { PublisherRecommendationsModalComponent } from '../suggestions/publisher-recommendations-modal/publisher-recommendations-modal.component';
import { Subscription, filter, take } from 'rxjs';
import { EmailConfirmationService } from '../../common/components/email-confirmation/email-confirmation.service';
import { DiscoveryTagsService } from '../discovery/tags/tags.service';

/**
 * Core service for onboarding v4.
 * After new user's email is confirmed,
 * displays the mandatory tag selection modal and
 * maybe followed by channel/group subscription modals
 * (depending on onboarding tags experiment)
 */
@Injectable({
  providedIn: 'root',
})
export class OnboardingV4Service implements OnDestroy {
  /** @type { Subscription } - subscription that fires on email confirmation */
  private emailConfirmationSubscription: Subscription;

  public channelSubscriptionCount = 0;

  constructor(
    private emailConfirmation: EmailConfirmationService,
    private injector: Injector,
    private modalService: ModalService,
    private tagsService: DiscoveryTagsService,
    private onboardingTagsExperiment: OnboardingTagsExperimentService
  ) {
    this.setupEmailConfirmationSubscription();
  }

  ngOnDestroy(): void {
    if (this.emailConfirmationSubscription) {
      this.emailConfirmationSubscription.unsubscribe();
    }
  }

  public async startOnboarding(): Promise<any> {
    this.openTagsModal();
  }

  /**
   * Starts the onboarding flow with a mandatory tag selection modal
   */
  private async openTagsModal(): Promise<any> {
    const modal = this.modalService.present(ContentSettingsComponent, {
      data: {
        onSave: () => {
          modal.close();
          this.openPublisherRecommendationsModal();
        },
        isOnboarding: true,
      },
      injector: this.injector,
    });
    return modal.result;
  }

  /**
   * Opens publisher recommendations modal
   * If the experiment is active
   */
  private async openPublisherRecommendationsModal(): Promise<void> {
    // if (!this.onboardingTagsExperiment.isActive()) {
    //   return;
    // }
    const modal = this.modalService.present(
      PublisherRecommendationsModalComponent,
      {
        data: {
          onContinue: () => {
            modal.close();
            this.openGroupRecommendationModal();
          },
          onSkip: () => {
            modal.close();
            this.openGroupRecommendationModal();
          },
          publisherType: 'user',
        },
        injector: this.injector,
        windowClass: 'm-modalV2__mobileFullCover',
      }
    );
    return modal.result;
  }

  /**
   * Opens group recommendations modal
   * If the experiment is on
   */
  private async openGroupRecommendationModal(): Promise<void> {
    // if (
    //   !this.onboardingTagsExperiment.isActive() ||
    //   this.channelSubscriptionCount < 1
    // ) {
    //   return;
    // }
    const modal = this.modalService.present(
      PublisherRecommendationsModalComponent,
      {
        data: {
          onContinue: () => {
            modal.close();
          },
          onSkip: () => {
            modal.close();
          },
          publisherType: 'group',
        },
        injector: this.injector,
        windowClass: 'm-modalV2__mobileFullCover',
      }
    );
    return modal.result;
  }

  /**
   * Setup subscription to email confirmation, that will open the modal automatically on confirmation.
   * @returns { void }
   */
  private setupEmailConfirmationSubscription(): void {
    if (!this.emailConfirmationSubscription) {
      this.emailConfirmationSubscription = this.emailConfirmation.success$
        .pipe(filter(Boolean), take(1))
        .subscribe(async (success: boolean) => {
          if (!(await this.tagsService.hasSetTags())) {
            this.startOnboarding();
          }
        });
    }
  }
}
