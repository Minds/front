import { Injectable, Injector, OnDestroy } from '@angular/core';
import { ApiService } from '../../common/api/api.service';
import { ModalService } from '../../services/ux/modal.service';
import { OnboardingTagsExperimentService } from '../experiments/sub-services/onboarding-tags-experiment.service';
import { TagSettingsComponent } from '../tag-settings/tag-settings/tag-settings.component';
import { ContentSettingsComponent } from '../content-settings/content-settings/content-settings.component';
import { ChannelRecommendationComponent } from '../suggestions/channel-recommendation/channel-recommendation.component';
import { ChannelRecommendationModalComponent } from '../suggestions/channel-recommendation-modal/channel-recommendation-modal.component';
import { Subscription, filter, take } from 'rxjs';
import { EmailConfirmationService } from '../../common/components/email-confirmation/email-confirmation.service';
import { DiscoveryTagsService } from '../discovery/tags/tags.service';

/**
 * Core service for onboarding v4
 * For the mandatory tag selection modal
 * followed by maybe-mandatory channel/group subscription modals
 * (depending on onboarding tags experiment)
 */
@Injectable({
  providedIn: 'root',
})
export class OnboardingV4Service implements OnDestroy {
  /** @type { Subscription } - subscription that fires on email confirmation */
  private emailConfirmationSubscription: Subscription;

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
    console.log('ojm V4_SVC startOnboarding()');
    this.openTagsModal();
  }

  /**
   * Starts the onboarding flow with a mandatory tag selection modal
   */
  private async openTagsModal(): Promise<any> {
    console.log('ojm V4_SVC openTagsModal()');
    const modal = this.modalService.present(ContentSettingsComponent, {
      data: {
        onSave: () => {
          console.log('ojm V4_SVC tagsModal onSave');
          modal.close();
          this.openChannelRecommendationModal();
        },
        isOnboarding: true,
      },
      injector: this.injector,
    });
    return modal.result;
  }

  /**
   * Opens channel recommendations modal
   *
   * Selections may be mandatory, depending on experiment
   */
  private async openChannelRecommendationModal(): Promise<void> {
    console.log('ojm V4_SVC openSuggestedChannelsModal()');
    const modal = this.modalService.present(
      ChannelRecommendationModalComponent,
      {
        data: {
          onContinue: () => {
            console.log('ojm V4_SVC channelRecs onContinue');
            modal.close();
            //ojm  this.openGroupRecommendationModal();
          },
          onSkip: () => {
            console.log('ojm V4_SVC channelRecs onSkip');
            modal.close();
            //ojm this.openGroupRecommendationModal();
          },
          isMandatory: this.onboardingTagsExperiment.isActive(),
        },
        injector: this.injector,
        windowClass: 'm-modalV2__mobileFullCover', // ojm only do this if time, and do it for the tags one too
      }
    );
    return modal.result;
  }

  private async openGroupRecommendationModal(): Promise<void> {
    // ojm todo after group endpoint is implemented
    console.log('ojm V4_SVC openSuggestedGroupsModal()');
  }

  private completeOnboarding(): void {
    // ojm do I need to re-route here? Or do anything?
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
