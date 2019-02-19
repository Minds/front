import { Component, Input } from '@angular/core';

@Component({
  selector: 'm-channel--onboarding--subscriptions',
  template: `
    <div class="m-channelOnboarding__slide">
      <h2>Subscribe to some popular channels</h2>
      <div class="m-channelOnboardingSlide__list">
        <m-suggestions__sidebar></m-suggestions__sidebar>
      </div>
    </div>
  `
})

export class SubscriptionsOnboardingComponent {
  static items = ['suggested_channels'];
  static canSkip: boolean = true;
  @Input() pendingItems: Array<string>;
}