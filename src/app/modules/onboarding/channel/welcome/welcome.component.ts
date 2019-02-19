import { Component, EventEmitter, Output } from '@angular/core';
import { Client } from "../../../../services/api/client";

@Component({
  selector: 'm-onboarding--welcome',
  template: `
    <div class="m-channelOnboarding__slide">
      <h2>Welcome to Minds!</h2>
      <div class="m-channelOnboardingSlide__column">
        <p class="m-channelOnboardingSlide__subtext">
          Before you get started, there are a few things we need to know to provide
          you with the best experience.
        </p>
        <p class="m-channelOnboardingSlide__subtext">
          First off, how often do you post to social media?
        </p>
      </div>
      <div class="m-channelOnboardingSlide__column">
        <ul class="m-channelOnboardingSlide__frequency">
          <li (click)="select('rarely')">
            Rarely
            <i class="material-icons">
              keyboard_arrow_right
            </i>
          </li>
          <li (click)="select('sometimes')">
            Sometimes
            <i class="material-icons">
              keyboard_arrow_right
            </i>
          </li>
          <li (click)="select('frequently')">
            Frequently
            <i class="material-icons">
              keyboard_arrow_right
            </i>
          </li>
        </ul>
      </div>

    </div>
  `
})

export class WelcomeOnboardingComponent {
  static items = ['creator_frequency'];
  static canSkip: boolean = false;
  minds = window.Minds;

  @Output() onClose: EventEmitter<any> = new EventEmitter();

  constructor(
      private client: Client,
  ) { }

  async select(option: 'rarely' | 'sometimes' | 'frequently') {
    try {
      await this.client.post('api/v2/onboarding/creator_frequency', { value: option });
    } catch (e) {
      console.error(e);
    }
    this.onClose.emit();
  }
}