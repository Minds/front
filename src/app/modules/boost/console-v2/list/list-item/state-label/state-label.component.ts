import { Component, Input } from '@angular/core';
import { Boost, BoostState } from '../../../../boost.types';
import { BoostConsoleService } from '../../../services/console.service';

/**
 * Boost state label to display Boost state
 * e.g. `Approved`, `Pending`, etc.
 */
@Component({
  selector: 'm-boostConsole__stateLabel',
  templateUrl: './state-label.component.html',
  styleUrls: ['./state-label.component.ng.scss'],
})
export class BoostConsoleStateLabelComponent {
  /** @var { Boost } boost - Boost object */
  @Input() boost: Boost = null;

  // allow us to use states in template.
  public boostState: typeof BoostState = BoostState;

  constructor(public service: BoostConsoleService) {}

  /**
   * Time til expiration.
   * @return { string }
   */
  get timeTillExpiration(): string {
    return this.service.getTimeTillExpiration(this.boost);
  }
}
