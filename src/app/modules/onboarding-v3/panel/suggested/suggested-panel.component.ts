import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  get suggestions$(): Observable<any[]> {
    return this.service.suggestions$.pipe(
      map(arr => {
        // filter out unhydrated
        return arr.filter((entity: any) => entity.entity);
      })
    );
  }

  get inProgress$(): Observable<boolean> {
    return this.service.inProgress$;
  }

  constructor(private service: OnboardingV3SuggestionsPanelService) {}

  ngOnDestroy(): void {
    this.service.clear();
  }

  ngOnInit() {
    this.service.load(this.type);
  }
}
