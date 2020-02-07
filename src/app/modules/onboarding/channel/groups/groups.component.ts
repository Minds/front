import { Component, Input } from '@angular/core';

@Component({
  selector: 'm-channel--onboarding--groups',
  template: `
    <div class="m-channelOnboarding__slide">
      <h2>Join some popular groups</h2>

      <div class="m-channelOnboardingSlide__list">
        <m-suggestions__sidebarGroups></m-suggestions__sidebarGroups>
      </div>
    </div>
  `,
})
export class GroupsOnboardingComponent {
  static items = ['suggested_groups'];
  static canSkip: boolean = true;

  @Input() pendingItems: Array<string>;
}
