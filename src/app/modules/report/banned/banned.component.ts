import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

import { Client } from '../../../common/api/client.service';
import { JurySessionService } from '../juryduty/session/session.service';
import { Session } from '../../../services/session';

/**
 * When you try to log in to a banned channel,
 * this is the component that tells you that you've
 * been banned, and the reason why.
 *
 * It will also display any appeals associated with the channel.
 */
@Component({
  selector: 'm-reports__banned',
  templateUrl: 'banned.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannedComponent {
  appeals = [];

  constructor(
    private client: Client,
    private sessionService: JurySessionService,
    private cd: ChangeDetectorRef,
    private session: Session
  ) {}

  ngOnInit() {
    this.loadAppeal();
  }

  async loadAppeal() {
    try {
      let response: any = await this.client.get(
        `api/v2/moderation/appeals/review`
      );
      this.appeals = response.appeals;
      this.detectChanges();
    } catch (e) {}
  }

  get reason() {
    const parts = this.session.getLoggedInUser().ban_reason.split('.');
    const isStrike = parseInt(parts[0]) === 14;
    const reasonCode = isStrike ? parseInt(parts[1]) : parseInt(parts[0]);
    const subReasonCode = isStrike
      ? parseInt(parts[2] || 0)
      : parseInt(parts[1] || 0);

    let friendlyString = '';

    if (isStrike) {
      friendlyString = 'exceeding 3 strikes for ';
    }

    return (
      friendlyString +
      this.sessionService.getReasonString({
        reason_code: reasonCode,
        sub_reason_code: subReasonCode,
      })
    );
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
