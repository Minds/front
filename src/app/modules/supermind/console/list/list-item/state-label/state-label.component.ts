import { Component, Input } from '@angular/core';
import {
  Supermind,
  SupermindState,
  SUPERMIND_STATE_MAP,
} from '../../../../supermind.types';
import { SupermindConsoleExpirationService } from '../../../services/supermind-expiration.service';

/**
 * Supermind state label to display Supermind state
 * e.g. `Accepted`, `Revoked`, `Expires: 3h`.
 */
@Component({
  selector: 'm-supermind__stateLabel',
  templateUrl: './state-label.component.html',
  styleUrls: ['./state-label.component.ng.scss'],
})
export class SupermindConsoleStateLabelComponent {
  /** @var { Supermind } supermind - Supermind object */
  @Input() supermind: Supermind = null;

  // allow us to use states in template.
  public supermindStateMap: typeof SUPERMIND_STATE_MAP = SUPERMIND_STATE_MAP;
  public supermindState: typeof SupermindState = SupermindState;

  constructor(private expirationService: SupermindConsoleExpirationService) {}

  /**
   * Time till expiration.
   * @return { string }
   */
  get timeTillExpiration(): string {
    return this.expirationService.getTimeTillExpiration(this.supermind);
  }
}
