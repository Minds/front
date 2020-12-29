import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  OnboardingPanelSuggestionsType,
  OnboardingV3SuggestionsPanelService,
} from './suggested-panel.service';

/**
 * Panel containing suggestions. Can be set to channel or group.
 */
@Component({
  selector: 'm-onboardingV3__suggestionsPanel',
  templateUrl: 'suggested-panel.component.html',
  styleUrls: ['./suggested-panel.component.ng.scss'],
})
export class OnboardingV3SuggestionsPanelComponent {
  @Input() type: OnboardingPanelSuggestionsType = 'channels';

  /**
   * holds suggestions
   * @returns { BehaviorSubject<any[]> }
   */
  get suggestions$(): BehaviorSubject<any[]> {
    return this.service.suggestions$;
  }

  constructor(private service: OnboardingV3SuggestionsPanelService) {}

  ngOnInit() {
    this.service.load(this.type);
  }
}
