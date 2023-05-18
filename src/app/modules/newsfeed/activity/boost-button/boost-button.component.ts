import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NgStyleValue } from '../../../../common/types/angular.types';

/**
 * Boost button used in activity toolbar.
 * Displayed for owners only (non-owners see the 'tip' button instead)
 */
@Component({
  selector: 'm-activity__boostButton',
  templateUrl: 'boost-button.html',
  styleUrls: ['./boost-button.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityBoostButtonComponent {
  @Input()
  object = {
    guid: undefined,
  };
  boostRecommendationsSubscription: Subscription;
  shouldShowTooltip$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  shouldShowShimmer$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * Get style for settings tooltip bubble.
   * @returns { NgStyleValue } - ngStyle value.
   */
  get tooltipBubbleStyle(): NgStyleValue {
    return {
      right: 0,
      width: '400px',
      bottom: '35px',
    };
  }
}
