import { Injectable } from '@angular/core';
import { Supermind } from '../../supermind.types';
import * as moment from 'moment';

/**
 * Service handling the getting of time till a Superminds expiration as a user
 * friendly string.
 */
@Injectable({ providedIn: 'root' })
export class SupermindConsoleExpirationService {
  /**
   * Time till expiration.
   * @return { string }
   */
  public getTimeTillExpiration(supermind: Supermind): string {
    const date = moment(
      (supermind.created_timestamp + supermind.expiry_threshold) * 1000
    );
    const duration = moment.duration(moment(date).diff(moment()));
    const daysRemaining = duration.days();
    const hoursRemaining = duration.hours();
    const minutesRemaining = duration.minutes();
    const secondsRemaining = duration.seconds();

    if (daysRemaining > 0) {
      return `${daysRemaining}d`;
    }
    if (hoursRemaining > 0) {
      return `${hoursRemaining}h`;
    }
    if (minutesRemaining > 0) {
      return `${minutesRemaining}m`;
    }
    if (secondsRemaining > 0) {
      return `${secondsRemaining}s`;
    }

    return '';
  }
}
