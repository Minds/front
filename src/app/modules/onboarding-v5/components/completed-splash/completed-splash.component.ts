import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { OnboardingV5Service } from '../../services/onboarding-v5.service';
import { Subscription, take } from 'rxjs';
import {
  ComponentOnboardingV5CompletionStep,
  UploadFile,
} from '../../../../../graphql/generated.strapi';
import { STRAPI_URL } from '../../../../common/injection-tokens/url-injection-tokens';

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
      <h3 class="m-onboardingV5CompletedSplash__message">{{ message }}</h3>
    </div>
  `,
  styleUrls: ['completed-splash.component.ng.scss'],
})
export class OnboardingV5CompletedSplashComponent implements OnInit, OnDestroy {
  public message: string = 'Welcome to Minds';
  public imageAttributes: UploadFile;

  private dataSubscription: Subscription;
  private dismissalSubscription: Subscription;

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
    this.dismissalSubscription?.unsubscribe();
  }
}
