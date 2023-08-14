import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { OnboardingV5Service } from '../../services/onboarding-v5.service';
import { Subscription, take } from 'rxjs';
import {
  ComponentOnboardingV5CompletionStep,
  UploadFile,
} from '../../../../../graphql/generated.strapi';
import { STRAPI_URL } from '../../../../common/injection-tokens/url-injection-tokens';

/**
 * Completed splash screen.
 */
@Component({
  selector: 'm-onboardingV5__completedSplash',
  template: `
    <div class="m-onboardingV5CompletedSplash__centerPanel">
      <img
        *ngIf="imageAttributes?.url; else fallbackIconTemplate"
        class="m-onboardingV5CompletedSplash__image"
        [src]="this.strapiUrl + imageAttributes.url"
        [alt]="imageAttributes?.alt ?? 'Welcome to Minds image'"
      />
      <ng-template #fallbackIconTemplate>
        <i class="material-icons m-onboardingV5CompletedSplash__fallbackIcon"
          >done</i
        >
      </ng-template>
      <h3 class="m-onboardingV5CompletedSplash__message" aria-live="polite">
        {{ message }}
      </h3>
    </div>
  `,
  styleUrls: ['completed-splash.component.ng.scss'],
})
export class OnboardingV5CompletedSplashComponent implements OnInit, OnDestroy {
  /** Message to show on completion. */
  public message: string = 'Welcome to Minds';

  /** Attributes of image to show (will fall back to icon if not set). */
  public imageAttributes: UploadFile;

  /** Data subscription. */
  private dataSubscription: Subscription;

  constructor(
    private service: OnboardingV5Service,
    @Inject(STRAPI_URL) public readonly strapiUrl
  ) {}

  ngOnInit(): void {
    this.dataSubscription = this.service.completionStep$
      .pipe(take(1))
      .subscribe((data: ComponentOnboardingV5CompletionStep): void => {
        this.message = data?.message;
        this.imageAttributes = data?.media?.data?.attributes ?? null;
      });
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }
}
